import { notFound } from 'next/navigation';
import { Badge, Button, Card, PageHeader } from '@saqr/ui';
import { demoCourse } from '@saqr/types';
export default async function Course({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  if ((await params).courseId !== demoCourse.id) notFound();
  return (
    <>
      <PageHeader
        eyebrow="AGRICULTURE TRAINING"
        title={demoCourse.title}
        description={demoCourse.description}
      />
      <Badge>DEMO CURRICULUM · WEEK 1</Badge>
      <div className="grid-2 mt-6">
        <Card>
          <h2>Course outline</h2>
          <ol className="module-list">
            {demoCourse.modules.map((module, index) => (
              <li key={module}>
                <span>0{index + 1}</span>
                {module}
              </li>
            ))}
          </ol>
        </Card>
        <Card>
          <h2>Prepare for purposeful operations.</h2>
          <p className="muted">
            This sample curriculum introduces flight preparation, aircraft
            systems, safety and agricultural imaging.
          </p>
          <p className="muted">
            Full instructional material, saved progress and assessments will be
            added during the learning phase.
          </p>
          <Button asChild>
            <a href={`/learn/${demoCourse.id}/agriculture-lesson-1`}>
              Preview the learning workspace →
            </a>
          </Button>
        </Card>
      </div>
    </>
  );
}
