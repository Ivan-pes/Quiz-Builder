import type { CreateQuizPayload, QuizDetails, QuizSummary } from '@/types/quiz';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly messages: string[],
  ) {
    super(messages.join('; '));
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = body?.message ?? response.statusText;
    throw new ApiError(
      response.status,
      Array.isArray(message) ? message : [message],
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getQuizzes() {
  return request<QuizSummary[]>('/quizzes');
}

/** Returns `null` when the quiz does not exist. */
export async function getQuiz(id: number) {
  try {
    return await request<QuizDetails>(`/quizzes/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function createQuiz(payload: CreateQuizPayload) {
  return request<QuizDetails>('/quizzes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteQuiz(id: number) {
  return request<void>(`/quizzes/${id}`, { method: 'DELETE' });
}
