import { Check } from 'lucide-react';
import { QUESTION_TYPE_META } from '@/lib/question-types';
import type { Question } from '@/types/quiz';

/** Read-only representation of a question and its correct answer. */
export function QuestionView({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const { label, icon: Icon, badge } = QUESTION_TYPE_META[question.type];

  return (
    <article className="card p-5 sm:p-6">
      <header className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-neutral-500">
          Question {index + 1}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}
        >
          <Icon className="size-3.5" aria-hidden />
          {label}
        </span>
      </header>
      <h2 className="mb-4 text-lg font-medium break-words">{question.text}</h2>
      <QuestionAnswer question={question} />
    </article>
  );
}

function QuestionAnswer({ question }: { question: Question }) {
  switch (question.type) {
    case 'BOOLEAN':
      return (
        <ul className="grid gap-2 sm:grid-cols-2">
          {[true, false].map((value) => (
            <AnswerChoice
              key={String(value)}
              kind="radio"
              label={value ? 'True' : 'False'}
              correct={question.booleanAnswer === value}
            />
          ))}
        </ul>
      );
    case 'INPUT':
      return (
        <label className="block">
          <span className="mb-1.5 block text-sm text-neutral-500">
            Correct answer
          </span>
          <input
            readOnly
            value={question.inputAnswer ?? ''}
            className="w-full rounded-2xl bg-emerald-50 px-4 py-2.5 font-medium text-emerald-900 ring-1 ring-emerald-200 outline-none"
          />
        </label>
      );
    case 'CHECKBOX':
      return (
        <ul className="grid gap-2">
          {question.options.map((option) => (
            <AnswerChoice
              key={option.id}
              kind="checkbox"
              label={option.text}
              correct={option.isCorrect}
            />
          ))}
        </ul>
      );
  }
}

function AnswerChoice({
  kind,
  label,
  correct,
}: {
  kind: 'radio' | 'checkbox';
  label: string;
  correct: boolean;
}) {
  return (
    <li
      className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 ring-1 ${
        correct
          ? 'bg-emerald-50 font-medium text-emerald-900 ring-emerald-200'
          : 'bg-neutral-50 text-neutral-600 ring-neutral-200'
      }`}
    >
      <input
        type={kind}
        checked={correct}
        disabled
        readOnly
        aria-label={label}
        className="size-4 accent-emerald-600"
      />
      <span className="min-w-0 flex-1 break-words">{label}</span>
      {correct && (
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <Check className="size-3.5" aria-hidden />
          Correct
        </span>
      )}
    </li>
  );
}
