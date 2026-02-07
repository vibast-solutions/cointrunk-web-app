'use client';

import {
    Box,
    Button,
    HStack,
    VStack,
    Text,
    Input,
    Portal,
    Dialog,
} from '@chakra-ui/react';
import {useState, useEffect, useMemo, useCallback} from 'react';
import {useChain} from '@interchain-kit/react';
import {getChainName} from '@/constants/chain';
import {getChainNativeAssetDenom} from '@/constants/assets';
import {bze} from '@bze/bzejs';
import {useBZETx} from '@/hooks/useTx';
import {Sparkles} from 'lucide-react';
import {getAccountBalance} from '@/query/cointrunk_account';
import {getCointrunkParams} from '@/query/cointrunk_params';
import type {PublisherProps, CointrunkParamsProps} from '@/types/article';
import {formatBzeAmount} from '@/utils/articles';
import {sanitizeNumberInput} from '@/utils/number';
import BigNumber from 'bignumber.js';

interface PayRespectModalProps {
    isOpen: boolean;
    onClose: () => void;
    publisher: PublisherProps;
    onSuccess: () => void;
}

export function PayRespectModal({isOpen, onClose, publisher, onSuccess}: PayRespectModalProps) {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [balance, setBalance] = useState('0');
    const [params, setParams] = useState<CointrunkParamsProps | null>(null);

    const {address} = useChain(getChainName());
    const {tx} = useBZETx();

    const denom = useMemo(() => {
        return params?.publisher_respect_params?.denom || getChainNativeAssetDenom();
    }, [params]);

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setError('');
            getCointrunkParams().then(setParams);
            if (address) {
                getAccountBalance(address, getChainNativeAssetDenom()).then(setBalance);
            }
        }
    }, [isOpen, address]);

    const balanceBze = useMemo(() => {
        return new BigNumber(balance).dividedBy(1_000_000);
    }, [balance]);

    const microAmount = useMemo(() => {
        const bze = new BigNumber(amount || 0);
        if (bze.isNaN() || bze.lte(0)) return '';
        return bze.multipliedBy(1_000_000).integerValue(BigNumber.ROUND_FLOOR).toString();
    }, [amount]);

    const taxRate = useMemo(() => {
        if (!params?.publisher_respect_params?.tax) return '0';
        return params.publisher_respect_params.tax;
    }, [params]);

    const isFormValid = useMemo(() => {
        if (!address || !microAmount) return false;
        const micro = new BigNumber(microAmount);
        return micro.gt(0) && micro.lte(balance);
    }, [address, microAmount, balance]);

    const handleSubmit = useCallback(async () => {
        if (!address || !isFormValid || !microAmount) return;
        setError('');
        setIsSubmitting(true);

        try {
            const {payPublisherRespect} = bze.cointrunk.MessageComposer.withTypeUrl;
            const msg = payPublisherRespect({
                creator: address,
                address: publisher.address,
                amount: microAmount + denom,
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
    }, [address, isFormValid, microAmount, denom, publisher.address, tx, onSuccess, onClose]);

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
                                Pay Respect
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack gap="4" align="stretch">
                                {/* Publisher info */}
                                <Box
                                    p="4"
                                    bg="purple.500/10"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="purple.500/20"
                                >
                                    <HStack gap="2">
                                        <Sparkles size={16} color="var(--chakra-colors-purple-400)"/>
                                        <VStack gap="0" align="start">
                                            <Text fontSize="sm" fontWeight="bold" color="purple.400">
                                                {publisher.name || 'Publisher'}
                                            </Text>
                                            <Text fontSize="xs" color="content.muted">
                                                Current respect: {formatBzeAmount(publisher.respect)}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>

                                {/* Tax info */}
                                <Box p="3" bg="gray.500/10" borderRadius="lg">
                                    <Text fontSize="xs" color="content.secondary">
                                        The entire amount increases the publisher&apos;s respect.
                                        {Number(taxRate) > 0 ? ` ${(Number(taxRate) * 100).toFixed(0)}% of the BZE goes to the community pool, ${(100 - Number(taxRate) * 100).toFixed(0)}% to the publisher.` : ''}
                                    </Text>
                                </Box>

                                {/* Balance */}
                                {address && (
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" color="content.secondary">Balance:</Text>
                                        <Text fontSize="sm" fontWeight="bold" color="content.primary">
                                            {balanceBze.toFixed(2)} BZE
                                        </Text>
                                    </HStack>
                                )}

                                {/* Amount input */}
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb="1" color="content.primary">
                                        Amount (BZE)
                                    </Text>
                                    <Input
                                        value={amount}
                                        onChange={(e) => setAmount(sanitizeNumberInput(e.target.value))}
                                        placeholder="0.00"
                                        type="text"
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
                                    colorPalette="purple"
                                    onClick={handleSubmit}
                                    disabled={!isFormValid || isSubmitting}
                                    loading={isSubmitting}
                                    loadingText="Sending..."
                                    fontWeight="bold"
                                >
                                    <Sparkles size={16}/>
                                    Pay Respect
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
