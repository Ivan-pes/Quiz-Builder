import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { QuestionType } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateQuestionDto, CreateQuizDto } from './dto/create-quiz.dto.js';

const quizDetailsInclude = {
  questions: {
    orderBy: { position: 'asc' },
    include: { options: { orderBy: { position: 'asc' } } },
  },
} satisfies Prisma.QuizInclude;

type QuizWithQuestions = Prisma.QuizGetPayload<{
  include: typeof quizDetailsInclude;
}>;

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuizDto) {
    const quiz = await this.prisma.quiz.create({
      data: {
        title: dto.title,
        questions: {
          create: dto.questions.map((question, index) =>
            this.toQuestionCreateInput(question, index),
          ),
        },
      },
      include: quizDetailsInclude,
    });

    return this.toQuizDetails(quiz);
  }

  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: { select: { questions: true } },
      },
    });

    return quizzes.map(({ _count, ...quiz }) => ({
      ...quiz,
      questionCount: _count.questions,
    }));
  }

  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: quizDetailsInclude,
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    return this.toQuizDetails(quiz);
  }

  async remove(id: number): Promise<void> {
    const { count } = await this.prisma.quiz.deleteMany({ where: { id } });

    if (count === 0) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }
  }

  /** Persists only the answer fields that belong to the question type. */
  private toQuestionCreateInput(
    question: CreateQuestionDto,
    position: number,
  ): Prisma.QuestionCreateWithoutQuizInput {
    const base = { type: question.type, text: question.text, position };

    switch (question.type) {
      case QuestionType.BOOLEAN:
        return { ...base, booleanAnswer: question.booleanAnswer };
      case QuestionType.INPUT:
        return { ...base, inputAnswer: question.inputAnswer };
      case QuestionType.CHECKBOX:
        return {
          ...base,
          options: {
            create: (question.options ?? []).map((option, index) => ({
              text: option.text,
              isCorrect: option.isCorrect,
              position: index,
            })),
          },
        };
    }
  }

  private toQuizDetails(quiz: QuizWithQuestions) {
    return {
      id: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        type: question.type,
        text: question.text,
        booleanAnswer: question.booleanAnswer,
        inputAnswer: question.inputAnswer,
        options: question.options.map(({ id, text, isCorrect }) => ({
          id,
          text,
          isCorrect,
        })),
      })),
    };
  }
}
