'use client';

import {
    Box,
    Button,
    HStack,
    VStack,
    Text,
    Textarea,
    Input,
    Portal,
    Dialog,
} from '@chakra-ui/react';
import {useState, useEffect, useMemo, useCallback} from 'react';
import {useChain} from '@interchain-kit/react';
import {getChainName} from '@/constants/chain';
import {bze} from '@bze/bzejs';
import {useBZETx} from '@/hooks/useTx';
import {AlertTriangle, Send, Info} from 'lucide-react';
import {getAcceptedDomains, extractUrlHost, isAcceptedDomain} from '@/query/cointrunk_accepted_domains';
import {getCointrunkParams} from '@/query/cointrunk_params';
import type {AcceptedDomainProps, CointrunkParamsProps} from '@/types/article';
import {formatBzeAmount} from '@/utils/articles';

interface AddArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    isPublisherUser: boolean;
}

const TITLE_MIN = 10;
const TITLE_MAX = 320;

export function AddArticleModal({isOpen, onClose, onSuccess, isPublisherUser}: AddArticleModalProps) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [picture, setPicture] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [domains, setDomains] = useState<AcceptedDomainProps[]>([]);
    const [params, setParams] = useState<CointrunkParamsProps | null>(null);

    const {address} = useChain(getChainName());
    const {tx} = useBZETx();

    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setUrl('');
            setPicture('');
            setError('');
            getAcceptedDomains().then(setDomains);
            getCointrunkParams().then(setParams);
        }
    }, [isOpen]);

    const urlValid = useMemo(() => {
        if (!url) return true; // empty is ok before typing
        const host = extractUrlHost(url);
        if (!host) return false;
        return isAcceptedDomain(host, domains);
    }, [url, domains]);

    const isFormValid = useMemo(() => {
        return (
            address &&
            title.length >= TITLE_MIN &&
            title.length <= TITLE_MAX &&
            url.length > 0 &&
            urlValid
        );
    }, [address, title, url, urlValid]);

    const handleSubmit = useCallback(async () => {
        if (!address || !isFormValid) return;
        setError('');
        setIsSubmitting(true);

        try {
            const {addArticle} = bze.cointrunk.MessageComposer.withTypeUrl;
            const msg = addArticle({
                publisher: address,
                title: title.trim(),
                url: url.trim(),
                picture: picture.trim(),
            });

            await tx([msg], {
                onSuccess: () => {
                    onSuccess();
                    onClose();
                },
                onFailure: (err) => {
                    setError(err);
                },
            });
        } catch (e) {
            setError(String(e));
        } finally {
            setIsSubmitting(false);
        }
    }, [address, isFormValid, title, url, picture, tx, onSuccess, onClose]);

    const handleClose = () => {
        if (!isSubmitting) onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content maxW={{base: '90vw', md: '500px'}} borderRadius="2xl">
                        <Dialog.Header>
                            <Dialog.Title fontSize="xl" fontWeight="black">
                                Publish Article
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack gap="4" align="stretch">
                                {/* Anonymous warning */}
                                {!isPublisherUser && (
                                    <Box
                                        p="3"
                                        bg="yellow.500/10"
                                        borderWidth="1px"
                                        borderColor="yellow.500/20"
                                        borderRadius="lg"
                                    >
                                        <HStack gap="2" align="start">
                                            <AlertTriangle size={16} color="var(--chakra-colors-yellow-400)"/>
                                            <VStack gap="1" align="start">
                                                <Text fontSize="sm" fontWeight="medium" color="yellow.400">
                                                    Anonymous Submission
                                                </Text>
                                                <Text fontSize="xs" color="content.secondary">
                                                    You are not a registered publisher. This will cost{' '}
                                                    {params ? formatBzeAmount(params.anon_article_cost.amount) : '...'} BZE.
                                                    {params ? ` Limit: ${params.anon_article_limit} articles.` : ''}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </Box>
                                )}

                                {/* Title */}
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb="1" color="content.primary">
                                        Title
                                    </Text>
                                    <Textarea
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Article title..."
                                        maxLength={TITLE_MAX}
                                        rows={3}
                                        disabled={isSubmitting}
                                    />
                                    <Text fontSize="xs" color={title.length < TITLE_MIN ? 'red.400' : 'content.muted'} mt="1">
                                        {title.length}/{TITLE_MAX} (min {TITLE_MIN})
                                    </Text>
                                </Box>

                                {/* URL */}
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb="1" color="content.primary">
                                        URL
                                    </Text>
                                    <Input
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://..."
                                        disabled={isSubmitting}
                                    />
                                    {url && !urlValid && (
                                        <Text fontSize="xs" color="red.400" mt="1">
                                            Domain not in accepted list
                                        </Text>
                                    )}
                                    {domains.length > 0 && (
                                        <HStack gap="1" mt="1" flexWrap="wrap">
                                            <Info size={10} color="var(--chakra-colors-gray-500)"/>
                                            <Text fontSize="xs" color="content.muted">
                                                Accepted: {domains.filter(d => d.active).map(d => d.domain).join(', ')}
                                            </Text>
                                        </HStack>
                                    )}
                                </Box>

                                {/* Picture URL */}
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb="1" color="content.primary">
                                        Picture URL (optional)
                                    </Text>
                                    <Input
                                        value={picture}
                                        onChange={(e) => setPicture(e.target.value)}
                                        placeholder="https://...image.jpg"
                                        disabled={isSubmitting}
                                    />
                                </Box>

                                {/* Error */}
                                {error && (
                                    <Box p="3" bg="red.500/10" borderRadius="lg" borderWidth="1px" borderColor="red.500/20">
                                        <Text fontSize="sm" color="red.400">{error}</Text>
                                    </Box>
                                )}
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <HStack gap="3" width="full">
                                <Button flex="1" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button
                                    flex="1"
                                    size="lg"
                                    bg="brand.accent"
                                    color="white"
                                    _hover={{opacity: 0.9}}
                                    onClick={handleSubmit}
                                    disabled={!isFormValid || isSubmitting}
                                    loading={isSubmitting}
                                    loadingText="Publishing..."
                                    fontWeight="bold"
                                >
                                    <Send size={16}/>
                                    Publish
                                </Button>
                            </HStack>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger disabled={isSubmitting}/>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
