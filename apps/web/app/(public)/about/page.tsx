import { Card, PageHeader } from '@saqr/ui';
export default function About() {
  return (
    <div className="container section">
      <PageHeader
        eyebrow="OUR PURPOSE / ABOUT SAQR"
        title="Make room for mistakes. Make room for mastery."
        description="We’re building a place where aspiring pilots can learn demanding skills with less fear and more freedom to practice."
      />
      <div className="prose">
        <p>
          SAQR is building a bridge between drone education and practical
          industry knowledge. We believe learners need room to practice, make
          mistakes and try again. Our aim is to help learners understand not
          only how aircraft work, but how responsible operators prepare, make
          decisions and apply their skills.
        </p>
        <p>
          We begin with agriculture: a field where observation, planning and
          precision have clear real-world value.
        </p>
      </div>
      <section className="content-block">
        <p className="eyebrow">OUR CORE BELIEFS</p>
        <h2>What guides every next step.</h2>
        <div className="grid-2">
          {[
            [
              '01 / Safe failure',
              'A training mistake should become a lesson. Virtual practice gives learners a place to experiment without damaging real aircraft.',
            ],
            [
              '02 / Real-world readiness',
              'Practice needs a purpose beyond the screen. We aim to connect simulation scenarios with the decisions and aircraft behaviors operators encounter in the field.',
            ],
            [
              '03 / Wider access',
              'Learning opportunities should reach beyond expensive aircraft and specialist equipment. Community hardware feedback helps shape a more accessible platform.',
            ],
            [
              '04 / Confidence through repetition',
              'Confidence grows through trying, reviewing and trying again. Repeated practice helps turn deliberate control inputs into reliable operating habits.',
            ],
          ].map(([title, text]) => (
            <Card key={title}>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </Card>
          ))}
        </div>
      </section>
      <div className="notice">
        <strong>Building in phases.</strong>
        <p>
          The current learning platform is a preview. Full simulator
          integration, assessments, instructor support and credentials are part
          of the roadmap.
        </p>
      </div>
    </div>
  );
}
