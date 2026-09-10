import { Badge, Button, Card, EmptyState, PageHeader } from '@saqr/ui';
export function ComingSoon({
  title,
  description,
  detail,
}: {
  title: string;
  description: string;
  detail: string;
}) {
  return (
    <>
      <PageHeader
        eyebrow="YOUR SAQR WORKSPACE"
        title={title}
        description={description}
      />
      <Card>
        <Badge>PLANNED FEATURE</Badge>
        <EmptyState title={title} description={detail} />
        <div className="flex justify-center">
          <Button asChild variant="secondary">
            <a href="/dashboard">Back to overview</a>
          </Button>
        </div>
      </Card>
    </>
  );
}
