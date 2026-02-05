'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Check, Heart, Calendar, FileText, Sparkles } from 'lucide-react';
import { useChain } from '@cosmos-kit/react-lite';
import type { PublisherProps } from '@/lib/types';
import { getChainName } from '@/lib/chain-config';
import {
  generateAvatarGradient,
  truncateAddress,
  formatBzeAmount,
} from '@/lib/utils';
import { RespectBadge, ActiveBadge, ArticleCountBadge } from './badges';
import { PayRespectModal } from './pay-respect-modal';

interface Props {
  publisher: PublisherProps;
  index: number;
  showPayRespect?: boolean;
}

export function PublisherCard({
  publisher,
  index,
  showPayRespect = true,
}: Props) {
  const [showPayModal, setShowPayModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { status, openView } = useChain(getChainName());
  const avatarGradient = generateAvatarGradient(publisher.address);
  const joinDate = new Date(Number(publisher.created_at) * 1000);

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(publisher.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayRespect = () => {
    if (status !== 'Connected') {
      openView();
      return;
    }
    setShowPayModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="px-4 py-4 hover:bg-surface-card-hover/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Link href={`/publisher/${publisher.address}`}>
            <div
              className="w-12 h-12 rounded-full flex-shrink-0 ring-2 ring-surface-border/50 hover:ring-brand-primary/40 transition-all"
              style={{ background: avatarGradient }}
            />
          </Link>

          <div className="flex-1 min-w-0">
            {/* Name and status */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/publisher/${publisher.address}`}
                className="font-semibold text-content-primary hover:underline"
              >
                {publisher.name}
              </Link>
              <ActiveBadge active={publisher.active} />
            </div>

            {/* Address */}
            <button
              onClick={handleCopyAddress}
              className="flex items-center gap-1 text-sm text-content-muted hover:text-content-secondary transition-colors mt-0.5"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {truncateAddress(publisher.address, 24)}
            </button>

            {/* Stats row */}
            <div className="mt-3 flex items-center gap-4 text-sm text-content-secondary">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-content-muted" />
                {joinDate.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-content-muted" />
                {publisher.articles_count}
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-content-muted" />
                {formatBzeAmount(publisher.respect)} BZE
              </span>
            </div>

            {/* Badges */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <RespectBadge respect={publisher.respect} />
              <ArticleCountBadge count={publisher.articles_count} />
            </div>

            {/* Pay Respect button */}
            {showPayRespect && (
              <button
                onClick={handlePayRespect}
                className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-brand-accent/40 text-brand-accent text-sm font-medium hover:bg-brand-accent/10 hover:border-brand-accent/60 transition-all active:scale-95"
              >
                <Heart className="w-4 h-4" />
                Pay Respect
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {showPayModal && (
        <PayRespectModal
          publisher={publisher}
          onClose={() => setShowPayModal(false)}
          onSuccess={() => setShowPayModal(false)}
        />
      )}
    </>
  );
}
