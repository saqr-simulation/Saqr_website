import type { Metadata } from 'next';
import { PageHeader } from '@saqr/ui';
import { LeadForm } from '../../../components/lead-form';

export const metadata: Metadata = {
  title: 'Institutional demo',
  description:
    'Explore SAQR’s simulation-led drone training approach for institutions and agricultural operators.',
};
export default function Demo() {
  return (
    <div className="container section">
      <PageHeader
        eyebrow="FOR UNIVERSITIES, CMCS, ITSAS & AGRIBUSINESSES"
        title="More learners practicing. Fewer aircraft at risk."
        description="Explore a simulation-led flight laboratory for your existing computer classrooms. Share your needs so we can discuss curriculum, learner capacity and institutional evaluation."
      />
      <div className="conversion-layout">
        <aside className="conversion-story">
          <p className="eyebrow">BUILD TRAINING CAPACITY</p>
          <h2>
            Bring the learning lab
            <br />
            closer to the field.
          </h2>
          <p className="muted">
            For vocational centers, universities, drone academies and
            agribusinesses looking for a repeatable approach to agricultural
            flight preparation.
          </p>
          <ul className="benefit-list">
            <li>
              <strong>Protect real equipment</strong>
              <span>
                Give learners room to make their first mistakes in simulation
                before working with physical aircraft.
              </span>
            </li>
            <li>
              <strong>Expand opportunities to practice</strong>
              <span>
                Plan repeatable individual exercises without field weather
                windows or physical battery charging cycles.
              </span>
            </li>
            <li>
              <strong>Prepare for regional missions</strong>
              <span>
                Align foundational skills with local terrain and agricultural
                operating contexts.
              </span>
            </li>
          </ul>
          <ul className="benefit-list">
            <li>
              <strong>Instructor insight / planned</strong>
              <span>
                Learner telemetry and instructor monitoring are part of the
                roadmap for following flight practice across a class.
              </span>
            </li>
          </ul>
          <div className="notice">
            <strong>What we’ll discuss</strong>
            <p>
              Your curriculum, learner numbers, computer lab setup and
              evaluation goals. Simulator integration and instructor tools are
              being developed in phases.
            </p>
          </div>
        </aside>
        <LeadForm kind="demo" />
      </div>
    </div>
  );
}
