import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await prisma.quiz.create({
    data: {
      title: 'JavaScript Basics',
      questions: {
        create: [
          {
            position: 0,
            type: 'BOOLEAN',
            text: 'JavaScript is a statically typed language.',
            booleanAnswer: false,
          },
          {
            position: 1,
            type: 'INPUT',
            text: 'Which keyword declares a block-scoped constant?',
            inputAnswer: 'const',
          },
          {
            position: 2,
            type: 'CHECKBOX',
            text: 'Which of these are primitive types in JavaScript?',
            options: {
              create: [
                { position: 0, text: 'string', isCorrect: true },
                { position: 1, text: 'number', isCorrect: true },
                { position: 2, text: 'array', isCorrect: false },
                { position: 3, text: 'boolean', isCorrect: true },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded sample quiz "JavaScript Basics"');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
