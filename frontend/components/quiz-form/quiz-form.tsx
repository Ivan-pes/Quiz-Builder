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
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p className="font-medium">Could not create the quiz</p>
            <ul className="mt-1 list-inside list-disc">
              {serverErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <label
            htmlFor="quiz-title"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Quiz title
          </label>
          <input
            id="quiz-title"
            {...register('title')}
            placeholder="e.g. JavaScript Basics"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'quiz-title-error' : undefined}
            className={inputClassName(!!errors.title, 'text-lg')}
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
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-4 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" aria-hidden />
          Add question
        </button>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
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
