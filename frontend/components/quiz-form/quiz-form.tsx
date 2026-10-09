'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { LoaderCircle, Plus } from 'lucide-react';
import { createQuizAction } from '@/services/quiz-actions';
import { Button, ButtonLink } from '../ui/button';
import { FieldError, inputClassName } from '../ui/field';
import { QuestionEditor } from './question-editor';
import {
  MAX_QUESTIONS,
  createEmptyQuestion,
  quizFormSchema,
  toCreateQuizPayload,
  type QuizFormInput,
  type QuizFormOutput,
} from './schema';

const defaultValues: QuizFormInput = {
  title: '',
  questions: [createEmptyQuestion()],
};

export function QuizForm() {
  // react-hook-form mutates its `errors` object in place, so React Compiler
  // memoization would keep showing stale errors. Opt the form components out.
  'use no memo';

  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const form = useForm<QuizFormInput, unknown, QuizFormOutput>({
    resolver: zodResolver(quizFormSchema),
    defaultValues,
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerErrors([]);
    const result = await createQuizAction(toCreateQuizPayload(values));

    if (!result.ok) {
      setServerErrors(result.errors);
      return;
    }

    // Next.js keeps visited pages mounted, so clear the draft explicitly
    reset(defaultValues);
    router.push(`/quizzes/${result.data.id}`);
  });

  const questionsError =
    errors.questions?.root?.message ?? errors.questions?.message;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {serverErrors.length > 0 && (
          <div
            role="alert"
            className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
          >
            <p className="font-medium">Could not create the quiz</p>
            <ul className="mt-1 list-inside list-disc">
              {serverErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="shimmer rounded-3xl bg-[linear-gradient(120deg,#b8f0d8,#bfe6f2,#d9d6f5,#b8f0d8)] p-5 shadow-[0_10px_30px_-12px_rgb(30_60_90/0.35)] sm:p-6">
          <label
            htmlFor="quiz-title"
            className="mb-1.5 block text-sm font-medium text-neutral-800"
          >
            Quiz title
          </label>
          <input
            id="quiz-title"
            {...register('title')}
            placeholder="e.g. JavaScript Basics"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'quiz-title-error' : undefined}
            className={inputClassName(
              !!errors.title,
              'bg-white/80 text-xl font-medium',
            )}
          />
          <FieldError id="quiz-title-error" message={errors.title?.message} />
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <QuestionEditor
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
          <FieldError message={questionsError} />
        </div>

        <button
          type="button"
          onClick={() => append(createEmptyQuestion())}
          disabled={fields.length >= MAX_QUESTIONS}
          className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-neutral-950/20 bg-white/40 px-4 py-5 font-medium text-neutral-700 backdrop-blur transition hover:border-neutral-950/50 hover:bg-white/70 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" aria-hidden />
          Add question
        </button>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <ButtonLink href="/quizzes" variant="secondary">
            Cancel
          </ButtonLink>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            )}
            {isSubmitting ? 'Creating…' : 'Create quiz'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
