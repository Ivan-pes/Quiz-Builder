'use server';

import { refresh, revalidatePath } from 'next/cache';
import type { CreateQuizPayload } from '@/types/quiz';
import { ApiError, createQuiz, deleteQuiz } from './quiz-api';

export type ActionResult<T = void> =
  { ok: true; data: T } | { ok: false; errors: string[] };

function toErrorMessages(error: unknown): string[] {
  if (error instanceof ApiError) {
    return error.messages;
  }
  console.error(error);
  return ['Could not reach the server. Please try again.'];
}

export async function createQuizAction(
  payload: CreateQuizPayload,
): Promise<ActionResult<{ id: number }>> {
  try {
    const quiz = await createQuiz(payload);
    revalidatePath('/quizzes');
    return { ok: true, data: { id: quiz.id } };
  } catch (error) {
    return { ok: false, errors: toErrorMessages(error) };
  }
}

export async function deleteQuizAction(id: number): Promise<ActionResult> {
  try {
    await deleteQuiz(id);
  } catch (error) {
    // Already deleted elsewhere: the end result is the same, so just refresh
    if (!(error instanceof ApiError && error.status === 404)) {
      return { ok: false, errors: toErrorMessages(error) };
    }
  }
  refresh();
  return { ok: true, data: undefined };
}
