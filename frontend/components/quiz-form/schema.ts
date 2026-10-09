import { z } from 'zod';
import type { CreateQuizPayload } from '@/types/quiz';

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 10;
export const MAX_QUESTIONS = 50;

const optionSchema = z.object({
  text: z.string().trim().max(200, 'Option is too long (max 200 characters)'),
  isCorrect: z.boolean(),
});

/**
 * Every question keeps fields for all types so the user can switch types
 * without losing input; only the fields of the selected type are validated
 * and sent to the API.
 */
const questionSchema = z
  .object({
    type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
    text: z
      .string()
      .trim()
      .min(1, 'Question text is required')
      .max(500, 'Question is too long (max 500 characters)'),
    booleanAnswer: z.enum(['true', 'false']).nullable(),
    inputAnswer: z.string().trim().max(200, 'Answer is too long'),
    options: z.array(optionSchema),
  })
  .superRefine((question, ctx) => {
    switch (question.type) {
      case 'BOOLEAN':
        if (question.booleanAnswer === null) {
          ctx.addIssue({
            code: 'custom',
            path: ['booleanAnswer'],
            message: 'Select the correct answer',
          });
        }
        break;
      case 'INPUT':
        if (!question.inputAnswer) {
          ctx.addIssue({
            code: 'custom',
            path: ['inputAnswer'],
            message: 'Correct answer is required',
          });
        }
        break;
      case 'CHECKBOX':
        question.options.forEach((option, index) => {
          if (!option.text) {
            ctx.addIssue({
              code: 'custom',
              path: ['options', index, 'text'],
              message: 'Option text is required',
            });
          }
        });
        if (question.options.length < MIN_OPTIONS) {
          ctx.addIssue({
            code: 'custom',
            path: ['options'],
            message: `Add at least ${MIN_OPTIONS} options`,
          });
        } else if (!question.options.some((option) => option.isCorrect)) {
          ctx.addIssue({
            code: 'custom',
            path: ['options'],
            message: 'Mark at least one option as correct',
          });
        }
        break;
    }
  });

export const quizFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title is too long (max 200 characters)'),
  questions: z
    .array(questionSchema)
    .min(1, 'Add at least one question')
    .max(MAX_QUESTIONS, `A quiz can have at most ${MAX_QUESTIONS} questions`),
});

export type QuizFormInput = z.input<typeof quizFormSchema>;
export type QuizFormOutput = z.output<typeof quizFormSchema>;

export function createEmptyQuestion(): QuizFormInput['questions'][number] {
  return {
    type: 'BOOLEAN',
    text: '',
    booleanAnswer: null,
    inputAnswer: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
  };
}

export function toCreateQuizPayload(values: QuizFormOutput): CreateQuizPayload {
  return {
    title: values.title,
    questions: values.questions.map((question) => {
      switch (question.type) {
        case 'BOOLEAN':
          return {
            type: question.type,
            text: question.text,
            booleanAnswer: question.booleanAnswer === 'true',
          };
        case 'INPUT':
          return {
            type: question.type,
            text: question.text,
            inputAnswer: question.inputAnswer,
          };
        case 'CHECKBOX':
          return {
            type: question.type,
            text: question.text,
            options: question.options,
          };
      }
    }),
  };
}
