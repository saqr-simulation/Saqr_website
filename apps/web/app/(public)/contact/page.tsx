import { sitePath } from '../../../lib/site-path';
import { Button, Card, PageHeader } from '@saqr/ui';
export default function Contact() {
  const email = process.env.CONTACT_EMAIL;
  return (
    <div className="container section">
      <PageHeader
        eyebrow="CONTACT & PARTNERSHIPS"
        title="Let’s take drone training further."
        description="A partnership desk for educators, commercial operators and the pilot community. Find the conversation that fits your goals."
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
          <p className="muted">
            Curriculum collaboration and simulation-led learning for vocational
            centers and universities.
          </p>
          <h3>Agriculture & industry</h3>
          <p className="muted">
            Mission insight, field-training opportunities and the skills
            agricultural operators need.
          </p>
          <h3>Pilot community & technology</h3>
          <p className="muted">
            Questions and ideas about training access, controller setups and
            purposeful practice.
          </p>
          <div className="contact-paths">
            <a className="text-link" href={sitePath('/demo')}>
              Institutional demo request →
            </a>
            <a className="text-link" href={sitePath('/waitlist')}>
              Pilot early access →
            </a>
            <a className="text-link" href={sitePath('/saqr-cup')}>
              SAQR Cup interest →
            </a>
          </div>
        </Card>
      </div>
      <section className="content-block">
        <p className="eyebrow">THREE WAYS TO CONNECT</p>
        <h2>
          A shared ambition.
          <br />
          Different paths to contribute.
        </h2>
        <div className="grid-3">
          <Card>
            <p className="feature-number">01 / INSTITUTIONS & ACADEMIA</p>
            <h3>Shape the learning laboratory.</h3>
            <p className="muted">
              For vocational centers such as CMCs and ITSAs, universities such
              as ENA, IAV and UM6P, and agricultural training programs exploring
              simulator practice in their computer labs.
            </p>
            <a href={sitePath('/demo')} className="text-link">
              Discuss institutional training →
            </a>
          </Card>
          <Card>
            <p className="feature-number">02 / COMMERCIAL OPERATORS</p>
            <h3>Connect training with the field.</h3>
            <p className="muted">
              For spraying contractors and drone businesses interested in
              training insight, future competition sponsorship, recruitment
              connections or supervised field opportunities.
            </p>
            <a
              href={
                email
                  ? `mailto:${email}?subject=Commercial%20partnership%20inquiry`
                  : sitePath('/demo')
              }
              className="text-link"
            >
              Start an operator conversation →
            </a>
          </Card>
          <Card>
            <p className="feature-number">03 / PILOTS & STUDENTS</p>
            <h3>Find your starting point.</h3>
            <p className="muted">
              For students, independent pilots and enthusiasts exploring
              simulator access, computer compatibility, controller setups and
              SAQR Cup participation.
            </p>
            <a href={sitePath('/waitlist')} className="text-link">
              Join the pilot community →
            </a>
          </Card>
        </div>
        <p className="legal-note">
          Direct contact and WhatsApp support details will be published with the
          public release. The inquiry forms are available now for training,
          early access and tournament interest.
        </p>
      </section>
    </div>
  );
}
