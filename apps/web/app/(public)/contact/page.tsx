import { Button, Card, PageHeader } from '@saqr/ui';
export default function Contact() {
  const email = process.env.CONTACT_EMAIL;
  return (
    <div className="container section">
      <PageHeader
        eyebrow="CONTACT & PARTNERSHIPS"
        title="Let’s build the next perspective."
        description="For training interest, education partnerships and agricultural collaboration."
      />
      <div className="grid-2">
        <Card>
          <h2>Start a conversation.</h2>
          <p className="muted">
            Tell us about your organization, the skills you want to develop and
            how you would like to work with SAQR.
          </p>
          {email ? (
            <Button asChild>
              <a href={`mailto:${email}`}>Contact the SAQR team ↗</a>
            </Button>
          ) : (
            <div className="notice">
              Our public contact channel is being prepared. Please check back
              when SAQR launches.
            </div>
          )}
        </Card>
        <Card>
          <p className="eyebrow">AREAS OF COLLABORATION</p>
          <h3>Education & training</h3>
          <p className="muted">Curriculum insight and learning partnerships.</p>
          <h3>Agriculture & industry</h3>
          <p className="muted">
            Real-world perspectives on professional competencies.
          </p>
          <h3>Technology</h3>
          <p className="muted">
            Tools and ideas that support purposeful learning.
          </p>
        </Card>
      </div>
    </div>
  );
}
