'use client';

import { ReactNode } from 'react';
import { ChainProvider } from '@cosmos-kit/react-lite';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { wallets as cosmostationWallets } from '@cosmos-kit/cosmostation';
import { getChain, getAssets } from '@/lib/chain-config';
import { WalletModal } from './wallet-modal';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChainProvider
      chains={getChain()}
      assetLists={getAssets()}
      wallets={[...keplrWallets, ...leapWallets, ...cosmostationWallets]}
      walletModal={WalletModal}
    >
      {children}
    </ChainProvider>
  );
}
