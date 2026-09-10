import { Card, PageHeader } from '@saqr/ui';
import { requireStudent } from '../../../lib/session';
import { LogoutButton } from '../../../components/logout-button';
export default async function Settings() {
  const student = await requireStudent();
  return (
    <>
      <PageHeader
        eyebrow="ACCOUNT"
        title="Your account"
        description="Your current sign-in details."
      />
      <Card>
        <dl className="profile-list">
          <div>
            <dt>Name</dt>
            <dd>{student.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd className="break-all">{student.email}</dd>
          </div>
        </dl>
        <p className="legal-note">
          Profile editing and account management are planned for a later phase.
        </p>
        <LogoutButton />
      </Card>
    </>
  );
}
