import { Button, FieldVisual, PageHeader } from '@saqr/ui';
import { platformUrl } from '../../../lib/config';
export default function Agriculture() {
  return (
    <div className="container section">
      <PageHeader
        eyebrow="AGRICULTURE FIRST"
        title="A purposeful place to begin."
        description="Understand the role of drone operations in modern agriculture."
      />
      <div className="split">
        <FieldVisual variant="agriculture-detail" />
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
          <div className="use-cases">
            {[
              'Crop monitoring',
              'Mapping',
              'Multispectral imaging',
              'Field inspection',
              'Precision agriculture',
              'Spraying operations',
            ].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <p className="legal-note">
            These are planned training topics. SAQR does not currently provide
            field operations, flight licenses or spraying services.
          </p>
          <Button asChild>
            <a href={platformUrl()}>Start your training journey ↗</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
