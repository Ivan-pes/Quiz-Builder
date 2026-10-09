export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface QuizSummary {
  id: number;
  title: string;
  createdAt: string;
  questionCount: number;
}

export interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  booleanAnswer: boolean | null;
  inputAnswer: string | null;
  options: QuestionOption[];
}

export interface QuizDetails {
  id: number;
  title: string;
  createdAt: string;
  questions: Question[];
}

export type CreateQuestionPayload =
  | { type: 'BOOLEAN'; text: string; booleanAnswer: boolean }
  | { type: 'INPUT'; text: string; inputAnswer: string }
  | {
      type: 'CHECKBOX';
      text: string;
      options: { text: string; isCorrect: boolean }[];
    };

export interface CreateQuizPayload {
  title: string;
  questions: CreateQuestionPayload[];
}
