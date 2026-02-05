'use client';

import { useState } from 'react';
import { useChain } from '@cosmos-kit/react-lite';
import { getChainName } from '@/lib/chain-config';
import { truncateAddress } from '@/lib/utils';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';

export function WalletButton() {
  const chainName = getChainName();
  const { address, status, disconnect, openView } = useChain(chainName);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === 'Connected' && address) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleCopy}
          className="text-xs text-content-secondary hover:text-content-primary transition-colors flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-surface-card-hover"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-400" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          <span className="hidden sm:inline">{truncateAddress(address)}</span>
          <span className="sm:hidden">{truncateAddress(address, 10)}</span>
        </button>
        <button
          onClick={() => disconnect()}
          className="p-1.5 rounded-lg text-content-secondary hover:text-brand-accent hover:bg-surface-card-hover transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={openView}
      disabled={status === 'Connecting'}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-accent to-orange-600 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      <Wallet className="w-4 h-4" />
      <span className="hidden sm:inline">
        {status === 'Connecting' ? 'Connecting...' : 'Connect'}
      </span>
    </button>
  );
}
