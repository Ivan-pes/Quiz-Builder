import Link from 'next/link';
import { ListChecks, Plus } from 'lucide-react';
import { ButtonLink } from './ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-4">
        <Link
          href="/quizzes"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <ListChecks className="size-6 text-indigo-600" aria-hidden />
          Quiz Builder
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <ButtonLink href="/quizzes" variant="ghost" className="px-3">
            Quizzes
          </ButtonLink>
          <ButtonLink href="/create" className="px-3">
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">Create quiz</span>
            <span className="sm:hidden">New</span>
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
