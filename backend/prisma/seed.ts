import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Prisma } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

type SeedQuestion =
  | { type: 'BOOLEAN'; text: string; booleanAnswer: boolean }
  | { type: 'INPUT'; text: string; inputAnswer: string }
  | {
      type: 'CHECKBOX';
      text: string;
      options: { text: string; isCorrect: boolean }[];
    };

const sampleQuizzes: { title: string; questions: SeedQuestion[] }[] = [
  {
    title: 'JavaScript Basics',
    questions: [
      {
        type: 'BOOLEAN',
        text: 'JavaScript is a statically typed language.',
        booleanAnswer: false,
      },
      {
        type: 'INPUT',
        text: 'Which keyword declares a block-scoped constant?',
        inputAnswer: 'const',
      },
      {
        type: 'CHECKBOX',
        text: 'Which of these are primitive types in JavaScript?',
        options: [
          { text: 'string', isCorrect: true },
          { text: 'number', isCorrect: true },
          { text: 'array', isCorrect: false },
          { text: 'boolean', isCorrect: true },
        ],
      },
    ],
  },
  {
    title: 'World Geography',
    questions: [
      {
        type: 'BOOLEAN',
        text: 'The Nile is the longest river in Africa.',
        booleanAnswer: true,
      },
      { type: 'INPUT', text: 'Capital of Canada?', inputAnswer: 'Ottawa' },
      {
        type: 'CHECKBOX',
        text: 'Which of these are continents?',
        options: [
          { text: 'Asia', isCorrect: true },
          { text: 'Greenland', isCorrect: false },
          { text: 'Africa', isCorrect: true },
        ],
      },
      {
        type: 'BOOLEAN',
        text: 'Australia is both a country and a continent.',
        booleanAnswer: true,
      },
      {
        type: 'INPUT',
        text: 'Largest ocean on Earth?',
        inputAnswer: 'Pacific',
      },
    ],
  },
  {
    title: 'TypeScript Fundamentals',
    questions: [
      {
        type: 'CHECKBOX',
        text: 'Which of these are built-in TypeScript utility types?',
        options: [
          { text: 'Partial', isCorrect: true },
          { text: 'Pick', isCorrect: true },
          { text: 'Merge', isCorrect: false },
        ],
      },
      {
        type: 'BOOLEAN',
        text: 'TypeScript types exist at runtime.',
        booleanAnswer: false,
      },
    ],
  },
];

function toQuestionInput(
  question: SeedQuestion,
  position: number,
): Prisma.QuestionCreateWithoutQuizInput {
  if (question.type === 'CHECKBOX') {
    return {
      type: question.type,
      text: question.text,
      position,
      options: {
        create: question.options.map((option, index) => ({
          ...option,
          position: index,
        })),
      },
    };
  }
  return { ...question, position };
}

async function main() {
  for (const quiz of sampleQuizzes) {
    // Idempotent: running the seed twice does not create duplicates
    const existing = await prisma.quiz.findFirst({
      where: { title: quiz.title },
    });
    if (existing) {
      console.log(`Skipped "${quiz.title}" (already exists)`);
      continue;
    }

    await prisma.quiz.create({
      data: {
        title: quiz.title,
        questions: { create: quiz.questions.map(toQuestionInput) },
      },
    });
    console.log(`Seeded "${quiz.title}"`);
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
