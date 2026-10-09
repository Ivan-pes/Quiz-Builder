'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { QUESTION_TYPES } from '@/lib/question-types';
import { FieldError, inputClassName } from '../ui/field';
import { CheckboxOptions } from './checkbox-options';
import type { QuizFormInput } from './schema';

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
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <header className="mb-4 flex items-center justify-between gap-2">
        <h2 id={id('heading')} className="font-semibold">
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
          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <div>
          <label
            htmlFor={id('text')}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Question
          </label>
          <input
            id={id('text')}
            {...register(`questions.${index}.text`)}
            placeholder="e.g. What is the capital of France?"
            aria-invalid={!!questionErrors?.text}
            aria-describedby={
              questionErrors?.text ? id('text-error') : undefined
            }
            className={inputClassName(!!questionErrors?.text)}
          />
          <FieldError
            id={id('text-error')}
            message={questionErrors?.text?.message}
          />
        </div>
        <div>
          <label
            htmlFor={id('type')}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Type
          </label>
          <select
            id={id('type')}
            {...register(`questions.${index}.type`)}
            className={inputClassName()}
          >
            {QUESTION_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        {type === 'BOOLEAN' && (
          <fieldset
            aria-describedby={
              questionErrors?.booleanAnswer ? id('boolean-error') : undefined
            }
          >
            <legend className="mb-2 text-sm font-medium text-slate-700">
              Correct answer
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:max-w-xs">
              {(['true', 'false'] as const).map((value) => (
                <label
                  key={value}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 has-checked:border-indigo-500 has-checked:bg-indigo-50"
                >
                  <input
                    type="radio"
                    value={value}
                    {...register(`questions.${index}.booleanAnswer`)}
                    className="size-4 accent-indigo-600"
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
            <label
              htmlFor={id('input-answer')}
              className="mb-1 block text-sm font-medium text-slate-700"
            >
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
