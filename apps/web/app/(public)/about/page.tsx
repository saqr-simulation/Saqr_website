import { Card, PageHeader } from '@saqr/ui';
export default function About() {
  return (
    <div className="container section">
      <PageHeader
        eyebrow="ABOUT SAQR"
        title="New perspectives. Grounded in purpose."
        description="A focused beginning for the next generation of professional drone pilots."
      />
      <div className="prose">
        <p>
          SAQR is building a bridge between drone education and practical
          industry knowledge. Our aim is to help learners understand not only
          how aircraft work, but how responsible operators prepare, make
          decisions and apply their skills.
        </p>
        <p>
          We begin with agriculture: a field where observation, planning and
          precision have clear real-world value.
        </p>
      </div>
      <div className="grid-3 mt-10">
        {[
          [
            'Our mission',
            'Connect structured education, practical competencies and technology.',
          ],
          [
            'Our approach',
            'A clear learning journey, transparent progress and a professional pilot profile.',
          ],
          [
            'Our stage',
            'An early platform preview. Full lessons, assessments and AI support are being developed in phases.',
          ],
        ].map(([title, text]) => (
          <Card key={title}>
            <h3>{title}</h3>
            <p className="muted">{text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
