'use client';

import Link from 'next/link';
import { useOptimistic, useState, useTransition } from 'react';
import { ChevronRight, ClipboardList, Trash2 } from 'lucide-react';
import { deleteQuizAction } from '@/services/quiz-actions';
import type { QuizSummary } from '@/types/quiz';
import { ButtonLink } from './ui/button';

export function QuizList({ quizzes }: { quizzes: QuizSummary[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [visibleQuizzes, removeQuiz] = useOptimistic(
    quizzes,
    (current, deletedId: number) =>
      current.filter((quiz) => quiz.id !== deletedId),
  );

  function handleDelete(quiz: QuizSummary) {
    if (!window.confirm(`Delete "${quiz.title}"? This cannot be undone.`)) {
      return;
    }

    setError(null);
    startTransition(async () => {
      removeQuiz(quiz.id);
      const result = await deleteQuizAction(quiz.id);
      if (!result.ok) {
        setError(`Failed to delete "${quiz.title}": ${result.errors[0]}`);
      }
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {visibleQuizzes.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {visibleQuizzes.map((quiz) => (
            <li key={quiz.id} className="flex items-center">
              <Link
                href={`/quizzes/${quiz.id}`}
                className="group flex min-w-0 flex-1 items-center gap-3 px-4 py-4 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900 group-hover:text-indigo-600">
                    {quiz.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    {quiz.questionCount}{' '}
                    {quiz.questionCount === 1 ? 'question' : 'questions'}
                  </p>
                </div>
                <ChevronRight
                  className="size-5 shrink-0 text-slate-400"
                  aria-hidden
                />
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(quiz)}
                disabled={isPending}
                aria-label={`Delete quiz "${quiz.title}"`}
                title="Delete quiz"
                className="mr-2 rounded-lg p-2.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-600 disabled:opacity-50 sm:mr-3"
              >
                <Trash2 className="size-5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <ClipboardList className="size-10 text-slate-400" aria-hidden />
      <h2 className="mt-3 font-semibold">No quizzes yet</h2>
      <p className="mt-1 text-sm text-slate-500">
        Create your first quiz to see it here.
      </p>
      <ButtonLink href="/create" className="mt-5">
        Create quiz
      </ButtonLink>
    </div>
  );
}
