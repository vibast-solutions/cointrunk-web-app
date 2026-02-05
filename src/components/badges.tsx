import { ExternalLink, Sparkles, Clock, CreditCard } from 'lucide-react';

const badgeBase =
  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap';

export function RespectBadge({ respect }: { respect: string }) {
  const respectNum = Number(respect);
  if (respectNum >= 1_000_000_000_000) {
    return (
      <span className={`${badgeBase} bg-teal-500/15 text-teal-400 border border-teal-500/20`}>
        <Sparkles className="w-3 h-3" />
        Highly Respected
      </span>
    );
  }
  if (respectNum >= 50_000_000_000) {
    return (
      <span className={`${badgeBase} bg-yellow-500/15 text-yellow-400 border border-yellow-500/20`}>
        <Sparkles className="w-3 h-3" />
        Respected
      </span>
    );
  }
  return null;
}

export function PublishedTodayBadge() {
  return (
    <span className={`${badgeBase} bg-green-500/15 text-green-400 border border-green-500/20`}>
      <Clock className="w-3 h-3" />
      Today
    </span>
  );
}

export function PaidBadge() {
  return (
    <span className={`${badgeBase} bg-amber-500/15 text-amber-400 border border-amber-500/20`}>
      <CreditCard className="w-3 h-3" />
      Paid Article
    </span>
  );
}

export function DomainBadge({ domain }: { domain: string }) {
  return (
    <span
      className={`${badgeBase} bg-surface-card text-content-secondary border border-surface-border`}
    >
      <ExternalLink className="w-3 h-3" />
      {domain}
    </span>
  );
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`${badgeBase} ${
        active
          ? 'bg-green-500/15 text-green-400 border border-green-500/20'
          : 'bg-red-500/15 text-red-400 border border-red-500/20'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? 'bg-green-400' : 'bg-red-400'
        }`}
      />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

export function ArticleCountBadge({ count }: { count: number }) {
  if (count < 10) {
    return (
      <span className={`${badgeBase} bg-slate-500/15 text-slate-400 border border-slate-500/20`}>
        Beginner
      </span>
    );
  }
  if (count < 50) {
    return (
      <span className={`${badgeBase} bg-yellow-500/15 text-yellow-400 border border-yellow-500/20`}>
        {count} articles
      </span>
    );
  }
  if (count < 100) {
    return (
      <span className={`${badgeBase} bg-orange-500/15 text-orange-400 border border-orange-500/20`}>
        {count} articles
      </span>
    );
  }
  return (
    <span className={`${badgeBase} bg-emerald-500/15 text-emerald-400 border border-emerald-500/20`}>
      {count} articles
    </span>
  );
}
