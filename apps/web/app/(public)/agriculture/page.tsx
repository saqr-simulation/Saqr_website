import { Button, Card, PageHeader } from '@saqr/ui';
import {
  AgricultureMission,
  FieldMission,
  MissionCompetencies,
} from '../../../components/field-mission';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Agricultural drone training',
  description:
    'Explore SAQR’s agriculture training track: crop monitoring, field mapping, terrain awareness, payload handling and emergency preparation.',
};
export default function Agriculture() {
  return (
    <div className="container section">
      <PageHeader
        eyebrow="AGRICULTURE / OUR FIRST SPECIALIZATION"
        title="Agricultural flight. Grounded in purpose."
        description="Connect digital flight practice with the realities of agricultural operations, from observing crop health to managing terrain and payloads."
      />
      <AgricultureMission>
        <FieldMission />
        <div>
          <h2>
            From aerial perspective
            <br />
            to field understanding.
          </h2>
          <p className="muted">
            The agriculture track introduces crop observation, mapping, imaging,
            mission preparation and safe operating principles. Learners will
            explore how each topic connects to agricultural decision-making.
          </p>
          <MissionCompetencies
            items={[
              'Crop monitoring',
              'Mission planning & mapping',
              'Multispectral & NDVI basics',
              'Terrain & wind awareness',
              'Precision agriculture',
              'Payload & spraying concepts',
            ]}
          />
          <p className="legal-note">
            These are planned training topics. SAQR does not currently provide
            field operations, flight licenses or spraying services.
          </p>
          <Button asChild>
            <a href="/waitlist">Join the agricultural training waitlist ↗</a>
          </Button>
        </div>
      </AgricultureMission>
      <section className="content-block">
        <p className="eyebrow">CORE AGRICULTURAL COMPETENCIES</p>
        <h2>Every flight has a field purpose.</h2>
        <div className="grid-3">
          {[
            [
              'Crop health & observation',
              'Understand how aerial observations help identify variations in crop condition and guide closer inspection.',
            ],
            [
              'Field mapping & mission planning',
              'Work with boundaries, survey routes and mission preparation before a flight begins.',
            ],
            [
              'Multispectral & NDVI fundamentals',
              'Learn the role of spectral imagery and vegetation indices in agricultural observation.',
            ],
            [
              'Low-altitude stability & terrain',
              'Explore hover control, wind drift and terrain awareness for precise flight near the ground.',
            ],
            [
              'Payloads & spraying dynamics',
              'Understand how changing loads affect aircraft response, flight lines and spraying concepts.',
            ],
            [
              'Safety & emergency recovery',
              'Build a foundation in operating checks, failure response and return-to-home procedures.',
            ],
          ].map(([title, text]) => (
            <Card key={title}>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="content-block">
        <p className="eyebrow">WHY SIMULATION MATTERS</p>
        <h2>
          More opportunities to rehearse.
          <br />
          Less pressure on field resources.
        </h2>
        <p className="muted">
          Virtual practice can address the practical constraints of real
          aircraft training while keeping supervised field experience part of
          the learning path.
        </p>
        <div
          className="comparison-scroll"
          role="region"
          aria-label="Field flight and virtual practice comparison"
          tabIndex={0}
        >
          <table className="comparison-table">
            <caption>
              Field training and the intended SAQR simulation approach
            </caption>
            <thead>
              <tr>
                <th scope="col">Training factor</th>
                <th scope="col">Physical field flight</th>
                <th scope="col">Virtual practice</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Aircraft damage',
                  'Mistakes can require costly repairs or replacement.',
                  'Virtual crashes do not damage a physical aircraft.',
                ],
                [
                  'Battery wear',
                  'Practice uses charge cycles and requires recharge time.',
                  'Simulated batteries allow exercises without physical battery wear.',
                ],
                [
                  'Weather conditions',
                  'Flight time depends on suitable conditions and safe limits.',
                  'Wind scenarios can be rehearsed in a virtual environment.',
                ],
                [
                  'Spraying resources',
                  'Exercises require water or other consumables and field preparation.',
                  'Spraying scenarios can be repeated without using field consumables.',
                ],
                [
                  'Classroom capacity',
                  'Learners share aircraft, instructors and available flight time.',
                  'Individual simulator sessions can support practice across a computer lab.',
                ],
              ].map(([factor, field, virtual]) => (
                <tr key={factor}>
                  <th scope="row">{factor}</th>
                  <td>{field}</td>
                  <td>{virtual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="legal-note">
          Qualitative comparison of training methods. Simulator compatibility
          and classroom deployment are being evaluated; actual costs and
          capacity depend on equipment and training arrangements.
        </p>
        <Button asChild>
          <a href="/waitlist">Join the agricultural missions waitlist ↗</a>
        </Button>
      </section>
    </div>
  );
}
