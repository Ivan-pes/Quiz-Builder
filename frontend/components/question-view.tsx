import { Check } from 'lucide-react';
import { QUESTION_TYPE_LABELS } from '@/lib/question-types';
import type { Question } from '@/types/quiz';

/** Read-only representation of a question and its correct answer. */
export function QuestionView({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <header className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-500">
          Question {index + 1}
        </span>
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
          {QUESTION_TYPE_LABELS[question.type]}
        </span>
      </header>
      <h2 className="mb-4 font-medium break-words">{question.text}</h2>
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
          <span className="mb-1 block text-sm text-slate-500">
            Correct answer
          </span>
          <input
            readOnly
            value={question.inputAnswer ?? ''}
            className="w-full rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-900"
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
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
        correct
          ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
          : 'border-slate-200 text-slate-600'
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
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
          <Check className="size-3.5" aria-hidden />
          Correct
        </span>
      )}
    </li>
  );
}
