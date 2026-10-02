import { sitePath } from '../../../lib/site-path';
import type { Metadata } from 'next';
import { Button, Card } from '@saqr/ui';
import { LeadForm } from '../../../components/lead-form';

export const metadata: Metadata = {
  title: 'SAQR Cup 2026',
  description:
    'Discover the planned SAQR Cup, a simulation-based competition for Morocco’s aspiring agricultural drone pilots.',
};
export default function SaqrCup() {
  return (
    <>
      <section className="cup-hero dark-surface">
        <div className="container split">
          <div>
            <p className="eyebrow">
              NATIONAL PILOT COMPETITION / PLANNED 2026 EDITION
            </p>
            <h1>
              From virtual practice.
              <br />
              <em>To your next flight.</em>
            </h1>
            <p className="muted">
              The SAQR Cup 2026 is a planned simulation-based competition for
              Morocco’s aspiring drone pilots. Build precision, test your skills
              and discover what your next flight could lead to.
            </p>
            <Button asChild>
              <a href="#pre-register">Register your interest ↗</a>
            </Button>
          </div>
          <div className="cup-emblem" aria-hidden="true">
            <span className="cup-year">
              20
              <br />
              26
            </span>
            <span className="cup-name">SAQR CUP</span>
            <span className="cup-ring" />
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE NEXT GENERATION / MOROCCO</p>
            <h2>
              A challenge built
              <br />
              around real skills.
            </h2>
          </div>
          <p className="muted">
            A proposed path from virtual flight practice to professional
            development. Full rules and confirmed rewards will be published
            before the competition opens.
          </p>
        </div>
        <div className="grid-3">
          {[
            [
              '01 / PRACTICE',
              'Precision takes repetition.',
              'The proposed format centers on simulated flight hours and agricultural mission challenges.',
            ],
            [
              '02 / COMPETE',
              'Put your progress to the test.',
              'Qualification, scoring and controller requirements will be detailed in the official rules.',
            ],
            [
              '03 / PROGRESS',
              'Look beyond the leaderboard.',
              'The launch plan targets a sponsored certification opportunity worth 5,000+ DH and connections with agricultural operators, subject to confirmed partners.',
            ],
          ].map(([number, title, description]) => (
            <Card key={number} className="feature-card">
              <p className="feature-number">{number}</p>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </Card>
          ))}
        </div>
        <div className="cup-highlights">
          <p>
            <strong>Student beta participation</strong>
            <span>
              Free beta entry is part of the proposed competition format,
              subject to release and eligibility.
            </span>
          </p>
          <p>
            <strong>Professional opportunities</strong>
            <span>
              The plan connects pilot development with agricultural operators
              and a sponsored certification opportunity.
            </span>
          </p>
          <p>
            <strong>Flight records / planned</strong>
            <span>
              Simulator hours and performance records are intended to support
              skill evaluation as tracking becomes available.
            </span>
          </p>
        </div>
      </section>
      <section
        id="pre-register"
        className="container section conversion-layout"
      >
        <aside className="conversion-story">
          <p className="eyebrow">GET READY FOR THE STARTING LINE</p>
          <h2>
            The next move
            <br />
            is yours.
          </h2>
          <p className="muted">
            Students, enthusiasts and experienced pilots can register interest
            now. Tell us where you’re based and how you fly, and we’ll share
            confirmed updates.
          </p>
          <div className="notice">
            <strong>Competition details are coming.</strong>
            <p>
              Dates, eligibility, qualification hours, prizes and scoring are
              not yet final. Pre-registration does not confirm entry or provide
              a simulator download.
            </p>
          </div>
          <a className="text-link" href={sitePath('/training')}>
            Discover the training approach →
          </a>
        </aside>
        <LeadForm kind="cup" />
      </section>
    </>
  );
}
