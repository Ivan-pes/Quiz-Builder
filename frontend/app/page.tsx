import Link from 'next/link';
import { Suspense } from 'react';
import { LargestQuizzes } from '@/components/home/largest-quizzes';
import { QuickActions } from '@/components/home/quick-actions';
import { RecentQuizzes } from '@/components/home/recent-quizzes';
import { TypeCircles } from '@/components/type-circles';
import { ArrowCircle } from '@/components/ui/arrow-circle';
import { SectionTitle } from '@/components/ui/page-header';
import { getQuizzes } from '@/services/quiz-api';

export default function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <h1 className="animate-rise text-4xl font-semibold tracking-tight sm:text-5xl">
        Hi there <span aria-hidden>👋</span>
      </h1>

      <Link
        href="/create"
        className="card group animate-rise block p-6 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-neutral-950 sm:p-8"
      >
        <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Build a quiz in minutes
        </p>
        <p className="mt-2 max-w-xl text-neutral-600 sm:text-lg">
          Mix true/false, short answer and multiple-choice questions in a single
          quiz.
        </p>
        <div className="mt-6 flex items-center justify-between">
          <TypeCircles />
          <ArrowCircle />
        </div>
      </Link>

      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </div>
  );
}

async function HomeContent() {
  const quizzes = await getQuizzes();
  const largest = [...quizzes]
    .sort((a, b) => b.questionCount - a.questionCount)
    .slice(0, 3);

  return (
    <>
      <QuickActions latestQuizId={quizzes[0]?.id ?? null} />

      <section>
        <SectionTitle>Recent quizzes</SectionTitle>
        <RecentQuizzes quizzes={quizzes.slice(0, 3)} />
      </section>

      {largest.length > 0 && (
        <section>
          <SectionTitle>Largest quizzes</SectionTitle>
          <LargestQuizzes quizzes={largest} />
        </section>
      )}
    </>
  );
}

function HomeSkeleton() {
  return (
    <>
      <QuickActions latestQuizId={null} />
      <div aria-busy aria-label="Loading quizzes" className="animate-pulse">
        <div className="mb-4 h-7 w-48 rounded-full bg-white/60" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-56 rounded-3xl bg-white/60" />
          <div className="hidden h-56 rounded-3xl bg-white/60 sm:block" />
          <div className="hidden h-56 rounded-3xl bg-white/60 sm:block" />
        </div>
      </div>
    </>
  );
}
