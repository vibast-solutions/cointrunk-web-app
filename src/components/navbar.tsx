'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Newspaper, Users, Info } from 'lucide-react';
import { WalletButton } from './wallet-button';

interface Props {
  onInfoClick: () => void;
}

export function Navbar({ onInfoClick }: Props) {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-border/60">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/cointrunk.svg"
              alt="CoinTrunk"
              className="h-7 w-7 group-hover:scale-110 transition-transform"
            />
            <span className="font-semibold text-lg text-content-primary hidden sm:block">
              CoinTrunk
            </span>
          </Link>
          <button
            onClick={onInfoClick}
            className="p-1.5 rounded-lg text-content-muted hover:text-indigo-400 hover:bg-surface-card-hover transition-colors"
            title="How it works"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink
            href="/"
            active={pathname === '/'}
            icon={<Newspaper className="w-4 h-4" />}
            label="Articles"
          />
          <NavLink
            href="/publishers"
            active={pathname.startsWith('/publisher')}
            icon={<Users className="w-4 h-4" />}
            label="Publishers"
          />
        </div>

        {/* Wallet */}
        <WalletButton />
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        active
          ? 'bg-brand-primary/25 text-white shadow-sm shadow-brand-primary/20'
          : 'text-content-secondary hover:text-content-primary hover:bg-surface-card-hover'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
