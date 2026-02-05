'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Heart,
} from 'lucide-react';

const DISMISS_KEY = 'cointrunk:about-dismissed-at';
const DISMISS_DAYS = 60;

function isDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(DISMISS_KEY);
  if (!stored) return false;
  const dismissedAt = Number(stored);
  const elapsed = Date.now() - dismissedAt;
  return elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000;
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
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }, []);

  const show = useCallback(() => setOpen(true), []);

  return { open, dismiss, show };
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AboutModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-surface-card border border-surface-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/cointrunk.svg"
                  alt="CoinTrunk"
                  className="w-6 h-6"
                />
                <h2 className="text-base font-semibold text-content-primary">
                  Welcome to CoinTrunk
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-card-hover transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 pb-5">
              <p className="text-sm text-content-secondary leading-relaxed mb-4">
                Decentralized news curated on the BeeZee blockchain. All content
                is published on-chain, making it transparent and
                censorship-resistant.
              </p>

              <div className="space-y-3">
                <InfoItem
                  icon={
                    <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  }
                  title="Publisher articles"
                  description="Published by trusted, community-approved publishers verified through on-chain governance proposals."
                />

                <InfoItem
                  icon={
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  }
                  title="Paid articles"
                  description={
                    <>
                      Submitted anonymously by anyone willing to pay a fee. They
                      are{' '}
                      <span className="text-amber-400">
                        not verified by a trusted publisher
                      </span>{' '}
                      &mdash; always review the source before trusting the
                      content.
                    </>
                  }
                />

                <InfoItem
                  icon={
                    <Globe className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  }
                  title="Accepted domains"
                  description="Articles can only link to governance-approved domains, ensuring source quality is community-controlled."
                />

                <InfoItem
                  icon={
                    <Heart className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  }
                  title="Respect"
                  description="Support publishers by sending BZE tokens &mdash; 1 BZE equals 1 Respect. A portion goes to the publisher and a community tax goes back to the BeeZee ecosystem."
                />
              </div>

              <button
                onClick={onClose}
                className="mt-5 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-light text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function InfoItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-primary/50 border border-surface-border/40">
      {icon}
      <div>
        <p className="text-sm font-medium text-content-primary mb-0.5">
          {title}
        </p>
        <p className="text-xs text-content-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
