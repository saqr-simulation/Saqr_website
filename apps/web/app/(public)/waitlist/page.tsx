import { sitePath } from '../../../lib/site-path';
import type { Metadata } from 'next';
import { PageHeader } from '@saqr/ui';
import { LeadForm } from '../../../components/lead-form';

export const metadata: Metadata = {
  title: 'Pilot early access',
  description:
    'Join SAQR’s early access waitlist for simulation-led agricultural drone training.',
};
export default function Waitlist() {
  return (
    <div className="container section">
      <PageHeader
        eyebrow="PILOT EARLY ACCESS / 2026"
        title="Prepare for industrial flight. Start in a virtual cockpit."
        description="Join SAQR’s early access community for agricultural drone simulation. Share your training goals and computer setup, and hear about simulator access and future pilot opportunities as they become available."
      />
      <div className="conversion-layout">
        <aside className="conversion-story">
          <p className="eyebrow">A PLACE TO BEGIN</p>
          <h2>
            More practice.
            <br />
            More confidence.
          </h2>
          <p className="muted">
            SAQR’s vision combines structured learning and simulation-led
            practice so aspiring pilots can prepare for demanding missions
            before entering the field.
          </p>
          <ul className="benefit-list">
            <li>
              <strong>Purposeful missions</strong>
              <span>
                Explore the skills behind mapping, crop observation and
                precision flight.
              </span>
            </li>
            <li>
              <strong>A clear progression</strong>
              <span>
                Move from foundational knowledge toward practical readiness.
              </span>
            </li>
            <li>
              <strong>A community in the making</strong>
              <span>
                Hear about the SAQR Cup and future certification opportunities,
                and invite fellow learners through your referral link.
              </span>
            </li>
          </ul>
          <a className="text-link" href={sitePath('/saqr-cup')}>
            Explore the SAQR Cup →
          </a>
          <p className="legal-note">
            Compatibility and release timing are still being evaluated. Hardware
            profiling helps us understand the computers and controllers our
            community uses.
          </p>
        </aside>
        <LeadForm kind="waitlist" />
      </div>
    </div>
  );
}
