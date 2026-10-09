import {
  ListChecks,
  TextCursorInput,
  ToggleRight,
  type LucideIcon,
} from 'lucide-react';
import type { QuestionType } from '@/types/quiz';

export interface QuestionTypeMeta {
  value: QuestionType;
  label: string;
  icon: LucideIcon;
  /** Classes for a tinted badge */
  badge: string;
  /** Classes for a solid colour dot/circle */
  dot: string;
}

export const QUESTION_TYPES: readonly QuestionTypeMeta[] = [
  {
    value: 'BOOLEAN',
    label: 'True / False',
    icon: ToggleRight,
    badge: 'bg-sky-100 text-sky-800',
    dot: 'bg-sky-500',
  },
  {
    value: 'INPUT',
    label: 'Short answer',
    icon: TextCursorInput,
    badge: 'bg-amber-100 text-amber-800',
    dot: 'bg-amber-400',
  },
  {
    value: 'CHECKBOX',
    label: 'Multiple choice',
    icon: ListChecks,
    badge: 'bg-violet-100 text-violet-800',
    dot: 'bg-violet-500',
  },
];

export const QUESTION_TYPE_META = Object.fromEntries(
  QUESTION_TYPES.map((meta) => [meta.value, meta]),
) as Record<QuestionType, QuestionTypeMeta>;
