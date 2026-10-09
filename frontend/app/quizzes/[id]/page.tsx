import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { QuestionView } from '@/components/question-view';
import { PageHeader } from '@/components/ui/page-header';
import { getQuiz } from '@/services/quiz-api';

export const metadata: Metadata = { title: 'Quiz details' };

export default function QuizDetailsPage({
  params,
}: PageProps<'/quizzes/[id]'>) {
  return (
    <>
      <Link
        href="/quizzes"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All quizzes
      </Link>
      <Suspense fallback={<QuizDetailsSkeleton />}>
        <QuizDetails params={params} />
      </Suspense>
    </>
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

  return (
    <>
      <PageHeader
        title={quiz.title}
        description={`${quiz.questions.length} ${
          quiz.questions.length === 1 ? 'question' : 'questions'
        } · created ${new Date(quiz.createdAt).toLocaleDateString('en-US', {
          dateStyle: 'medium',
        })}`}
      />
      <ol className="space-y-4">
        {quiz.questions.map((question, index) => (
          <li key={question.id}>
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
      <div className="mb-2 h-8 w-2/3 rounded bg-slate-200" />
      <div className="mb-8 h-4 w-40 rounded bg-slate-100" />
      {[0, 1].map((item) => (
        <div
          key={item}
          className="mb-4 h-36 rounded-xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}
