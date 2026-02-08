'use client'
import "@interchain-kit/react/styles.css"; // Import styles for the wallet modal
import {InterchainWalletModal, useChain} from "@interchain-kit/react";
import {
    Box,
    Button,
    HStack,
    Text,
    VStack,
} from '@chakra-ui/react'
import {LuCopy} from 'react-icons/lu'
import {useCallback, useMemo, useRef, useState} from 'react'
import {getChainName} from "@/constants/chain";
import {WalletState} from "@interchain-kit/core";
import {stringTruncateFromCenter} from "@/utils/strings";

export const WalletSidebarContent = () => {
    const [isDisconnecting, setIsDisconnecting] = useState(false)
    const [showCopiedTooltip, setShowCopiedTooltip] = useState(false)
    const copyButtonRef = useRef<HTMLButtonElement>(null)

    const {
        status,
        username,
        address,
        disconnect,
        connect,
    } = useChain(getChainName());

    const walletAddress = useMemo(() => stringTruncateFromCenter(address ?? "", 16), [address])

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address)
        setShowCopiedTooltip(true)
        setTimeout(() => setShowCopiedTooltip(false), 2000)
    }

    const handleDisconnectAll = useCallback(async () => {
        setIsDisconnecting(true)
        try {
            console.log('Disconnected from all chains')
        } catch (error) {
            console.error('Error disconnecting:', error)
        } finally {
            disconnect()
            setIsDisconnecting(false)
        }
    }, [disconnect])

    return (
        <VStack gap="6" align="stretch">
            <Box>
                <InterchainWalletModal />
                {status === WalletState.Connected &&
                    <VStack gap="4" align="stretch">
                        <Box
                            p="3"
                            bg="bg.panel"
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor="border"
                        >
                            <Text fontSize="xs" color="fg.muted" mb="1">
                                {username ?? "Address"}
                            </Text>
                            <HStack justify="space-between">
                                <Text fontSize="sm" fontFamily="mono">
                                    {walletAddress}
                                </Text>
                                <Box position="relative">
                                    <Button
                                        ref={copyButtonRef}
                                        size="xs"
                                        variant="ghost"
                                        onClick={handleCopyAddress}
                                    >
                                        <LuCopy />
                                    </Button>
                                    {showCopiedTooltip && (
                                        <Box
                                            position="absolute"
                                            top="-35px"
                                            right="0"
                                            bgGradient="to-br"
                                            gradientFrom="orange.500"
                                            gradientTo="orange.600"
                                            color="white"
                                            px="3"
                                            py="1.5"
                                            borderRadius="md"
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            whiteSpace="nowrap"
                                            zIndex="tooltip"
                                            shadow="md"
                                        >
                                            Copied!
                                        </Box>
                                    )}
                                </Box>
                            </HStack>
                        </Box>
                        <Button
                            size="sm"
                            width="full"
                            variant="outline"
                            colorPalette="red"
                            onClick={handleDisconnectAll}
                            loading={isDisconnecting}
                            loadingText={"Disconnecting..."}
                        >
                            Disconnect Wallet
                        </Button>
                    </VStack>
                }
                {status !== WalletState.Connected &&
                    <Button
                        size="sm"
                        variant="solid"
                        w="full"
                        onClick={connect}
                    >
                        Connect Wallet
                    </Button>
                }
            </Box>
        </VStack>
    )
}
