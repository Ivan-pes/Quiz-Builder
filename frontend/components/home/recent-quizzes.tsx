import Link from 'next/link';
import { formatDate, pluralizeQuestions, quizGradient } from '@/lib/quiz-theme';
import type { QuizSummary } from '@/types/quiz';
import { ButtonLink } from '../ui/button';

/** Swipeable row on phones, grid on larger screens. */
export function RecentQuizzes({ quizzes }: { quizzes: QuizSummary[] }) {
  if (quizzes.length === 0) {
    return (
      <div className="card flex flex-col items-center px-6 py-10 text-center">
        <p className="text-lg font-medium">No quizzes yet</p>
        <p className="mt-1 text-neutral-500">
          Your newest quizzes will show up here.
        </p>
        <ButtonLink href="/create" className="mt-5">
          Create the first one
        </ButtonLink>
      </div>
    );
  }

  return (
    <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
      {quizzes.map((quiz) => (
        <li key={quiz.id} className="w-[82%] shrink-0 snap-start sm:w-auto">
          <Link
            href={`/quizzes/${quiz.id}`}
            className="card group block h-full overflow-hidden transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-neutral-950"
          >
            <div
              aria-hidden
              className={`shimmer grid h-32 place-items-center ${quizGradient(quiz.id)}`}
            >
              <span className="grid size-16 place-items-center rounded-2xl bg-white/60 text-3xl font-semibold uppercase shadow-sm backdrop-blur">
                {quiz.title.trim().charAt(0)}
              </span>
            </div>
            {/* Title comes first in the DOM so it leads the link's name */}
            <div className="flex flex-col-reverse gap-1 p-5">
              <p className="line-clamp-2 text-lg leading-snug font-medium">
                {quiz.title}
              </p>
              <p className="text-sm text-neutral-500">
                {formatDate(quiz.createdAt)} ·{' '}
                {pluralizeQuestions(quiz.questionCount)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
