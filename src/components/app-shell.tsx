'use client';

import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { AboutModal, useAboutModal } from './about-modal';

export function AppShell({ children }: { children: ReactNode }) {
  const { open, dismiss, show } = useAboutModal();

  return (
    <>
      <Navbar onInfoClick={show} />
      <main className="pt-14">{children}</main>
      <AboutModal open={open} onClose={dismiss} />
    </>
  );
}
