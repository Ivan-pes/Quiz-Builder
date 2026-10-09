import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { QuestionView } from '@/components/question-view';
import { QUESTION_TYPES } from '@/lib/question-types';
import { formatDate, pluralizeQuestions, quizGradient } from '@/lib/quiz-theme';
import { getQuiz } from '@/services/quiz-api';

export const metadata: Metadata = { title: 'Quiz details' };

export default function QuizDetailsPage({
  params,
}: PageProps<'/quizzes/[id]'>) {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/quizzes"
        className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-sm font-medium text-neutral-700 backdrop-blur transition hover:bg-white hover:text-neutral-950"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All quizzes
      </Link>
      <Suspense fallback={<QuizDetailsSkeleton />}>
        <QuizDetails params={params} />
      </Suspense>
    </div>
  );
}

async function QuizDetails({
  params,
}: Pick<PageProps<'/quizzes/[id]'>, 'params'>) {
  const { id } = await params;
  const quizId = Number(id);

  if (!Number.isInteger(quizId) || quizId <= 0) {
    notFound();
  }

  const quiz = await getQuiz(quizId);

  if (!quiz) {
    notFound();
  }

  const typeCounts = QUESTION_TYPES.map((meta) => ({
    ...meta,
    count: quiz.questions.filter((q) => q.type === meta.value).length,
  })).filter(({ count }) => count > 0);

  return (
    <>
      <header
        className={`shimmer animate-rise mb-8 rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgb(30_60_90/0.35)] sm:p-8 ${quizGradient(quiz.id)}`}
      >
        <p className="text-sm font-medium text-neutral-700">
          {pluralizeQuestions(quiz.questions.length)} · created{' '}
          {formatDate(quiz.createdAt)}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight break-words sm:text-4xl">
          {quiz.title}
        </h1>
        <ul className="mt-6 flex flex-wrap gap-2">
          {typeCounts.map(({ value, label, icon: Icon, count }) => (
            <li
              key={value}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-sm font-medium backdrop-blur"
            >
              <Icon className="size-4" aria-hidden />
              {count} × {label}
            </li>
          ))}
        </ul>
      </header>

      <ol className="space-y-4">
        {quiz.questions.map((question, index) => (
          <li
            key={question.id}
            className="animate-rise"
            style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
          >
            <QuestionView question={question} index={index} />
          </li>
        ))}
      </ol>
    </>
  );
}

function QuizDetailsSkeleton() {
  return (
    <div aria-busy aria-label="Loading quiz" className="animate-pulse">
      <div className="mb-8 h-48 rounded-3xl bg-white/60" />
      {[0, 1].map((item) => (
        <div key={item} className="mb-4 h-40 rounded-3xl bg-white/60" />
      ))}
    </div>
  );
}
