'use client';

import {
    Box,
    Button,
    HStack,
    VStack,
    Text,
    Portal,
    Dialog,
    Image,
} from '@chakra-ui/react';
import {useState, useEffect, useCallback} from 'react';
import {ShieldCheck, AlertTriangle, Globe, Heart, Link as LinkIcon} from 'lucide-react';

const DISMISS_KEY = 'cointrunk:about-dismissed';

function isDismissed(): boolean {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(DISMISS_KEY) === '1';
}

export function useAboutModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!isDismissed()) {
            setOpen(true);
        }
    }, []);

    const dismiss = useCallback(() => {
        setOpen(false);
        localStorage.setItem(DISMISS_KEY, '1');
    }, []);

    const show = useCallback(() => setOpen(true), []);

    return {open, dismiss, show};
}

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function InfoItem({icon, title, children}: {icon: React.ReactNode; title: string; children: React.ReactNode}) {
    return (
        <HStack
            gap="3"
            align="start"
            p="3"
            borderRadius="xl"
            bg="surface.primary/50"
            borderWidth="1px"
            borderColor="surface.border/40"
        >
            {icon}
            <Box>
                <Text fontSize="sm" fontWeight="medium" color="content.primary" mb="0.5">
                    {title}
                </Text>
                <Text fontSize="xs" color="content.secondary" lineHeight="relaxed">
                    {children}
                </Text>
            </Box>
        </HStack>
    );
}

export function AboutModal({isOpen, onClose}: AboutModalProps) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
            <Portal>
                <Dialog.Backdrop/>
                <Dialog.Positioner>
                    <Dialog.Content maxW={{base: '90vw', md: '500px'}} borderRadius="2xl">
                        <Dialog.Header>
                            <HStack gap="2.5">
                                <Image src="/cointrunk.svg" alt="CoinTrunk" w="6" h="6"/>
                                <Dialog.Title fontSize="lg" fontWeight="semibold">
                                    Welcome to CoinTrunk
                                </Dialog.Title>
                            </HStack>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack gap="4" align="stretch">
                                <Text fontSize="sm" color="content.secondary" lineHeight="relaxed">
                                    Decentralized news curated on the BeeZee blockchain. All content is
                                    published on-chain, making it transparent and censorship-resistant.
                                    CoinTrunk empowers communities to share and verify information without
                                    relying on centralized gatekeepers.
                                </Text>

                                <VStack gap="3" align="stretch">
                                    <InfoItem
                                        icon={<Box flexShrink={0} mt="0.5"><ShieldCheck size={16} color="var(--chakra-colors-green-400)"/></Box>}
                                        title="Publisher articles"
                                    >
                                        Published by trusted, community-approved publishers verified through
                                        on-chain governance proposals. These articles come from recognized
                                        sources that the BeeZee community has voted to trust.
                                    </InfoItem>

                                    <InfoItem
                                        icon={<Box flexShrink={0} mt="0.5"><AlertTriangle size={16} color="var(--chakra-colors-yellow-400)"/></Box>}
                                        title="Paid articles"
                                    >
                                        Submitted anonymously by anyone willing to pay a fee in BZE.
                                        They are <Text as="span" color="yellow.400">not verified by a trusted publisher</Text> &mdash; always
                                        review the source before trusting the content. There is a monthly
                                        limit on the number of paid articles allowed.
                                    </InfoItem>

                                    <InfoItem
                                        icon={<Box flexShrink={0} mt="0.5"><Globe size={16} color="var(--chakra-colors-blue-400)"/></Box>}
                                        title="Accepted domains"
                                    >
                                        Articles can only link to governance-approved domains, ensuring source
                                        quality is community-controlled. New domains can be added through
                                        on-chain governance proposals voted on by BZE stakers.
                                    </InfoItem>

                                    <InfoItem
                                        icon={<Box flexShrink={0} mt="0.5"><Heart size={16} color="var(--chakra-colors-pink-400)"/></Box>}
                                        title="Respect"
                                    >
                                        Support publishers by sending BZE tokens &mdash; 1 BZE equals 1 Respect
                                        point. The entire amount increases the publisher&apos;s respect score. A portion
                                        of the BZE goes directly to the publisher, while a community tax goes back
                                        to the BeeZee ecosystem&apos;s community pool.
                                    </InfoItem>

                                    <InfoItem
                                        icon={<Box flexShrink={0} mt="0.5"><LinkIcon size={16} color="var(--chakra-colors-purple-400)"/></Box>}
                                        title="On-chain & open"
                                    >
                                        Every article, publisher, and respect payment is a blockchain transaction.
                                        Anyone can verify the data, build alternative frontends, or integrate
                                        CoinTrunk into their own applications. No single entity controls the content.
                                    </InfoItem>
                                </VStack>
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button
                                width="full"
                                bg="brand.primary"
                                color="white"
                                _hover={{bg: 'brand.light'}}
                                onClick={onClose}
                                fontWeight="medium"
                            >
                                Got it
                            </Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger/>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
