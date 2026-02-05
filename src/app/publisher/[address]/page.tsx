'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getPublisherByAddress } from '@/lib/services/publishers';
import { PublisherCard } from '@/components/publisher-card';
import { ArticleSkeleton } from '@/components/article-skeleton';
import type { PublisherProps } from '@/lib/types';
import { truncateAddress } from '@/lib/utils';

export default function PublisherPage() {
  const { address } = useParams<{ address: string }>();
  const [publisher, setPublisher] = useState<PublisherProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (address) {
      getPublisherByAddress(address)
        .then((p) => {
          if (p) {
            setPublisher(p);
          } else {
            setNotFound(true);
          }
        })
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
    }
  }, [address]);

  return (
    <div className="max-w-2xl mx-auto feed-border min-h-screen">
      {/* Header */}
      <div className="sticky top-14 z-40 glass border-b border-surface-border/60 px-4 py-3 flex items-center gap-3">
        <Link
          href="/publishers"
          className="p-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-card-hover transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Publisher</h1>
          {publisher && (
            <p className="text-xs text-content-muted">{publisher.name}</p>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <ArticleSkeleton />
      ) : notFound ? (
        <div className="px-4 py-16 text-center">
          <p className="text-content-secondary text-lg">Publisher not found</p>
          <p className="text-sm text-content-muted mt-2">
            {truncateAddress(address || '', 30)}
          </p>
          <Link
            href="/publishers"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full border border-surface-border text-sm text-content-secondary hover:text-content-primary hover:bg-surface-card-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to publishers
          </Link>
        </div>
      ) : publisher ? (
        <PublisherCard publisher={publisher} index={0} />
      ) : null}
    </div>
  );
}
