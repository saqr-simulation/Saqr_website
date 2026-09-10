import {
  Badge,
  Button,
  Card,
  FieldVisual,
  MetricCard,
  PageHeader,
  Progress,
} from '@saqr/ui';
import { demoCourse, demoProgress } from '@saqr/types';
import { requireStudent } from '../../../lib/session';
export default async function Dashboard() {
  const student = await requireStudent();
  return (
    <>
      <PageHeader
        eyebrow="YOUR FLIGHT DECK"
        title={`Welcome back, ${student.name.split(' ')[0]}`}
        description="Continue building your professional drone pilot skills."
      >
        <Badge>TRAINEE PILOT</Badge>
      </PageHeader>
      <div className="notice">
        Demo learning data · Progress, enrollments and training hours below are
        simulated. Your name and account are real.
      </div>
      <div className="metrics">
        <MetricCard
          label="Courses Enrolled"
          value="1"
          detail="Agriculture track · demo"
        />
        <MetricCard
          label="Courses Completed"
          value="0"
          detail="Your journey is beginning"
        />
        <MetricCard
          label="Training Progress"
          value={`${demoProgress.percent}%`}
          detail={`${demoProgress.completedLessons} sample lessons completed`}
        />
        <MetricCard
          label="Certificates"
          value="0"
          detail="A future milestone"
        />
      </div>
      <div className="dashboard-grid">
        <div>
          <h2 className="small-title">Continue training</h2>
          <Card className="continue-card">
            <div>
              <Badge variant="agriculture">AGRICULTURE · DEMO</Badge>
              <h3>{demoCourse.title}</h3>
              <p className="muted text-sm">Module 2 / Drone Systems & Safety</p>
              <div className="flex justify-between text-xs muted">
                <span>7 of 20 lessons completed</span>
                <span className="text-saqr">35%</span>
              </div>
              <Progress value={35} />
              <Button asChild>
                <a href={`/learn/${demoCourse.id}/agriculture-lesson-8`}>
                  Continue training →
                </a>
              </Button>
            </div>
            <FieldVisual compact />
          </Card>
          <Card>
            <h2>Your training path</h2>
            <div className="training-path">
              {[
                ['01', 'Drone Foundations', 'Future foundation track'],
                ['02', 'Agricultural Operations', 'Current demo curriculum'],
                ['03', 'Advanced Agriculture', 'Future specialization'],
              ].map(([number, title, detail]) => (
                <div className="path-item" key={number}>
                  <span className="path-number">{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p className="muted">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="stack">
          <Card>
            <p className="eyebrow">UPCOMING ASSESSMENT · PREVIEW</p>
            <h2>Drone Systems & Safety</h2>
            <p className="muted text-sm">
              Review safe operating principles and mission preparation.
            </p>
            <a className="text-link" href="/assessments">
              View assessment plan →
            </a>
          </Card>
          <Card className="ai-card">
            <p className="eyebrow">✧ INTELLIGENCE / PLANNED</p>
            <h2>SAQR AI Assistant</h2>
            <p className="muted">
              Get help understanding your training material.
            </p>
            <a href="/ai" className="text-link">
              Ask SAQR AI →
            </a>
          </Card>
          <Card>
            <div className="flex justify-between items-center mb-5">
              <h2 className="mb-0!">Pilot profile</h2>
              <a
                href="/pilot-profile"
                aria-label="View pilot profile"
                className="text-saqr"
              >
                ↗
              </a>
            </div>
            <dl className="profile-list">
              <div>
                <dt>Pilot level</dt>
                <dd>Trainee</dd>
              </div>
              <div>
                <dt>Specialization</dt>
                <dd>Agriculture</dd>
              </div>
              <div>
                <dt>Training hours</dt>
                <dd>3.5 h · demo</dd>
              </div>
              <div>
                <dt>Certificates</dt>
                <dd>0</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
