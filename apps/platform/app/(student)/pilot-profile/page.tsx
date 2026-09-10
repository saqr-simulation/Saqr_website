import { Avatar, Badge, Card, PageHeader, Progress } from '@saqr/ui';
import { requireStudent } from '../../../lib/session';
export default async function Profile() {
  const student = await requireStudent();
  return (
    <>
      <PageHeader
        eyebrow="YOUR PILOT IDENTITY"
        title="A profile built through progress."
        description="The beginning of your professional training story."
      />
      <div className="grid-2">
        <Card>
          <div className="flex items-center gap-4 mb-7">
            <Avatar name={student.name} />
            <div>
              <h2 className="text-xl! mb-1!">{student.name}</h2>
              <p className="muted text-sm mb-0! break-all">{student.email}</p>
            </div>
          </div>
          <Badge>TRAINEE · DEMO LEVEL</Badge>
          <dl className="profile-list mt-6">
            <div>
              <dt>Training level</dt>
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
              <dd>None issued</dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h2>Course progress</h2>
          <p className="muted">Agricultural Drone Operations</p>
          <p className="text-saqr">35% · simulated progress</p>
          <Progress value={35} />
          <p className="legal-note">
            Your identity comes from your authenticated account. Training level,
            specialization and progress illustrate the planned profile.
          </p>
        </Card>
        <Card>
          <h2>Competencies</h2>
          <p className="muted">
            Competencies will appear here as you complete assessed training. No
            competencies have been awarded.
          </p>
          <Badge>AWAITING ASSESSMENT</Badge>
        </Card>
        <Card>
          <h2>Your future flight record</h2>
          <dl className="profile-list">
            <div>
              <dt>Flight hours</dt>
              <dd>Not recorded</dd>
            </div>
            <div>
              <dt>Drone types</dt>
              <dd>Not recorded</dd>
            </div>
            <div>
              <dt>Licenses</dt>
              <dd>Not recorded</dd>
            </div>
            <div>
              <dt>Mission history</dt>
              <dd>Planned</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
