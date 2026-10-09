import type { Metadata } from 'next';
import { Suspense } from 'react';
import { QuizList } from '@/components/quiz-list';
import { PageHeader } from '@/components/ui/page-header';
import { getQuizzes } from '@/services/quiz-api';

export const metadata: Metadata = { title: 'Quizzes' };

export default function QuizzesPage() {
  return (
    <>
      <PageHeader title="Quizzes" description="All quizzes you have created" />
      <Suspense fallback={<QuizListSkeleton />}>
        <Quizzes />
      </Suspense>
    </>
  );
}

async function Quizzes() {
  const quizzes = await getQuizzes();
  return <QuizList quizzes={quizzes} />;
}

function QuizListSkeleton() {
  return (
    <ul
      aria-busy
      aria-label="Loading quizzes"
      className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white"
    >
      {[0, 1, 2].map((item) => (
        <li key={item} className="animate-pulse space-y-2 px-5 py-4">
          <div className="h-4 w-1/2 rounded bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </li>
      ))}
    </ul>
  );
}
