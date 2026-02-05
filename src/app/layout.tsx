import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'CoinTrunk - Decentralized News on BeeZee',
  description:
    'Browse and publish articles on the BeeZee blockchain. Decentralized, transparent, community-driven news.',
  icons: {
    icon: '/cointrunk.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-primary text-content-primary min-h-screen">
        <Providers>
          <Navbar />
          <main className="pt-14">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
