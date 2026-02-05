'use client';

import { useState } from 'react';
import { X, Newspaper, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DISMISS_KEY = 'cointrunk:about-dismissed';

export function AboutBanner() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(DISMISS_KEY) === '1';
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, '1');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="border-b border-surface-border/60"
      >
        <div className="px-4 py-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-content-primary">
                Welcome to CoinTrunk
              </h3>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-md text-content-muted hover:text-content-primary hover:bg-surface-card-hover transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-content-secondary leading-relaxed mb-3">
            Decentralized news curated on the BeeZee blockchain. All content is
            published on-chain, making it transparent and censorship-resistant.
            Articles can only link to governance-approved domains, ensuring
            source quality is community-controlled.
          </p>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-content-secondary leading-relaxed">
                <span className="text-content-primary font-medium">
                  Publisher articles
                </span>{' '}
                are published by trusted, community-approved publishers
                verified through on-chain governance proposals.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-content-secondary leading-relaxed">
                <span className="text-content-primary font-medium">
                  Paid articles
                </span>{' '}
                are submitted anonymously by anyone willing to pay a fee. They
                are{' '}
                <span className="text-amber-400">
                  not verified by a trusted publisher
                </span>{' '}
                &mdash; always review the source before trusting the content.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Newspaper className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-content-secondary leading-relaxed">
                <span className="text-content-primary font-medium">
                  Respect
                </span>{' '}
                is a way to support publishers. Pay BZE tokens to show
                appreciation for their work &mdash; 1 BZE equals 1 Respect.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
