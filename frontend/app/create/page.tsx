import type { Metadata } from 'next';
import { Suspense } from 'react';
import { QuizForm } from '@/components/quiz-form/quiz-form';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'Create quiz' };

export default function CreateQuizPage() {
  return (
    <>
      <PageHeader
        title="Create quiz"
        description="Add a title and as many questions as you need"
      />
      {/* react-hook-form generates field ids with crypto.randomUUID() while
          rendering, so the form is rendered per request instead of prerendered */}
      <Suspense fallback={<QuizFormSkeleton />}>
        <QuizForm />
      </Suspense>
    </>
  );
}

function QuizFormSkeleton() {
  return (
    <div
      aria-busy
      aria-label="Loading form"
      className="animate-pulse space-y-6"
    >
      <div className="h-24 rounded-xl border border-slate-200 bg-white" />
      <div className="h-56 rounded-xl border border-slate-200 bg-white" />
    </div>
  );
}
