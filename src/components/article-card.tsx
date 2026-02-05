'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Hash } from 'lucide-react';
import type { ArticleProps, PublisherProps } from '@/lib/types';
import { getPublisherData } from '@/lib/services/publishers';
import {
  formatRelativeTime,
  extractUrlHost,
  generateAvatarGradient,
  truncateAddress,
} from '@/lib/utils';
import {
  RespectBadge,
  PublishedTodayBadge,
  PaidBadge,
  DomainBadge,
} from './badges';

interface Props {
  article: ArticleProps;
  index: number;
}

export function ArticleCard({ article, index }: Props) {
  const [publisher, setPublisher] = useState<PublisherProps | null>(null);

  useEffect(() => {
    getPublisherData(article.publisher).then(setPublisher).catch(console.error);
  }, [article.publisher]);

  const publisherName = publisher?.name || 'Anonymous';
  const avatarGradient = generateAvatarGradient(article.publisher);
  const domain = extractUrlHost(article.url);
  const createdAt = new Date(Number(article.created_at) * 1000);
  const relativeTime = formatRelativeTime(createdAt);
  const isToday = Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative hover:bg-surface-card-hover/50 transition-colors overflow-hidden"
    >
      {/* Paid article ribbon */}
      {article.paid && (
        <div className="absolute top-0 right-0 z-20 pointer-events-none" style={{ width: 120, height: 120 }}>
          <div
            className="absolute bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider leading-none flex items-center justify-center shadow-md"
            style={{
              width: 170,
              height: 24,
              top: 26,
              right: -40,
              transform: 'rotate(45deg)',
            }}
          >
            Paid Article
          </div>
        </div>
      )}

      {/* Full-card link overlay */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
        aria-label={article.title}
      />

      <div className="px-4 py-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <Link
            href={`/publisher/${article.publisher}`}
            className="relative z-20 flex-shrink-0"
          >
            <div
              className="w-10 h-10 rounded-full ring-2 ring-surface-border/50 group-hover:ring-brand-primary/30 transition-all"
              style={{ background: avatarGradient }}
            />
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header: publisher + time */}
            <div className="flex items-center gap-1.5 flex-wrap text-sm">
              <Link
                href={`/publisher/${article.publisher}`}
                className="relative z-20 font-semibold text-content-primary hover:underline"
              >
                {publisherName}
              </Link>
              <span className="text-content-muted">
                {truncateAddress(article.publisher, 14)}
              </span>
              <span className="text-content-muted">&middot;</span>
              <span className="text-content-muted">{relativeTime}</span>
            </div>

            {/* Article title */}
            <p className="mt-1.5 text-[15px] leading-relaxed text-content-primary group-hover:text-white transition-colors">
              {article.title}
            </p>

            {/* Article image */}
            {article.picture && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-surface-border/60">
                <img
                  src={article.picture}
                  alt=""
                  className="w-full h-auto max-h-72 object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Footer: badges + meta */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              {domain && <DomainBadge domain={domain} />}
              {publisher && <RespectBadge respect={publisher.respect} />}
              {isToday && <PublishedTodayBadge />}
              {article.paid && <PaidBadge />}

              <div className="flex items-center gap-1 ml-auto text-content-muted">
                <Hash className="w-3 h-3" />
                <span className="text-xs">{article.id}</span>
                <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
