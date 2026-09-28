import 'reflect-metadata';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import type { PrismaService } from './database/prisma.service';
import type { UsersService } from './users/users.service';
import { CoursesService } from './courses/courses.service';
import { EnrollmentsService } from './enrollments/enrollments.service';
import { ProgressService } from './progress/progress.service';
import { QuizService } from './quiz/quiz.service';

const identity = {
  id: '00000000-0000-4000-8000-000000000099',
  email: 'pilot@example.test',
  name: 'Pilot',
};
const users = {
  sync: async () => ({ id: identity.id, role: 'STUDENT' }),
  requireAuthor: async () => ({ id: identity.id, role: 'ADMIN' }),
} as unknown as UsersService;

test('course detail returns ordered nested data and calculated enrollment progress', async () => {
  const findFirst = async () => ({
    id: 'course-1',
    slug: 'course-1',
    title: 'Course',
    description: 'Description',
    modules: [
      {
        id: 'module-1',
        title: 'Module',
        position: 1,
        lessons: [
          { id: 'lesson-1', title: 'One', position: 1, type: 'TEXT' },
          { id: 'lesson-2', title: 'Two', position: 2, type: 'TEXT' },
        ],
        quiz: null,
      },
    ],
    enrollments: [
      {
        id: 'enrollment-1',
        enrolledAt: new Date('2026-01-01'),
        completedAt: null,
        progress: [{ lessonId: 'lesson-1', completedAt: new Date() }],
      },
    ],
  });
  const service = new CoursesService(
    { course: { findFirst } } as unknown as PrismaService,
    users,
  );
  const result = await service.detail('course-1', identity);
  assert.equal(result.modules[0]?.lessons.length, 2);
  assert.equal(result.enrollment?.progressPercent, 50);
  assert.equal(result.enrollment?.completedLessons, 1);
});

test('missing course detail returns 404', async () => {
  const service = new CoursesService(
    { course: { findFirst: async () => null } } as unknown as PrismaService,
    users,
  );
  await assert.rejects(
    () => service.detail('missing', identity),
    NotFoundException,
  );
});

test('enrollment creates once, appears in listing and duplicate is a conflict', async () => {
  const row = {
    id: 'enrollment-1',
    enrolledAt: new Date('2026-01-01'),
    completedAt: null,
    course: {
      id: 'course-1',
      slug: 'course-1',
      title: 'Course',
      description: 'Description',
      modules: [{ lessons: [{ id: 'lesson-1' }, { id: 'lesson-2' }] }],
    },
    progress: [],
  };
  let duplicate = false;
  const prisma = {
    course: { findFirst: async () => ({ id: 'course-1' }) },
    enrollment: {
      create: async () => {
        if (duplicate) throw { code: 'P2002' };
        duplicate = true;
        return row;
      },
      findMany: async () => [row],
    },
  } as unknown as PrismaService;
  const service = new EnrollmentsService(prisma, users);
  assert.equal((await service.enroll(identity, 'course-1')).progressPercent, 0);
  assert.equal((await service.list(identity))[0]?.course.id, 'course-1');
  await assert.rejects(
    () => service.enroll(identity, 'course-1'),
    ConflictException,
  );
});

test('lesson completion is idempotent and returns persisted course progress', async () => {
  let upserts = 0;
  let completedAt: Date | null = null;
  const tx = {
    enrollment: {
      findUnique: async () => ({
        id: 'enrollment-1',
        enrolledAt: new Date('2026-01-01'),
        completedAt,
        course: {
          id: 'course-1',
          slug: 'course-1',
          title: 'Course',
          modules: [{ lessons: [{ id: 'lesson-1' }, { id: 'lesson-2' }] }],
        },
        progress: [{ lessonId: 'lesson-1', completedAt: new Date() }],
      }),
      update: async ({ data }: { data: { completedAt: Date | null } }) => {
        completedAt = data.completedAt;
      },
    },
  };
  const prisma = {
    lesson: {
      findUnique: async () => ({
        id: 'lesson-1',
        module: { courseId: 'course-1', course: { status: 'PUBLISHED' } },
      }),
    },
    enrollment: { findUnique: async () => ({ id: 'enrollment-1' }) },
    lessonProgress: { upsert: async () => void (upserts += 1) },
    $transaction: async (callback: (client: typeof tx) => unknown) =>
      callback(tx),
  } as unknown as PrismaService;
  const service = new ProgressService(prisma, users);
  assert.equal(
    (await service.complete(identity, 'lesson-1')).progressPercent,
    50,
  );
  assert.equal(
    (await service.complete(identity, 'lesson-1')).completedLessons,
    1,
  );
  assert.equal(upserts, 2);
  assert.equal(completedAt, null);
});

test('quiz submission validates answers, scores pass/fail and stores the attempt', async () => {
  const questions = [
    { id: 'q1', options: ['A', 'B'], answerIndex: 0 },
    { id: 'q2', options: ['A', 'B'], answerIndex: 1 },
  ];
  let saved: Record<string, unknown> | undefined;
  const tx = {
    quiz: {
      findUnique: async () => ({ id: 'quiz-1', passScore: 70, questions }),
    },
    quizAttempt: {
      create: async ({ data }: { data: Record<string, unknown> }) => {
        saved = data;
        return {
          id: 'attempt-1',
          score: data.score as number,
          startedAt: new Date(),
          submittedAt: data.submittedAt as Date,
        };
      },
    },
  };
  const prisma = {
    quiz: {
      findUnique: async () => ({
        module: {
          course: {
            status: 'PUBLISHED',
            enrollments: [{ id: 'enrollment-1' }],
          },
        },
      }),
    },
    $transaction: async (callback: (client: typeof tx) => unknown) =>
      callback(tx),
  } as unknown as PrismaService;
  const service = new QuizService(prisma, users);
  const passed = await service.submit(identity, 'quiz-1', [
    { questionId: 'q1', optionIndex: 0 },
    { questionId: 'q2', optionIndex: 1 },
  ]);
  assert.equal(passed.score, 100);
  assert.equal(passed.passed, true);
  assert.equal(saved?.quizId, 'quiz-1');
  const failed = await service.submit(identity, 'quiz-1', [
    { questionId: 'q1', optionIndex: 1 },
    { questionId: 'q2', optionIndex: 1 },
  ]);
  assert.equal(failed.score, 50);
  assert.equal(failed.passed, false);
  await assert.rejects(
    () =>
      service.submit(identity, 'quiz-1', [
        { questionId: 'q1', optionIndex: 0 },
      ]),
    BadRequestException,
  );
  await assert.rejects(
    () =>
      service.submit(identity, 'quiz-1', [
        { questionId: 'q1', optionIndex: 4 },
        { questionId: 'q2', optionIndex: 1 },
      ]),
    BadRequestException,
  );
});
