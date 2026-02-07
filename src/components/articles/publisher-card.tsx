'use client';

import {Box, HStack, Text, Button} from '@chakra-ui/react';
import {motion} from 'framer-motion';
import {Calendar, FileText, Sparkles, Copy, Check} from 'lucide-react';
import {useState} from 'react';
import {useChain} from '@interchain-kit/react';
import {getChainName} from '@/constants/chain';
import type {PublisherProps} from '@/types/article';
import {generateAvatarGradient, formatBzeAmount} from '@/utils/articles';
import {ActiveBadge, RespectBadge, ArticleCountBadge} from './badges';
import {PayRespectModal} from './pay-respect-modal';

interface PublisherCardProps {
    publisher: PublisherProps;
    index: number;
}

export function PublisherCard({publisher, index}: PublisherCardProps) {
    const [copied, setCopied] = useState(false);
    const [showPayRespect, setShowPayRespect] = useState(false);
    const {address, connect} = useChain(getChainName());
    const gradient = generateAvatarGradient(publisher.address);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(publisher.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    const handlePayRespect = () => {
        if (!address) {
            connect();
            return;
        }
        setShowPayRespect(true);
    };

    const joinDate = (() => {
        const ts = Number(publisher.created_at);
        if (!ts || isNaN(ts)) return '';
        const d = new Date(ts * 1000);
        return d.toLocaleDateString('en-US', {month: 'short', year: 'numeric'});
    })();

    return (
        <>
            <motion.div
                initial={{opacity: 0, y: 12}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3, delay: index * 0.06}}
            >
                <Box
                    px="4"
                    py="4"
                    transition="background 0.15s"
                    _hover={{bg: 'surface.cardHover'}}
                >
                    <HStack gap="3" align="start">
                        {/* Avatar */}
                        <Box
                            w="12"
                            h="12"
                            borderRadius="full"
                            background={gradient}
                            flexShrink={0}
                        />

                        <Box flex="1" minW="0">
                            {/* Name + Active badge */}
                            <HStack gap="2" mb="1">
                                <Text fontWeight="bold" fontSize="md" color="content.primary">
                                    {publisher.name || 'Anonymous'}
                                </Text>
                                <ActiveBadge active={publisher.active}/>
                            </HStack>

                            {/* Address with copy */}
                            <HStack gap="1" mb="2">
                                <Text fontSize="xs" color="content.muted" truncate>
                                    {publisher.address}
                                </Text>
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={handleCopy}
                                    p="0"
                                    minW="auto"
                                    h="auto"
                                    color="content.muted"
                                    _hover={{color: 'content.primary'}}
                                >
                                    {copied ? <Check size={12}/> : <Copy size={12}/>}
                                </Button>
                            </HStack>

                            {/* Stats row */}
                            <HStack gap="4" mb="2" flexWrap="wrap">
                                {joinDate && (
                                    <HStack gap="1" color="content.secondary" fontSize="xs">
                                        <Calendar size={12}/>
                                        <Text fontSize="xs">{joinDate}</Text>
                                    </HStack>
                                )}
                                <HStack gap="1" color="content.secondary" fontSize="xs">
                                    <FileText size={12}/>
                                    <Text fontSize="xs">{publisher.articles_count}</Text>
                                </HStack>
                                <HStack gap="1" color="content.secondary" fontSize="xs">
                                    <Sparkles size={12}/>
                                    <Text fontSize="xs">{formatBzeAmount(publisher.respect)}</Text>
                                </HStack>
                            </HStack>

                            {/* Badges + Pay Respect */}
                            <HStack gap="2" flexWrap="wrap">
                                <RespectBadge respect={publisher.respect}/>
                                <ArticleCountBadge count={publisher.articles_count}/>

                                <Button
                                    variant="outline"
                                    size="xs"
                                    ml="auto"
                                    borderColor="brand.accent"
                                    color="brand.accent"
                                    _hover={{bg: 'brand.accent', color: 'white'}}
                                    onClick={handlePayRespect}
                                >
                                    <Sparkles size={12}/>
                                    Pay Respect
                                </Button>
                            </HStack>
                        </Box>
                    </HStack>
                </Box>
            </motion.div>

            <PayRespectModal
                isOpen={showPayRespect}
                onClose={() => setShowPayRespect(false)}
                publisher={publisher}
                onSuccess={() => setShowPayRespect(false)}
            />
        </>
    );
}
