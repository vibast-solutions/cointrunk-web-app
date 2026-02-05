'use client';

import { useState, useEffect } from 'react';
import { PublisherCard } from '@/components/publisher-card';
import { ArticleSkeleton } from '@/components/article-skeleton';
import { getAllPublishers } from '@/lib/services/publishers';
import type { PublisherProps } from '@/lib/types';

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<PublisherProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPublishers()
      .then(setPublishers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto feed-border min-h-screen">
      {/* Header */}
      <div className="sticky top-14 z-40 glass border-b border-surface-border/60 px-4 py-3">
        <h1 className="text-lg font-semibold">Publishers</h1>
        <p className="text-xs text-content-muted mt-0.5">
          Trusted content publishers on CoinTrunk
        </p>
      </div>

      {/* Publisher list */}
      <div className="divide-y divide-surface-border/60">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <ArticleSkeleton key={i} />
          ))
        ) : publishers.length > 0 ? (
          publishers.map((publisher, index) => (
            <PublisherCard
              key={publisher.address}
              publisher={publisher}
              index={index}
            />
          ))
        ) : (
          <div className="px-4 py-16 text-center">
            <p className="text-content-secondary text-lg">
              No publishers found
            </p>
            <p className="text-content-muted text-sm mt-1">
              Publishers are approved through governance proposals
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
