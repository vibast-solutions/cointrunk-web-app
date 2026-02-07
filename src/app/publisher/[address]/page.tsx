'use client';

import {Box, HStack, Text, Link, Separator} from '@chakra-ui/react';
import {useState, useEffect} from 'react';
import {useParams} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import NextLink from 'next/link';
import {getPublisherByAddress} from '@/query/cointrunk_publishers';
import type {PublisherProps} from '@/types/article';
import {PublisherCard} from '@/components/articles/publisher-card';
import {ArticleSkeleton} from '@/components/articles/article-skeleton';

export default function PublisherDetailPage() {
    const params = useParams();
    const address = params.address as string;
    const [publisher, setPublisher] = useState<PublisherProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!address) return;
        getPublisherByAddress(address).then((pub) => {
            if (pub) {
                setPublisher(pub);
            } else {
                setNotFound(true);
            }
            setLoading(false);
        });
    }, [address]);

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
                <HStack gap="3">
                    <Link
                        as={NextLink}
                        href="/publishers"
                        color="content.secondary"
                        _hover={{color: 'content.primary'}}
                        display="flex"
                        alignItems="center"
                    >
                        <ArrowLeft size={20}/>
                    </Link>
                    <Text fontSize="xl" fontWeight="black" color="content.primary">
                        Publisher
                    </Text>
                </HStack>
            </Box>

            {/* Content */}
            {loading ? (
                <ArticleSkeleton/>
            ) : notFound ? (
                <Box textAlign="center" py="16">
                    <Text fontSize="4xl" mb="2">🔍</Text>
                    <Text fontSize="lg" fontWeight="bold" color="content.primary" mb="1">
                        Publisher Not Found
                    </Text>
                    <Text fontSize="sm" color="content.muted">
                        No publisher exists with this address.
                    </Text>
                </Box>
            ) : publisher ? (
                <>
                    <PublisherCard publisher={publisher} index={0}/>
                    <Separator borderColor="surface.border"/>
                </>
            ) : null}
        </Box>
    );
}
