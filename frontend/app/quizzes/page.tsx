import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import { QuizList } from '@/components/quiz-list';
import { ButtonLink } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { getQuizzes } from '@/services/quiz-api';

export const metadata: Metadata = { title: 'Quizzes' };

export default function QuizzesPage() {
  return (
    <>
      <PageHeader
        title="Quizzes"
        description="All quizzes you have created"
        action={
          <ButtonLink href="/create" className="self-start sm:self-auto">
            <Plus className="size-4" aria-hidden />
            New quiz
          </ButtonLink>
        }
      />
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
      className="grid animate-pulse gap-4 sm:grid-cols-2"
    >
      {[0, 1, 2, 3].map((item) => (
        <li key={item} className="h-52 rounded-3xl bg-white/60" />
      ))}
    </ul>
  );
}
