'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useChain } from '@cosmos-kit/react-lite';
import { ArticleCard } from '@/components/article-card';
import { ArticleSkeleton } from '@/components/article-skeleton';
import { FeedPagination } from '@/components/feed-pagination';
import { AddArticleModal } from '@/components/add-article-modal';
import { AboutBanner } from '@/components/about-banner';
import { getAllArticles } from '@/lib/services/articles';
import { isPublisher } from '@/lib/services/publishers';
import { getChainName } from '@/lib/chain-config';
import type { ArticleProps } from '@/lib/types';

const ARTICLES_PER_PAGE = 10;

function ArticlesFeed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chainName = getChainName();
  const { address, status } = useChain(chainName);

  const currentPage = Number(searchParams.get('page') || '1');
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userIsPublisher, setUserIsPublisher] = useState(false);

  useEffect(() => {
    setLoading(true);
    const offset = (currentPage - 1) * ARTICLES_PER_PAGE;
    getAllArticles(ARTICLES_PER_PAGE, offset)
      .then(({ articles: arts }) => {
        setArticles(arts);
        setHasNext(arts.length === ARTICLES_PER_PAGE);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    if (address && status === 'Connected') {
      isPublisher(address).then(setUserIsPublisher).catch(console.error);
    } else {
      setUserIsPublisher(false);
    }
  }, [address, status]);

  const goToPage = (page: number) => {
    router.push(`/?page=${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-2xl mx-auto feed-border min-h-screen">
      {/* Feed header */}
      <div className="sticky top-14 z-40 glass border-b border-surface-border/60 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Articles</h1>
          <p className="text-xs text-content-muted mt-0.5">
            Latest from CoinTrunk publishers
          </p>
        </div>
        {status === 'Connected' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-accent to-orange-600 text-white text-sm font-medium hover:opacity-90 transition-opacity active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Publish
          </button>
        )}
      </div>

      {/* About banner */}
      <AboutBanner />

      {/* Feed content */}
      <div className="divide-y divide-surface-border/60">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ArticleSkeleton key={i} />
          ))
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))
        ) : (
          <div className="px-4 py-16 text-center">
            <p className="text-content-secondary text-lg">No articles yet</p>
            <p className="text-content-muted text-sm mt-1">
              Be the first to publish on CoinTrunk
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && (
        <FeedPagination
          currentPage={currentPage}
          hasNext={hasNext}
          onPageChange={goToPage}
        />
      )}

      {/* Add Article Modal */}
      {showAddModal && (
        <AddArticleModal
          isPublisher={userIsPublisher}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            goToPage(1);
          }}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto feed-border min-h-screen">
          <div className="px-4 py-3 border-b border-surface-border/60">
            <div className="h-6 w-20 bg-surface-elevated rounded-md animate-pulse" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleSkeleton key={i} />
          ))}
        </div>
      }
    >
      <ArticlesFeed />
    </Suspense>
  );
}
