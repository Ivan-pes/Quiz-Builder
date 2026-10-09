'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { House, Layers, Plus, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: House },
  { href: '/quizzes', label: 'Quizzes', icon: Layers },
  { href: '/create', label: 'Create', icon: Plus },
] as const;

/**
 * Sticky top bar on every screen size. It stays at the top on phones too,
 * so it never competes with the mobile browser's bottom address bar.
 */
export function SiteNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/50 bg-white/40 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6"
      >
        <Link
          href="/"
          aria-label="Quiz Builder home"
          className="flex shrink-0 items-center gap-2.5 text-lg font-semibold tracking-tight"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-neutral-950 text-white">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">Quiz Builder</span>
        </Link>
        <NavLinks />
      </nav>
    </header>
  );
}

/**
 * The current path is request data, so the active state streams in while the
 * links themselves are part of the static shell.
 */
function NavLinks() {
  return (
    <Suspense fallback={<NavList pathname={null} />}>
      <ActiveNavList />
    </Suspense>
  );
}

function ActiveNavList() {
  return <NavList pathname={usePathname()} />;
}

function NavList({ pathname }: { pathname: string | null }) {
  const isActive = (href: string) =>
    pathname !== null &&
    (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <ul className="flex items-center gap-1 rounded-full bg-white/60 p-1 shadow-sm">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <Link
            href={href}
            aria-current={isActive(href) ? 'page' : undefined}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 aria-[current=page]:bg-neutral-950 aria-[current=page]:text-white sm:px-4"
          >
            <Icon className="size-4 sm:hidden" aria-hidden />
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
