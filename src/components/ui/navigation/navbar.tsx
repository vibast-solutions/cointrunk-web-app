'use client';

import {Box, Button, ClientOnly, HStack, IconButton, Skeleton, Text} from '@chakra-ui/react'
import {NavbarLinks} from './navbar-links'
import {LuWallet, LuSettings} from "react-icons/lu";
import {Sidebar} from "@/components/ui/sidebar/sidebar";
import {WalletSidebarContent} from "@/components/ui/sidebar/wallet-sidebar";
import {SettingsSidebarContent} from "@/components/ui/sidebar/settings-sidebar";
import {MobileNavbarLinks} from "@/components/ui/navigation/mobile-navbar-links";
import {useAssets} from "@/hooks/useAssets";
import {useBalance} from "@/hooks/useBalances";
import {useChain} from "@interchain-kit/react";
import {getChainName} from "@/constants/chain";
import {WalletState} from "@interchain-kit/core";
import {useMemo} from "react";
import {shortNumberFormat} from "@/utils/formatter";
import {uAmountToBigNumberAmount} from "@/utils/amount";
import {getChainNativeAssetDenom} from "@/constants/assets";
import NextLink from 'next/link';

export const TopNavBar = () => {
    const {nativeAsset} = useAssets()
    const {balance} = useBalance(getChainNativeAssetDenom())
    const {status} = useChain(getChainName());

    const walletButtonText = useMemo(() => {
        if (status !== WalletState.Connected || !nativeAsset) {
            return "";
        }

        const humanBalance = uAmountToBigNumberAmount(balance.amount, nativeAsset.decimals)

        return `${shortNumberFormat(humanBalance)} ${nativeAsset.ticker}`
    }, [status, nativeAsset, balance])

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            zIndex="50"
            borderBottomWidth="1px"
            borderColor="surface.border/60"
            bg="surface.primary/82"
            backdropFilter="blur(20px) saturate(180%)"
        >
            <Box maxW="2xl" mx="auto" px="4" h="14" display="flex" alignItems="center" justifyContent="space-between">
                {/* Logo */}
                <HStack gap="2.5" as={NextLink} href="/" flexShrink={0}>
                    <Box
                        as="img"
                        src="/cointrunk.svg"
                        alt="CoinTrunk"
                        h="7"
                        w="7"
                        transition="transform 0.2s"
                        _hover={{transform: 'scale(1.1)'}}
                    />
                    <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        color="content.primary"
                        hideBelow="sm"
                    >
                        CoinTrunk
                    </Text>
                </HStack>

                {/* Nav links (desktop) */}
                <NavbarLinks hideBelow="md" />

                {/* Right side */}
                <HStack gap="1" flexShrink={0}>
                    {/* Wallet */}
                    <ClientOnly fallback={<Skeleton w="10" h="10" rounded="lg" />}>
                        <Sidebar
                            ariaLabel="Wallet"
                            trigger={
                                <Button
                                    size="sm"
                                    bg="surface.elevated"
                                    color="content.primary"
                                    borderWidth="1px"
                                    borderColor="surface.border"
                                    borderRadius="lg"
                                    _hover={{bg: 'surface.card'}}
                                    fontWeight="medium"
                                    fontSize="sm"
                                >
                                    <LuWallet />
                                    <Text hideBelow="sm">{walletButtonText || 'Wallet'}</Text>
                                </Button>
                            }
                        >
                            <WalletSidebarContent />
                        </Sidebar>
                    </ClientOnly>

                    {/* Settings */}
                    <ClientOnly fallback={<Skeleton w="8" h="8" rounded="lg" />}>
                        <Sidebar
                            ariaLabel="Settings"
                            trigger={
                                <IconButton
                                    aria-label="Settings"
                                    size="sm"
                                    variant="ghost"
                                    color="content.secondary"
                                    borderRadius="lg"
                                    _hover={{color: 'content.primary', bg: 'surface.cardHover'}}
                                >
                                    <LuSettings />
                                </IconButton>
                            }
                        >
                            <SettingsSidebarContent />
                        </Sidebar>
                    </ClientOnly>

                    {/* Mobile nav */}
                    <MobileNavbarLinks />
                </HStack>
            </Box>
        </Box>
    )
}
