import { sitePath } from '../../../lib/site-path';
import { Button, CourseCard, PageHeader } from '@saqr/ui';
import type { Metadata } from 'next';
import { demoCourse } from '@saqr/types';
import { platformUrl } from '../../../lib/config';
import { simulationCurriculum, trainingStages } from '../../../lib/messaging';
export const metadata: Metadata = {
  title: 'Training methodology',
  description:
    'Follow SAQR’s four-stage roadmap from aviation fundamentals and simulator practice to supervised field validation and professional progression.',
};
export default function Training() {
  return (
    <div className="container section">
      <PageHeader
        eyebrow="THE SAQR TRAINING APPROACH"
        title="From your first control input to professional readiness."
        description="Four connected stages bring aviation knowledge, simulator practice and field preparation into a purposeful learning journey."
      />
      <section className="content-block">
        <p className="eyebrow">FOUR STAGES OF PILOT PROGRESSION</p>
        <h2>A clear path into the cockpit.</h2>
        <div className="grid-2 stage-cards">
          {trainingStages.map((stage, index) => (
            <section className="card" key={stage.title}>
              <p className="feature-number">
                0{index + 1} /{' '}
                <span className="stage-status">{stage.status}</span>
              </p>
              <h3>{stage.title}</h3>
              <p className="muted">{stage.description}</p>
            </section>
          ))}
        </div>
      </section>
      <div className="grid-2">
        <CourseCard
          title={demoCourse.title}
          description={demoCourse.description}
          href={platformUrl()}
        />
        <div className="card">
          <h2>The simulator curriculum</h2>
          <ol className="module-list">
            {simulationCurriculum.map((title, index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                {title}
              </li>
            ))}
          </ol>
          <p className="muted text-sm">
            Planned simulator topics. The platform’s current course preview
            remains available through the course link; lesson and simulator
            content are being developed in phases.
          </p>
        </div>
      </div>
      <p className="legal-note">
        SAQR learning and simulation credentials are intended to document
        training progress and operational proficiency. They do not replace
        formal flight licenses issued through accredited aviation authorities.
      </p>
      <div className="training-conversion">
        <div>
          <p className="eyebrow">YOUR NEXT STEP</p>
          <h2>Get ready for what comes next.</h2>
          <p className="muted">
            Join the early access community or explore training opportunities
            for your institution.
          </p>
        </div>
        <div className="hero-actions">
          <Button asChild>
            <a href={sitePath('/waitlist')}>Join the Pilot Waitlist ↗</a>
          </Button>
          <Button asChild variant="secondary">
            <a href={sitePath('/demo')}>Request a Demo →</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
