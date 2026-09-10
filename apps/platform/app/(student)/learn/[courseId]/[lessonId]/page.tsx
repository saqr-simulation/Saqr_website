import { notFound } from 'next/navigation';
import { Badge, Button, Card, PageHeader } from '@saqr/ui';
import { demoCourse } from '@saqr/types';
export default async function Learn({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const lesson = Number(lessonId.replace('agriculture-lesson-', ''));
  if (
    courseId !== demoCourse.id ||
    !/^agriculture-lesson-\d+$/.test(lessonId) ||
    lesson < 1 ||
    lesson > 20
  )
    notFound();
  return (
    <>
      <PageHeader
        eyebrow="LEARNING WORKSPACE"
        title={`Lesson ${lesson}: ${demoCourse.modules[Math.floor((lesson - 1) / 4)]}`}
        description={`${demoCourse.title} · Sample lesson ${lesson}`}
      />
      <Card>
        <Badge>WORKSPACE PREVIEW</Badge>
        <h2 className="mt-6">Every mission starts with preparation.</h2>
        <p className="muted">
          This is a preview of your future learning workspace. Full lesson
          content, practice activities and saved completion will arrive in Week
          2.
        </p>
        <p className="muted">
          Your demonstration progress does not change when you open this page.
        </p>
        <Button variant="secondary" asChild>
          <a href={`/courses/${courseId}`}>Back to course outline</a>
        </Button>
      </Card>
    </>
  );
}
