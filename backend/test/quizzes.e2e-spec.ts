import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';

const sampleQuiz = {
  title: '  E2E quiz  ',
  questions: [
    { type: 'BOOLEAN', text: 'Is the sky blue?', booleanAnswer: true },
    { type: 'INPUT', text: 'Capital of France?', inputAnswer: 'Paris' },
    {
      type: 'CHECKBOX',
      text: 'Pick the even numbers',
      options: [
        { text: '1', isCorrect: false },
        { text: '2', isCorrect: true },
        { text: '4', isCorrect: true },
      ],
    },
  ],
};

describe('Quizzes (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates, lists, returns and deletes a quiz', async () => {
    const created = await request(app.getHttpServer())
      .post('/quizzes')
      .send(sampleQuiz)
      .expect(201);

    const id = (created.body as { id: number }).id;
    expect(created.body).toMatchObject({
      title: 'E2E quiz',
      questions: [
        { type: 'BOOLEAN', booleanAnswer: true },
        { type: 'INPUT', inputAnswer: 'Paris' },
        {
          type: 'CHECKBOX',
          options: [{ text: '1' }, { text: '2' }, { text: '4' }],
        },
      ],
    });

    const list = await request(app.getHttpServer()).get('/quizzes').expect(200);
    expect(list.body).toContainEqual(
      expect.objectContaining({ id, title: 'E2E quiz', questionCount: 3 }),
    );

    await request(app.getHttpServer()).get(`/quizzes/${id}`).expect(200);
    await request(app.getHttpServer()).delete(`/quizzes/${id}`).expect(204);
    await request(app.getHttpServer()).get(`/quizzes/${id}`).expect(404);
    await request(app.getHttpServer()).delete(`/quizzes/${id}`).expect(404);
  });

  it.each([
    ['empty title', { ...sampleQuiz, title: '   ' }],
    ['no questions', { ...sampleQuiz, questions: [] }],
    [
      'boolean question without answer',
      { ...sampleQuiz, questions: [{ type: 'BOOLEAN', text: 'Q?' }] },
    ],
    [
      'checkbox without correct option',
      {
        ...sampleQuiz,
        questions: [
          {
            type: 'CHECKBOX',
            text: 'Q?',
            options: [
              { text: 'a', isCorrect: false },
              { text: 'b', isCorrect: false },
            ],
          },
        ],
      },
    ],
    [
      'unknown question type',
      { ...sampleQuiz, questions: [{ type: 'RADIO', text: 'Q?' }] },
    ],
  ])('rejects a quiz with %s', async (_, body) => {
    await request(app.getHttpServer()).post('/quizzes').send(body).expect(400);
  });

  it('returns 400 for a non-numeric id', async () => {
    await request(app.getHttpServer()).get('/quizzes/abc').expect(400);
  });
});
