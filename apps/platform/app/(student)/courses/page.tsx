import { CourseCard, PageHeader } from '@saqr/ui';
import { demoCourse } from '@saqr/types';
export default function Courses() {
  return (
    <>
      <PageHeader
        eyebrow="TRAINING"
        title="Your next perspective starts here."
        description="Explore the first SAQR curriculum. More specializations will follow."
      />
      <div className="grid-2">
        <CourseCard
          title={demoCourse.title}
          description={demoCourse.description}
          href={`/courses/${demoCourse.id}`}
        />
        <div className="card">
          <p className="eyebrow">A FOCUSED BEGINNING</p>
          <h2>
            One track.
            <br />A strong foundation.
          </h2>
          <p className="muted">
            We’re starting with agriculture to build a thoughtful,
            industry-oriented learning experience.
          </p>
          <p className="muted">
            This catalog uses an isolated sample curriculum. Enrollment and
            interactive learning are planned for Week 2.
          </p>
        </div>
      </div>
    </>
  );
}
