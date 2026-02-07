'use client';

import {Box, HStack, Text, Button, Separator} from '@chakra-ui/react';
import {Suspense, useState, useEffect, useCallback} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {useChain} from '@interchain-kit/react';
import {getChainName} from '@/constants/chain';
import {Plus, Info} from 'lucide-react';
import {getAllArticles} from '@/query/cointrunk_articles';
import {isPublisher} from '@/query/cointrunk_publishers';
import type {ArticleProps} from '@/types/article';
import {ArticleCard} from '@/components/articles/article-card';
import {ArticleSkeleton} from '@/components/articles/article-skeleton';
import {FeedPagination} from '@/components/articles/feed-pagination';
import {AddArticleModal} from '@/components/articles/add-article-modal';
import {AboutModal, useAboutModal} from '@/components/articles/about-modal';

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

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles, refreshKey]);

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

    const handlePublishSuccess = () => {
        setRefreshKey((k) => k + 1);
    };

    return (
        <Box maxW="2xl" mx="auto" minH="100vh" borderLeftWidth="1px" borderRightWidth="1px" borderColor="surface.border">
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
