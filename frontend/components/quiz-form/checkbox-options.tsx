'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { FieldError, inputClassName } from '../ui/field';
import { MAX_OPTIONS, MIN_OPTIONS, type QuizFormInput } from './schema';

export function CheckboxOptions({ questionIndex }: { questionIndex: number }) {
  'use no memo'; // see quiz-form.tsx

  const {
    control,
    register,
    trigger,
    formState: { errors, isSubmitted },
  } = useFormContext<QuizFormInput>();
  const name = `questions.${questionIndex}.options` as const;
  const { fields, append, remove } = useFieldArray({ control, name });

  // List-level errors ("mark at least one correct") belong to the whole
  // array, so re-check it whenever the list changes after a submit attempt
  const revalidateList = () => {
    if (isSubmitted) {
      void trigger(name);
    }
  };

  const optionErrors = errors.questions?.[questionIndex]?.options;
  const listError = optionErrors?.root?.message ?? optionErrors?.message;
  const listErrorId = `question-${questionIndex}-options-error`;

  return (
    <fieldset aria-describedby={listError ? listErrorId : undefined}>
      <legend className="mb-1.5 text-sm font-medium text-neutral-700">
        Options{' '}
        <span className="font-normal text-neutral-500">
          (check every correct answer)
        </span>
      </legend>

      <ul className="space-y-2">
        {fields.map((field, optionIndex) => {
          const textError = optionErrors?.[optionIndex]?.text?.message;
          const base =
            `questions.${questionIndex}.options.${optionIndex}` as const;

          return (
            <li key={field.id}>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(`${base}.isCorrect`, {
                    onChange: revalidateList,
                  })}
                  aria-label={`Option ${optionIndex + 1} is correct`}
                  className="size-5 shrink-0 accent-emerald-600"
                />
                <input
                  {...register(`${base}.text`)}
                  placeholder={`Option ${optionIndex + 1}`}
                  aria-label={`Option ${optionIndex + 1} text`}
                  aria-invalid={!!textError}
                  className={inputClassName(!!textError)}
                />
                <button
                  type="button"
                  onClick={() => {
                    remove(optionIndex);
                    revalidateList();
                  }}
                  disabled={fields.length <= MIN_OPTIONS}
                  aria-label={`Remove option ${optionIndex + 1}`}
                  title={
                    fields.length <= MIN_OPTIONS
                      ? `At least ${MIN_OPTIONS} options are required`
                      : 'Remove option'
                  }
                  className="grid size-10 shrink-0 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <FieldError message={textError} />
            </li>
          );
        })}
      </ul>

      <FieldError id={listErrorId} message={listError} />

      <Button
        variant="ghost"
        className="mt-2 px-3"
        onClick={() => append({ text: '', isCorrect: false })}
        disabled={fields.length >= MAX_OPTIONS}
      >
        <Plus className="size-4" aria-hidden />
        Add option
      </Button>
    </fieldset>
  );
}
