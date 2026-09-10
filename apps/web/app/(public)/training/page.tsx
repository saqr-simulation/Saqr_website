import { CourseCard, PageHeader } from '@saqr/ui';
import { demoCourse } from '@saqr/types';
import { platformUrl } from '../../../lib/config';
export default function Training() {
  return (
    <div className="container section">
      <PageHeader
        eyebrow="SAQR TRAINING"
        title="Build a strong foundation."
        description="Our first professional learning track starts in agriculture."
      />
      <div className="grid-2">
        <CourseCard
          title={demoCourse.title}
          description={demoCourse.description}
          href={platformUrl()}
        />
        <div className="card">
          <h2>Your curriculum</h2>
          <ol className="module-list">
            {demoCourse.modules.map((title, index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                {title}
              </li>
            ))}
          </ol>
          <p className="muted text-sm">
            Curriculum preview. Full lessons and assessments are planned for
            Week 2. Account creation is available once the preview deployment is
            configured.
          </p>
        </div>
      </div>
    </div>
  );
}
