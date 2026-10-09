import type { QuestionType } from '@/types/quiz';

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'BOOLEAN', label: 'True / False' },
  { value: 'INPUT', label: 'Short answer' },
  { value: 'CHECKBOX', label: 'Multiple choice' },
];

export const QUESTION_TYPE_LABELS = Object.fromEntries(
  QUESTION_TYPES.map(({ value, label }) => [value, label]),
) as Record<QuestionType, string>;
