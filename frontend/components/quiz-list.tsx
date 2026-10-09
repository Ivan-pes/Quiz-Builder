'use client';

import Link from 'next/link';
import { useOptimistic, useState, useTransition } from 'react';
import { Layers, Trash2 } from 'lucide-react';
import { formatDate, pluralizeQuestions, quizGradient } from '@/lib/quiz-theme';
import { deleteQuizAction } from '@/services/quiz-actions';
import type { QuizSummary } from '@/types/quiz';
import { ArrowCircle } from './ui/arrow-circle';
import { ButtonLink } from './ui/button';
import { ConfirmDialog } from './ui/confirm-dialog';

export function QuizList({ quizzes }: { quizzes: QuizSummary[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<QuizSummary | null>(null);
  const [visibleQuizzes, removeQuiz] = useOptimistic(
    quizzes,
    (current, deletedId: number) =>
      current.filter((quiz) => quiz.id !== deletedId),
  );

  function confirmDelete() {
    const quiz = pendingDelete;
    if (!quiz) {
      return;
    }

    setPendingDelete(null);
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
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {visibleQuizzes.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {visibleQuizzes.map((quiz, index) => (
            <li
              key={quiz.id}
              className="animate-rise"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <QuizCard
                quiz={quiz}
                disabled={isPending}
                onDelete={() => setPendingDelete(quiz)}
              />
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete quiz?"
        description={`"${pendingDelete?.title ?? ''}" and all its questions will be removed permanently.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

/** Document-style card with a shimmering gradient. */
function QuizCard({
  quiz,
  disabled,
  onDelete,
}: {
  quiz: QuizSummary;
  disabled: boolean;
  onDelete: () => void;
}) {
  return (
    <article
      className={`shimmer group flex min-h-52 flex-col rounded-3xl p-5 shadow-[0_10px_30px_-12px_rgb(30_60_90/0.35)] transition hover:-translate-y-1 sm:p-6 ${quizGradient(quiz.id)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-medium backdrop-blur">
          {pluralizeQuestions(quiz.questionCount)}
        </span>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          aria-label={`Delete quiz "${quiz.title}"`}
          title="Delete quiz"
          className="relative z-10 grid size-10 place-items-center rounded-full bg-white/70 text-neutral-700 backdrop-blur transition hover:bg-red-600 hover:text-white focus-visible:outline-2 focus-visible:outline-red-600 disabled:opacity-50"
        >
          <Trash2 className="size-5" aria-hidden />
        </button>
      </div>

      <h2 className="mt-auto pt-8 text-2xl leading-tight font-semibold tracking-tight break-words">
        {/* The link covers the whole card; the delete button sits above it */}
        <Link
          href={`/quizzes/${quiz.id}`}
          className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-neutral-950"
        >
          {quiz.title}
        </Link>
      </h2>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-neutral-700">
          Created {formatDate(quiz.createdAt)}
        </span>
        <ArrowCircle />
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-3xl bg-neutral-950 text-white">
        <Layers className="size-8" aria-hidden />
      </span>
      <h2 className="mt-4 text-xl font-semibold">No quizzes yet</h2>
      <p className="mt-1 text-neutral-500">
        Create your first quiz to see it here.
      </p>
      <ButtonLink href="/create" className="mt-6">
        Create quiz
      </ButtonLink>
    </div>
  );
}
