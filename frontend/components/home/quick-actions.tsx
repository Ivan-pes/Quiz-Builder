import Link from 'next/link';
import { History, Layers, Plus, type LucideIcon } from 'lucide-react';

interface Action {
  label: string;
  icon: LucideIcon;
  href: string | null;
}

const tileClass =
  'grid size-16 place-items-center rounded-[1.4rem] bg-neutral-950 text-white shadow-lg shadow-neutral-950/15 transition group-hover:-translate-y-0.5 group-hover:shadow-xl sm:size-20 sm:rounded-3xl';

export function QuickActions({
  latestQuizId,
}: {
  latestQuizId: number | null;
}) {
  const actions: Action[] = [
    { label: 'Create quiz', icon: Plus, href: '/create' },
    { label: 'My quizzes', icon: Layers, href: '/quizzes' },
    {
      label: 'Latest quiz',
      icon: History,
      href: latestQuizId ? `/quizzes/${latestQuizId}` : null,
    },
  ];

  return (
    <ul className="grid grid-cols-3 gap-2 sm:flex sm:gap-10">
      {actions.map(({ label, icon: Icon, href }) => (
        <li key={label}>
          {href ? (
            <Link
              href={href}
              className="group flex flex-col items-center gap-2 rounded-3xl text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950"
            >
              <span className={tileClass}>
                <Icon className="size-7 sm:size-8" aria-hidden />
              </span>
              <span className="text-sm font-medium sm:text-base">{label}</span>
            </Link>
          ) : (
            <div
              aria-disabled
              title="No quizzes yet"
              className="flex flex-col items-center gap-2 text-center opacity-40"
            >
              <span className={tileClass}>
                <Icon className="size-7 sm:size-8" aria-hidden />
              </span>
              <span className="text-sm font-medium sm:text-base">{label}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
