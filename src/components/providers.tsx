'use client';

import { ReactNode } from 'react';
import { ChainProvider } from '@cosmos-kit/react-lite';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { wallets as cosmostationWallets } from '@cosmos-kit/cosmostation';
import { MainWalletBase } from '@cosmos-kit/core';
import { getChain, getAssets } from '@/lib/chain-config';
import { WalletModal } from './wallet-modal';
import { ToastProvider } from './toast';

// Type assertion needed: wallet extensions use an older @cosmjs/proto-signing
// internally with a narrower Algo type than the root version.
const wallets = [
  ...keplrWallets,
  ...leapWallets,
  ...cosmostationWallets,
] as MainWalletBase[];

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChainProvider
      chains={getChain()}
      assetLists={getAssets()}
      wallets={wallets}
      walletModal={WalletModal}
    >
      <ToastProvider>{children}</ToastProvider>
    </ChainProvider>
  );
}
