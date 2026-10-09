'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { QUESTION_TYPE_META, QUESTION_TYPES } from '@/lib/question-types';
import { FieldError, inputClassName } from '../ui/field';
import { CheckboxOptions } from './checkbox-options';
import type { QuizFormInput } from './schema';

const labelClass = 'mb-1.5 block text-sm font-medium text-neutral-700';

export function QuestionEditor({
  index,
  onRemove,
  canRemove,
}: {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  'use no memo'; // see quiz-form.tsx

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<QuizFormInput>();
  const type = useWatch({ control, name: `questions.${index}.type` });

  const questionErrors = errors.questions?.[index];
  const id = (field: string) => `question-${index}-${field}`;

  return (
    <section
      aria-labelledby={id('heading')}
      className="card animate-rise p-5 sm:p-6"
    >
      <header className="mb-5 flex items-center justify-between gap-2">
        <h2
          id={id('heading')}
          className="flex items-center gap-3 text-lg font-semibold"
        >
          <span
            aria-hidden
            className={`grid size-8 place-items-center rounded-full text-sm text-white transition-colors ${QUESTION_TYPE_META[type].dot}`}
          >
            {index + 1}
          </span>
          Question {index + 1}
        </h2>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Remove question ${index + 1}`}
          title={
            canRemove ? 'Remove question' : 'A quiz needs at least one question'
          }
          className="grid size-10 place-items-center rounded-full text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
        >
          <Trash2 className="size-5" aria-hidden />
        </button>
      </header>

      <fieldset className="mb-5">
        <legend className={labelClass}>Type</legend>
        <div className="grid grid-cols-3 gap-2">
          {QUESTION_TYPES.map(({ value, label, icon: Icon }) => (
            <label
              key={value}
              className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl bg-neutral-100 px-2 py-3 text-center text-xs font-medium text-neutral-600 transition hover:bg-neutral-200/70 has-checked:bg-neutral-950 has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-neutral-950 sm:flex-row sm:justify-center sm:text-sm"
            >
              <input
                type="radio"
                value={value}
                {...register(`questions.${index}.type`)}
                className="sr-only"
              />
              <Icon className="size-5 shrink-0" aria-hidden />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={id('text')} className={labelClass}>
          Question
        </label>
        <input
          id={id('text')}
          {...register(`questions.${index}.text`)}
          placeholder="e.g. What is the capital of France?"
          aria-invalid={!!questionErrors?.text}
          aria-describedby={questionErrors?.text ? id('text-error') : undefined}
          className={inputClassName(!!questionErrors?.text)}
        />
        <FieldError
          id={id('text-error')}
          message={questionErrors?.text?.message}
        />
      </div>

      <div className="mt-5 border-t border-neutral-200/70 pt-5">
        {type === 'BOOLEAN' && (
          <fieldset
            aria-describedby={
              questionErrors?.booleanAnswer ? id('boolean-error') : undefined
            }
          >
            <legend className={labelClass}>Correct answer</legend>
            <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
              {(['true', 'false'] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2.5 rounded-2xl bg-white px-4 py-2.5 ring-1 ring-neutral-200 transition has-checked:bg-emerald-50 has-checked:font-medium has-checked:text-emerald-900 has-checked:ring-emerald-400"
                >
                  <input
                    type="radio"
                    value={value}
                    {...register(`questions.${index}.booleanAnswer`)}
                    className="size-4 accent-emerald-600"
                  />
                  {value === 'true' ? 'True' : 'False'}
                </label>
              ))}
            </div>
            <FieldError
              id={id('boolean-error')}
              message={questionErrors?.booleanAnswer?.message}
            />
          </fieldset>
        )}

        {type === 'INPUT' && (
          <div>
            <label htmlFor={id('input-answer')} className={labelClass}>
              Correct answer
            </label>
            <input
              id={id('input-answer')}
              {...register(`questions.${index}.inputAnswer`)}
              placeholder="e.g. Paris"
              aria-invalid={!!questionErrors?.inputAnswer}
              aria-describedby={
                questionErrors?.inputAnswer ? id('input-error') : undefined
              }
              className={inputClassName(!!questionErrors?.inputAnswer)}
            />
            <FieldError
              id={id('input-error')}
              message={questionErrors?.inputAnswer?.message}
            />
          </div>
        )}

        {type === 'CHECKBOX' && <CheckboxOptions questionIndex={index} />}
      </div>
    </section>
  );
}
