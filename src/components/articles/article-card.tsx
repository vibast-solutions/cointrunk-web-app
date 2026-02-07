'use client';

import {Box, HStack, Text, Link} from '@chakra-ui/react';
import {motion} from 'framer-motion';
import {Hash, ExternalLink} from 'lucide-react';
import NextLink from 'next/link';
import {useState, useEffect} from 'react';
import type {ArticleProps} from '@/types/article';
import {getPublisherData} from '@/query/cointrunk_publishers';
import {truncateAddress, formatRelativeTime, generateAvatarGradient} from '@/utils/articles';
import {PublishedTodayBadge, PaidBadge, DomainBadge} from './badges';

interface ArticleCardProps {
    article: ArticleProps;
    index: number;
}

function isToday(unixSeconds: string): boolean {
    const date = new Date(Number(unixSeconds) * 1000);
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function getDomain(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        return '';
    }
}

export function ArticleCard({article, index}: ArticleCardProps) {
    const [publisherName, setPublisherName] = useState<string>('');

    useEffect(() => {
        let cancelled = false;
        getPublisherData(article.publisher).then((pub) => {
            if (!cancelled && pub?.name) {
                setPublisherName(pub.name);
            }
        });
        return () => { cancelled = true; };
    }, [article.publisher]);

    const gradient = generateAvatarGradient(article.publisher);
    const domain = getDomain(article.url);
    const today = isToday(article.created_at);

    return (
        <motion.article
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, delay: index * 0.04}}
        >
            <Box
                position="relative"
                px="4"
                py="3"
                transition="background 0.15s"
                _hover={{bg: 'surface.cardHover'}}
            >
                {/* Paid ribbon */}
                {article.paid && (
                    <Box
                        position="absolute"
                        top="0"
                        right="0"
                        overflow="hidden"
                        w="20"
                        h="20"
                        pointerEvents="none"
                    >
                        <Box
                            position="absolute"
                            top="6px"
                            right="-20px"
                            transform="rotate(45deg)"
                            bg="yellow.500"
                            color="black"
                            fontSize="9px"
                            fontWeight="bold"
                            px="6"
                            py="0.5"
                            textAlign="center"
                        >
                            PAID
                        </Box>
                    </Box>
                )}

                <HStack gap="3" align="start">
                    {/* Avatar */}
                    <Link as={NextLink} href={`/publisher/${article.publisher}`} flexShrink={0}>
                        <Box
                            w="10"
                            h="10"
                            borderRadius="full"
                            background={gradient}
                        />
                    </Link>

                    {/* Content */}
                    <Box flex="1" minW="0">
                        {/* Header */}
                        <HStack gap="1" flexWrap="wrap" mb="1">
                            <Link
                                as={NextLink}
                                href={`/publisher/${article.publisher}`}
                                fontWeight="bold"
                                fontSize="sm"
                                color="content.primary"
                                _hover={{textDecoration: 'underline'}}
                            >
                                {publisherName || truncateAddress(article.publisher, 20)}
                            </Link>
                            {publisherName && (
                                <Text fontSize="xs" color="content.muted">
                                    {truncateAddress(article.publisher, 12)}
                                </Text>
                            )}
                            <Text fontSize="xs" color="content.muted">·</Text>
                            <Text fontSize="xs" color="content.muted">
                                {formatRelativeTime(article.created_at)}
                            </Text>
                        </HStack>

                        {/* Title as link */}
                        <Link
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            _hover={{textDecoration: 'none'}}
                        >
                            <Text
                                fontSize="15px"
                                lineHeight="relaxed"
                                color="content.primary"
                                _hover={{color: 'brand.accent'}}
                                mb="2"
                            >
                                {article.title}
                            </Text>
                        </Link>

                        {/* Image */}
                        {article.picture && (
                            <Link
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                display="block"
                                mb="2"
                            >
                                <Box
                                    borderRadius="2xl"
                                    overflow="hidden"
                                    borderWidth="1px"
                                    borderColor="surface.border"
                                    maxH="72"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={article.picture}
                                        alt=""
                                        loading="lazy"
                                        style={{
                                            width: '100%',
                                            maxHeight: '288px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            </Link>
                        )}

                        {/* Footer */}
                        <HStack gap="2" flexWrap="wrap">
                            {today && <PublishedTodayBadge/>}
                            {article.paid && <PaidBadge/>}
                            {domain && <DomainBadge domain={domain}/>}

                            <HStack gap="1" ml="auto" color="content.muted" fontSize="xs">
                                <Hash size={10}/>
                                <Text fontSize="xs">{article.id}</Text>
                            </HStack>

                            <Link
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="content.muted"
                                _hover={{color: 'brand.accent'}}
                            >
                                <ExternalLink size={14}/>
                            </Link>
                        </HStack>
                    </Box>
                </HStack>
            </Box>
        </motion.article>
    );
}
