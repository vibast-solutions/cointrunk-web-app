"use client"

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

import { ChainProvider } from "@interchain-kit/react"
import { keplrWallet } from "@interchain-kit/keplr-extension";
import { leapWallet } from "@interchain-kit/leap-extension";
import { WCWallet } from "@interchain-kit/core";

import {getAssetLists, getWalletChainsNames} from "@/constants/chain";

const walletConnect = new WCWallet(
    undefined,
    {
        projectId: '7e8510ae772ef527bd711c9bc02f0cb7',
        metadata: {
            name: "CoinTrunk",
            description: "Decentralized News on BeeZee",
            url: "https://app.cointrunk.io",
            icons: [
                "https://app.cointrunk.io/cointrunk.svg",
            ],
        },
    }
);

const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      bg: 'surface.primary',
      color: 'content.primary',
    },
  },
  theme: {
    tokens: {
      fonts: {
        body: { value: 'Poppins, system-ui, sans-serif' },
        heading: { value: 'Poppins, system-ui, sans-serif' },
      },
    },
    semanticTokens: {
      radii: {
        l1: { value: '0.375rem' },
        l2: { value: '0.5rem' },
        l3: { value: '0.75rem' },
      },
      colors: {
        'surface.primary': { value: '#0a0912' },
        'surface.card': { value: '#110f1d' },
        'surface.cardHover': { value: '#16132a' },
        'surface.elevated': { value: '#1c1833' },
        'surface.border': { value: '#231f3a' },
        'content.primary': { value: '#f0eef6' },
        'content.secondary': { value: '#8b84a8' },
        'content.muted': { value: '#5a5478' },
        'brand.primary': { value: '#231c6f' },
        'brand.light': { value: '#29217e' },
        'brand.accent': { value: '#d94934' },
      },
    },
  },
})

export function Provider({ children, ...props }: ColorModeProviderProps & { children: React.ReactNode }) {
    return (
        <ChainProvider
            //@ts-expect-error wallets
            wallets={[keplrWallet, leapWallet, walletConnect]}
            signerOptions={{
                preferredSignType: () => {
                    return 'amino';
                }
            }}
            chains={getWalletChainsNames()}
            assetLists={getAssetLists()}
        >
            <ChakraProvider value={system}>
                <ColorModeProvider {...props} forcedTheme="dark" >
                    {children}
                </ColorModeProvider>
            </ChakraProvider>
        </ChainProvider>
      )
}
