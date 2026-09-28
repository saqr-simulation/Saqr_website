import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const directUrl = process.env.DIRECT_URL;
if (!directUrl)
  throw new Error('DIRECT_URL is required for database seeding.');
const prisma = new PrismaClient({ datasourceUrl: directUrl });
const modules = [
  [
    'Introduction to Agricultural Drones',
    'The agricultural mission',
    'Aircraft and payloads',
    'Understanding a field',
    'Your operating environment',
  ],
  [
    'Drone Systems & Safety',
    'Aircraft systems',
    'Risk assessment',
    'Preflight checks',
    'Emergency planning',
  ],
  [
    'Mission & Flight Preparation',
    'Defining objectives',
    'Planning a route',
    'Weather considerations',
    'Crew briefing',
  ],
  [
    'Agricultural Drone Applications',
    'Crop monitoring',
    'Mapping fundamentals',
    'Multispectral imaging',
    'Spraying concepts',
  ],
  [
    'Assessment',
    'Knowledge review',
    'Mission scenario',
    'Safety review',
    'Readiness reflection',
  ],
];
async function seed() {
  const userId = '00000000-0000-4000-8000-000000000001';
  await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: 'demo.student@example.invalid',
        name: 'Demo Pilot',
      },
  });
  const course = await prisma.course.upsert({
      where: { slug: 'agricultural-drone-operations' },
      update: {},
      create: {
        id: 'agricultural-drone-operations',
        slug: 'agricultural-drone-operations',
        title: 'Agricultural Drone Operations',
        description:
          'Sample curriculum for safety, preparation, imaging and agricultural applications.',
        status: 'PUBLISHED',
      },
  });
  const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId: course.id } },
      update: {},
      create: { id: 'demo-enrollment', userId, courseId: course.id },
  });
  for (const [index, items] of modules.entries()) {
      const title = items[0]!;
      const moduleId = `agriculture-module-${index + 1}`;
    await prisma.module.upsert({
        where: { id: moduleId },
        update: {},
        create: {
          id: moduleId,
          courseId: course.id,
          title,
          position: index + 1,
        },
    });
    for (const [position, lessonTitle] of items.slice(1).entries()) {
        const lessonId = `agriculture-lesson-${index * 4 + position + 1}`;
      await prisma.lesson.upsert({
          where: { id: lessonId },
          update: {},
          create: {
            id: lessonId,
            moduleId,
            title: lessonTitle!,
            position: position + 1,
            content:
              'Demo lesson outline. Full learning material is planned for Week 2.',
          },
      });
      if (index * 4 + position < 7)
        await prisma.lessonProgress.upsert({
            where: {
              enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId },
            },
            update: {},
            create: {
              enrollmentId: enrollment.id,
              lessonId,
              completedAt: new Date('2026-01-01T12:00:00Z'),
            },
        });
    }
  }
  await prisma.quiz.upsert({
      where: { id: 'agriculture-safety-quiz' },
      update: {},
      create: {
        id: 'agriculture-safety-quiz',
        moduleId: 'agriculture-module-2',
        title: 'Drone Systems & Safety',
      },
  });
  await prisma.question.upsert({
      where: { id: 'agriculture-safety-question' },
      update: {},
      create: {
        id: 'agriculture-safety-question',
        quizId: 'agriculture-safety-quiz',
        prompt: 'What comes before a training flight?',
        options: [
          'A documented preflight check',
          'Skipping the weather check',
          'Starting without a mission plan',
        ],
        answerIndex: 0,
        position: 1,
      },
  });
  console.log(
    'Seeded one database-only demo student and one agriculture course. No Supabase login was created.',
  );
}
seed()
  .catch((error: unknown) => {
    console.error(
      'Seed failed:',
      error instanceof Error ? error.message : 'Unknown database error.',
    );
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
