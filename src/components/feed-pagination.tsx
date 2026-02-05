'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

export function FeedPagination({ currentPage, hasNext, onPageChange }: Props) {
  if (currentPage === 1 && !hasNext) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-6 border-t border-surface-border">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-content-secondary hover:text-content-primary hover:bg-surface-card-hover transition-all disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <span className="px-3 py-1.5 rounded-full bg-surface-elevated text-sm text-content-secondary font-medium tabular-nums">
        {currentPage}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-content-secondary hover:text-content-primary hover:bg-surface-card-hover transition-all disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
