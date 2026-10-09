import Link from 'next/link';
import { pluralizeQuestions } from '@/lib/quiz-theme';
import type { QuizSummary } from '@/types/quiz';
import { ArrowCircle } from '../ui/arrow-circle';

export function LargestQuizzes({ quizzes }: { quizzes: QuizSummary[] }) {
  return (
    <ul className="card divide-y divide-neutral-200/70 px-5 sm:px-6">
      {quizzes.map((quiz) => (
        <li key={quiz.id}>
          <Link
            href={`/quizzes/${quiz.id}`}
            className="group flex items-center gap-4 py-5 focus-visible:outline-none"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-medium group-hover:underline group-focus-visible:underline">
                {quiz.title}
              </p>
              <p className="text-sm text-neutral-500">
                {pluralizeQuestions(quiz.questionCount)}
              </p>
            </div>
            <ArrowCircle />
          </Link>
        </li>
      ))}
    </ul>
  );
}
