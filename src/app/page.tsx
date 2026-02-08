'use client';

import {Box, HStack, Text, Button, Separator, Spinner} from '@chakra-ui/react';
import {Suspense, useState, useEffect, useCallback, useRef} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {useChain} from '@interchain-kit/react';
import {getChainName} from '@/constants/chain';
import {Plus, Info, RefreshCw} from 'lucide-react';
import {getAllArticles} from '@/query/cointrunk_articles';
import {isPublisher} from '@/query/cointrunk_publishers';
import type {ArticleProps} from '@/types/article';
import {ArticleCard} from '@/components/articles/article-card';
import {ArticleSkeleton} from '@/components/articles/article-skeleton';
import {FeedPagination} from '@/components/articles/feed-pagination';
import {AddArticleModal} from '@/components/articles/add-article-modal';
import {AboutModal, useAboutModal} from '@/components/articles/about-modal';
import {addMultipleDebounce} from '@/utils/debounce';

const PAGE_SIZE = 10;

function ArticlesFeed() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {address} = useChain(getChainName());

    const [articles, setArticles] = useState<ArticleProps[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPublisherUser, setIsPublisherUser] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const {open: showAbout, dismiss: dismissAbout, show: showAboutModal} = useAboutModal();
    const [refreshKey, setRefreshKey] = useState(0);

    // Pull-to-refresh state
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const touchStartY = useRef(0);
    const lastRefreshTime = useRef(0);
    const isPulling = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const PULL_THRESHOLD = 80;
    const REFRESH_COOLDOWN = 5000;

    const pollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const POLLING_INTERVAL_MS = 60000;

    const page = Number(searchParams.get('page') || '1');
    const totalPages = Math.ceil(total / PAGE_SIZE);

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        const offset = (page - 1) * PAGE_SIZE;
        const result = await getAllArticles(PAGE_SIZE, offset);
        setArticles(result.articles);
        setTotal(result.total);
        setLoading(false);
    }, [page]);

    const silentFetchArticles = useCallback(async () => {
        const offset = (page - 1) * PAGE_SIZE;
        const result = await getAllArticles(PAGE_SIZE, offset);
        setArticles(result.articles);
        setTotal(result.total);
    }, [page]);

    const resetPollingInterval = useCallback(() => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
        }
        pollingInterval.current = setInterval(silentFetchArticles, POLLING_INTERVAL_MS);
    }, [silentFetchArticles]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles, refreshKey]);

    // Silent 60s auto-refresh polling
    useEffect(() => {
        pollingInterval.current = setInterval(silentFetchArticles, POLLING_INTERVAL_MS);
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [silentFetchArticles]);

    useEffect(() => {
        if (address) {
            isPublisher(address).then(setIsPublisherUser);
        } else {
            setIsPublisherUser(false);
        }
    }, [address]);

    const handlePageChange = (newPage: number) => {
        router.push(`/?page=${newPage}`);
    };

    const handleRefresh = useCallback(async () => {
        if (isRefreshing || Date.now() - lastRefreshTime.current < REFRESH_COOLDOWN) return;
        setIsRefreshing(true);
        lastRefreshTime.current = Date.now();
        await fetchArticles();
        setIsRefreshing(false);
        resetPollingInterval();
    }, [isRefreshing, fetchArticles, resetPollingInterval]);

    const handlePublishSuccess = () => {
        setRefreshKey((k) => k + 1);
        addMultipleDebounce('article-refetch', 1000, fetchArticles, 2);
        resetPollingInterval();
    };

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (window.scrollY <= 0 && !isRefreshing) {
            touchStartY.current = e.touches[0].clientY;
            isPulling.current = true;
        }
    }, [isRefreshing]);

    // Native non-passive touchmove listener so we can preventDefault
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleTouchMove = (e: TouchEvent) => {
            if (!isPulling.current) return;
            const distance = e.touches[0].clientY - touchStartY.current;
            if (distance > 0) {
                e.preventDefault();
                setPullDistance(Math.min(distance, PULL_THRESHOLD * 1.5));
            } else {
                isPulling.current = false;
                setPullDistance(0);
            }
        };

        el.addEventListener('touchmove', handleTouchMove, {passive: false});
        return () => el.removeEventListener('touchmove', handleTouchMove);
    }, []);

    const handleTouchEnd = useCallback(async () => {
        if (!isPulling.current) return;
        isPulling.current = false;

        if (pullDistance >= PULL_THRESHOLD && Date.now() - lastRefreshTime.current >= REFRESH_COOLDOWN) {
            setIsRefreshing(true);
            lastRefreshTime.current = Date.now();
            await fetchArticles();
            setIsRefreshing(false);
            resetPollingInterval();
        }
        setPullDistance(0);
    }, [pullDistance, fetchArticles, resetPollingInterval]);

    return (
        <Box
            ref={containerRef}
            maxW="2xl"
            mx="auto"
            minH="100vh"
            borderLeftWidth="1px"
            borderRightWidth="1px"
            borderColor="surface.border"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull-to-refresh indicator */}
            {(pullDistance > 0 || isRefreshing) && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    py="3"
                    color="content.muted"
                    overflow="hidden"
                    height={isRefreshing ? '48px' : `${pullDistance * 0.6}px`}
                    transition={isPulling.current ? 'none' : 'height 0.2s ease-out'}
                >
                    {isRefreshing ? (
                        <Spinner size="sm" color="brand.accent" />
                    ) : (
                        <Text
                            fontSize="xs"
                            color="content.muted"
                            opacity={pullDistance >= PULL_THRESHOLD ? 1 : pullDistance / PULL_THRESHOLD}
                        >
                            {pullDistance >= PULL_THRESHOLD ? 'Release to refresh' : 'Pull down to refresh'}
                        </Text>
                    )}
                </Box>
            )}
            {/* Sticky header */}
            <Box
                position="sticky"
                top="0"
                zIndex="10"
                bg="surface.primary/80"
                backdropFilter="blur(12px)"
                borderBottomWidth="1px"
                borderColor="surface.border"
                px="4"
                py="3"
            >
                <HStack justify="space-between">
                    <HStack gap="2">
                        <Text fontSize="xl" fontWeight="black" color="content.primary">
                            Articles
                        </Text>
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={showAboutModal}
                            color="content.muted"
                            p="0"
                            minW="auto"
                        >
                            <Info size={16}/>
                        </Button>
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={handleRefresh}
                            color="content.muted"
                            p="0"
                            minW="auto"
                            disabled={isRefreshing}
                        >
                            <RefreshCw
                                size={14}
                                style={isRefreshing ? {animation: 'spin 1s linear infinite'} : undefined}
                            />
                        </Button>
                    </HStack>
                    {address && (
                        <Button
                            size="sm"
                            bg="brand.accent"
                            color="white"
                            _hover={{opacity: 0.9}}
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus size={16}/>
                            Publish
                        </Button>
                    )}
                </HStack>
            </Box>

            {/* Content */}
            {loading ? (
                <>
                    {Array.from({length: 5}).map((_, i) => (
                        <Box key={i}>
                            <ArticleSkeleton/>
                            {i < 4 && <Separator borderColor="surface.border"/>}
                        </Box>
                    ))}
                </>
            ) : articles.length > 0 ? (
                <>
                    {articles.map((article, i) => (
                        <Box key={article.id}>
                            <ArticleCard article={article} index={i}/>
                            {i < articles.length - 1 && <Separator borderColor="surface.border"/>}
                        </Box>
                    ))}
                    <FeedPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <Box textAlign="center" py="16">
                    <Text fontSize="4xl" mb="2">📰</Text>
                    <Text fontSize="lg" fontWeight="bold" color="content.primary" mb="1">
                        No Articles Yet
                    </Text>
                    <Text fontSize="sm" color="content.muted">
                        Be the first to publish an article!
                    </Text>
                </Box>
            )}

            <AddArticleModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handlePublishSuccess}
                isPublisherUser={isPublisherUser}
            />

            <AboutModal
                isOpen={showAbout}
                onClose={dismissAbout}
            />
        </Box>
    );
}

export default function ArticlesPage() {
    return (
        <Suspense fallback={
            <Box maxW="2xl" mx="auto" minH="100vh" borderLeftWidth="1px" borderRightWidth="1px" borderColor="surface.border">
                {Array.from({length: 5}).map((_, i) => (
                    <ArticleSkeleton key={i}/>
                ))}
            </Box>
        }>
            <ArticlesFeed/>
        </Suspense>
    );
}
