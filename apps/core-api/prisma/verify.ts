import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import assert from 'node:assert/strict';
import { demoCourse, demoProgress, demoUsers } from '@saqr/types';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SAQR Database Verification Starting ---');

  // 1. Verify Users
  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' },
  });
  console.log(`Found ${users.length} users in database:`);
  for (const u of users) {
    console.log(`  - [${u.role}] ${u.name} (${u.email}) [ID: ${u.id}]`);
  }
  assert.equal(users.length, 5, 'Expected exactly 5 seeded users');

  const expectedUserIds = [
    demoUsers.traineeStudent.id,
    demoUsers.graduateStudent.id,
    demoUsers.newStudent.id,
    demoUsers.instructor.id,
    demoUsers.admin.id,
  ];
  for (const id of expectedUserIds) {
    assert.ok(
      users.some((u) => u.id === id),
      `User with id ${id} must exist in database`,
    );
  }

  // 2. Verify Course
  const course = await prisma.course.findUnique({
    where: { slug: demoCourse.id },
    include: {
      modules: {
        include: {
          lessons: true,
          quiz: {
            include: {
              questions: true,
            },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
  });
  assert.ok(course, `Course ${demoCourse.id} must exist`);
  assert.equal(course.status, 'PUBLISHED', 'Course status must be PUBLISHED');
  assert.equal(course.title, demoCourse.title, 'Course title must match demoCourse');
  console.log(`Course verified: "${course.title}" (${course.slug}), status: ${course.status}`);

  // 3. Verify Modules
  assert.equal(course.modules.length, 5, 'Course must have exactly 5 modules');
  console.log(`Modules verified: 5 modules found:`);
  for (const [i, mod] of course.modules.entries()) {
    assert.equal(mod.position, i + 1, `Module ${mod.id} position must be ${i + 1}`);
    assert.equal(mod.title, demoCourse.modules[i], `Module title must match demoCourse index ${i}`);
    assert.equal(mod.lessons.length, 4, `Module ${mod.title} must have exactly 4 lessons`);
    console.log(`  Module ${mod.position}: "${mod.title}" (4 lessons)`);
  }

  // 4. Verify Lessons
  const totalLessons = await prisma.lesson.count();
  assert.equal(totalLessons, 20, 'Expected exactly 20 lessons in database');
  assert.equal(totalLessons, demoProgress.totalLessons, 'Total lessons must match demoProgress');

  const lessonTypes = await prisma.lesson.groupBy({
    by: ['type'],
    _count: true,
  });
  console.log('Lesson types distribution:', lessonTypes);

  // 5. Verify Enrollments
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: course.id },
    include: {
      user: true,
      progress: true,
    },
  });
  assert.equal(enrollments.length, 3, 'Expected exactly 3 enrollments');
  console.log(`Enrollments verified: 3 student enrollments found`);

  // 6. Verify Progress & Mathematical Consistency
  console.log('Verifying mathematical consistency of student progress:');
  const traineeEnrollment = enrollments.find((e) => e.userId === demoUsers.traineeStudent.id);
  assert.ok(traineeEnrollment, 'Trainee enrollment must exist');
  const traineeCompletedCount = traineeEnrollment.progress.filter((p) => p.completedAt !== null).length;
  const traineePercentage = Math.round((traineeCompletedCount / totalLessons) * 100);
  console.log(`  - Demo Trainee: ${traineeCompletedCount}/${totalLessons} lessons = ${traineePercentage}%`);
  assert.equal(traineeCompletedCount, 7, 'Trainee must have completed exactly 7 lessons');
  assert.equal(traineeCompletedCount, demoProgress.completedLessons, 'Trainee completed lessons must match demoProgress');
  assert.equal(traineePercentage, 35, 'Trainee progress percentage must be 35%');
  assert.equal(traineePercentage, demoProgress.percent, 'Trainee progress % must match demoProgress.percent');
  assert.equal(traineeEnrollment.completedAt, null, 'Trainee enrollment must be in-progress (completedAt null)');

  const graduateEnrollment = enrollments.find((e) => e.userId === demoUsers.graduateStudent.id);
  assert.ok(graduateEnrollment, 'Graduate enrollment must exist');
  const graduateCompletedCount = graduateEnrollment.progress.filter((p) => p.completedAt !== null).length;
  const graduatePercentage = Math.round((graduateCompletedCount / totalLessons) * 100);
  console.log(`  - Graduate: ${graduateCompletedCount}/${totalLessons} lessons = ${graduatePercentage}%`);
  assert.equal(graduateCompletedCount, 20, 'Graduate must have completed all 20 lessons');
  assert.equal(graduatePercentage, 100, 'Graduate progress percentage must be 100%');
  assert.ok(graduateEnrollment.completedAt !== null, 'Graduate enrollment must be marked completed');

  const newEnrollment = enrollments.find((e) => e.userId === demoUsers.newStudent.id);
  assert.ok(newEnrollment, 'New student enrollment must exist');
  const newCompletedCount = newEnrollment.progress.filter((p) => p.completedAt !== null).length;
  const newPercentage = Math.round((newCompletedCount / totalLessons) * 100);
  console.log(`  - New Pilot: ${newCompletedCount}/${totalLessons} lessons = ${newPercentage}%`);
  assert.equal(newCompletedCount, 0, 'New student must have 0 completed lessons');
  assert.equal(newPercentage, 0, 'New student progress percentage must be 0%');
  assert.equal(newEnrollment.completedAt, null, 'New student enrollment must be in-progress');

  // 7. Verify Quizzes and Questions
  const quizzes = await prisma.quiz.findMany({
    include: { questions: true },
    orderBy: { title: 'asc' },
  });
  console.log(`Quizzes verified: ${quizzes.length} quizzes found:`);
  assert.equal(quizzes.length, 2, 'Expected exactly 2 quizzes');
  for (const q of quizzes) {
    console.log(`  - Quiz "${q.title}" (passScore: ${q.passScore}%) with ${q.questions.length} questions`);
    assert.equal(q.questions.length, 3, `Quiz ${q.title} must have 3 questions`);
  }

  const totalQuestions = await prisma.question.count();
  assert.equal(totalQuestions, 6, 'Expected exactly 6 questions');

  // 8. Verify Quiz Attempts
  const attempts = await prisma.quizAttempt.findMany({
    include: { user: true, quiz: true },
  });
  console.log(`Quiz attempts verified: ${attempts.length} attempts found:`);
  assert.equal(attempts.length, 3, 'Expected exactly 3 quiz attempts');
  for (const a of attempts) {
    console.log(`  - User: ${a.user.name}, Quiz: "${a.quiz.title}", Score: ${a.score}, Submitted: ${a.submittedAt?.toISOString() ?? 'In-progress'}`);
  }

  // 9. Verify Certificate
  const certificates = await prisma.certificate.findMany({
    include: { user: true, course: true },
  });
  console.log(`Certificates verified: ${certificates.length} certificate(s) found:`);
  assert.equal(certificates.length, 1, 'Expected exactly 1 certificate');
  const cert = certificates[0]!;
  assert.equal(cert.userId, demoUsers.graduateStudent.id, 'Certificate must belong to graduate student');
  assert.equal(cert.courseId, course.id, 'Certificate must belong to agriculture course');
  assert.equal(cert.revokedAt, null, 'Certificate must not be revoked');
  console.log(`  - Certificate "${cert.id}" issued to ${cert.user.name} for "${cert.course.title}" on ${cert.issuedAt.toISOString()}`);

  // 10. Verify Documents
  const documents = await prisma.document.findMany({
    include: { uploader: true, course: true },
  });
  console.log(`Documents verified: ${documents.length} document(s) found:`);
  assert.equal(documents.length, 3, 'Expected exactly 3 documents');
  for (const doc of documents) {
    assert.equal(doc.uploaderId, demoUsers.instructor.id, 'Document must be uploaded by instructor');
    assert.equal(doc.courseId, course.id, 'Document must belong to course');
    assert.equal(doc.status, 'READY', 'Document status must be READY');
    console.log(`  - [${doc.mimeType}] "${doc.title}" (path: ${doc.objectPath}) by ${doc.uploader.name}`);
  }

  // 11. Foreign Key Integrity and Orphan Checks
  console.log('Running Foreign Key and Orphan Record Integrity checks...');

  // Module -> Course
  const orphanModules = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "Module" m LEFT JOIN "Course" c ON m."courseId" = c."id" WHERE c."id" IS NULL;
  `;
  assert.equal(Number(orphanModules[0]?.count ?? 0n), 0, 'No orphan modules allowed');

  // Lesson -> Module
  const orphanLessons = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "Lesson" l LEFT JOIN "Module" m ON l."moduleId" = m."id" WHERE m."id" IS NULL;
  `;
  assert.equal(Number(orphanLessons[0]?.count ?? 0n), 0, 'No orphan lessons allowed');

  // Enrollment -> User, Course
  const orphanEnrollments = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "Enrollment" e 
    LEFT JOIN "User" u ON e."userId" = u."id" 
    LEFT JOIN "Course" c ON e."courseId" = c."id" 
    WHERE u."id" IS NULL OR c."id" IS NULL;
  `;
  assert.equal(Number(orphanEnrollments[0]?.count ?? 0n), 0, 'No orphan enrollments allowed');

  // LessonProgress -> Enrollment, Lesson
  const orphanProgress = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "LessonProgress" lp 
    LEFT JOIN "Enrollment" e ON lp."enrollmentId" = e."id" 
    LEFT JOIN "Lesson" l ON lp."lessonId" = l."id" 
    WHERE e."id" IS NULL OR l."id" IS NULL;
  `;
  assert.equal(Number(orphanProgress[0]?.count ?? 0n), 0, 'No orphan lesson progress allowed');

  // Quiz -> Module
  const orphanQuizzes = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "Quiz" q LEFT JOIN "Module" m ON q."moduleId" = m."id" WHERE m."id" IS NULL;
  `;
  assert.equal(Number(orphanQuizzes[0]?.count ?? 0n), 0, 'No orphan quizzes allowed');

  // Question -> Quiz
  const orphanQuestions = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "Question" qu LEFT JOIN "Quiz" q ON qu."quizId" = q."id" WHERE q."id" IS NULL;
  `;
  assert.equal(Number(orphanQuestions[0]?.count ?? 0n), 0, 'No orphan questions allowed');

  // QuizAttempt -> User, Quiz
  const orphanAttempts = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "QuizAttempt" qa 
    LEFT JOIN "User" u ON qa."userId" = u."id" 
    LEFT JOIN "Quiz" q ON qa."quizId" = q."id" 
    WHERE u."id" IS NULL OR q."id" IS NULL;
  `;
  assert.equal(Number(orphanAttempts[0]?.count ?? 0n), 0, 'No orphan quiz attempts allowed');

  // Certificate -> User, Course
  const orphanCerts = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "Certificate" c 
    LEFT JOIN "User" u ON c."userId" = u."id" 
    LEFT JOIN "Course" cr ON c."courseId" = cr."id" 
    WHERE u."id" IS NULL OR cr."id" IS NULL;
  `;
  assert.equal(Number(orphanCerts[0]?.count ?? 0n), 0, 'No orphan certificates allowed');

  // Document -> User, Course
  const orphanDocs = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM "Document" d 
    LEFT JOIN "User" u ON d."uploaderId" = u."id" 
    LEFT JOIN "Course" c ON d."courseId" = c."id" 
    WHERE u."id" IS NULL OR c."id" IS NULL;
  `;
  assert.equal(Number(orphanDocs[0]?.count ?? 0n), 0, 'No orphan documents allowed');

  console.log('✔ All Foreign Key relationships are intact. Zero orphan records detected across all 9 tables.');
  console.log('--- ALL SAQR DATABASE VERIFICATION CHECKS PASSED SUCCESSFULLY ---');
}

main()
  .catch((err) => {
    console.error('Database verification failed:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
