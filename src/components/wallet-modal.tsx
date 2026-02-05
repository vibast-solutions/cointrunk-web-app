'use client';

import { ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  walletRepo?: any;
}

export function WalletModal({
  isOpen,
  setOpen,
  walletRepo,
}: WalletModalProps): ReactElement {
  if (!isOpen) return <></>;

  const wallets = walletRepo?.wallets || [];

  const handleConnect = async (wallet: any) => {
    try {
      await wallet.connect();
      setOpen(false);
    } catch (e) {
      console.error('Failed to connect:', e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-sm bg-surface-card border border-surface-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
              <h2 className="text-base font-semibold text-content-primary">
                Connect Wallet
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-card-hover transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet list */}
            <div className="p-3 space-y-1">
              {wallets.length === 0 ? (
                <p className="px-3 py-6 text-sm text-content-muted text-center">
                  No wallets available
                </p>
              ) : (
                wallets.map((wallet: any) => {
                  const name = wallet.walletInfo?.prettyName || wallet.walletName;
                  const logo =
                    typeof wallet.walletInfo?.logo === 'string'
                      ? wallet.walletInfo.logo
                      : wallet.walletInfo?.logo?.major ||
                        wallet.walletInfo?.logo?.minor;

                  return (
                    <button
                      key={wallet.walletName}
                      onClick={() => handleConnect(wallet)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left hover:bg-surface-card-hover transition-colors group"
                    >
                      {logo ? (
                        <img
                          src={logo}
                          alt={name}
                          className="w-8 h-8 rounded-lg"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-content-muted" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-content-primary group-hover:text-white transition-colors">
                          {name}
                        </p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-surface-border group-hover:bg-brand-accent transition-colors" />
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
