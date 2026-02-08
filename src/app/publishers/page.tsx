'use client';

import {Box, Text, Separator} from '@chakra-ui/react';
import {useState, useEffect, useCallback} from 'react';
import {getAllPublishers} from '@/query/cointrunk_publishers';
import type {PublisherProps} from '@/types/article';
import {PublisherCard} from '@/components/articles/publisher-card';
import {ArticleSkeleton} from '@/components/articles/article-skeleton';

const POLLING_INTERVAL_MS = 60000;

export default function PublishersPage() {
    const [publishers, setPublishers] = useState<PublisherProps[]>([]);
    const [loading, setLoading] = useState(true);

    const silentFetchPublishers = useCallback(async () => {
        const pubs = await getAllPublishers();
        setPublishers(pubs);
    }, []);

    useEffect(() => {
        getAllPublishers().then((pubs) => {
            setPublishers(pubs);
            setLoading(false);
        });
    }, []);

    // Silent 60s auto-refresh polling
    useEffect(() => {
        const interval = setInterval(silentFetchPublishers, POLLING_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [silentFetchPublishers]);

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
                <Text fontSize="xl" fontWeight="black" color="content.primary">
                    Publishers
                </Text>
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
            ) : publishers.length > 0 ? (
                <>
                    {publishers.map((pub, i) => (
                        <Box key={pub.address}>
                            <PublisherCard publisher={pub} index={i}/>
                            {i < publishers.length - 1 && <Separator borderColor="surface.border"/>}
                        </Box>
                    ))}
                </>
            ) : (
                <Box textAlign="center" py="16">
                    <Text fontSize="4xl" mb="2">👥</Text>
                    <Text fontSize="lg" fontWeight="bold" color="content.primary" mb="1">
                        No Publishers
                    </Text>
                    <Text fontSize="sm" color="content.muted">
                        No publishers registered yet.
                    </Text>
                </Box>
            )}
        </Box>
    );
}
