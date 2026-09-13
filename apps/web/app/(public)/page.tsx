import { Badge, Button, Card, FieldVisual, Progress, Reveal } from '@saqr/ui';
import { platformUrl } from '../../lib/config';

export default function Home() {
  return (
    <>
      <section className="hero container">
        <Reveal>
          <div>
            <p className="eyebrow">THE NEXT GENERATION OF DRONE PILOTS</p>
            <h1>
              Professional Drone Training,<br />
              <em>Built for the Real World.</em>
            </h1>
            <p className="hero-description muted">
              SAQR trains professional drone pilots with practical skills for agriculture and real-world industrial applications.
            </p>
            <div className="hero-actions">
              <Button asChild>
                <a href={platformUrl()}>
                  Start Training <span aria-hidden="true">↗</span>
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href="/training">
                  Explore Programs <span aria-hidden="true">→</span>
                </a>
              </Button>
            </div>
            <p className="hero-footnote">
              <span className="status-dot" /> Learn. Practice. Assess. Certify.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.2} className="hero-art">
          <FieldVisual />
        </Reveal>
      </section>

      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">WHAT IS SAQR?</p>
              <h2>
                More than flying.<br />
                We build professional drone operators.
              </h2>
            </div>
            <p className="muted">
              SAQR combines structured drone education, practical training and industry-oriented skills to prepare pilots for real operational environments.
            </p>
          </div>
        </Reveal>
        <div className="grid-3">
          <Reveal delay={0.1}>
            <Card className="feature-card">
              <p className="feature-number">01 — LEARN</p>
              <h3>Build the fundamentals</h3>
              <p className="muted">Drone systems, flight principles, safety and operational knowledge.</p>
            </Card>
          </Reveal>
          <Reveal delay={0.2}>
            <Card className="feature-card">
              <p className="feature-number">02 — PRACTICE</p>
              <h3>Develop real skills</h3>
              <p className="muted">Train through practical scenarios and operational missions.</p>
            </Card>
          </Reveal>
          <Reveal delay={0.3}>
            <Card className="feature-card">
              <p className="feature-number">03 — CERTIFY</p>
              <h3>Prove your skills</h3>
              <p className="muted">Assess your knowledge and build a professional pilot profile.</p>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">PROGRAMS</p>
              <h2>Our Training Programs</h2>
            </div>
            <p className="muted">
              Build the skills you need to operate drones professionally.
            </p>
          </div>
        </Reveal>
        <div className="grid-2">
          <Reveal delay={0.1}>
            <Card className="course-card">
              <FieldVisual compact />
              <div className="course-content">
                <Badge>AGRICULTURE · DEMO CURRICULUM</Badge>
                <h2>Agricultural Drone Operations</h2>
                <p className="muted">
                  Learn how professional drones are used in modern agriculture, from field inspection to precision operations.
                </p>
                <div className="use-cases" style={{ marginTop: '20px' }}>
                  <span>Drone systems & safety</span>
                  <span>Crop monitoring</span>
                  <span>Field mapping</span>
                  <span>Multispectral imaging</span>
                  <span>Field inspection</span>
                  <span>Precision agriculture</span>
                </div>
                <div style={{ marginTop: '30px' }}>
                  <Button asChild>
                    <a href="/agriculture">
                      View program <span aria-hidden="true">↗</span>
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <p className="eyebrow">TRAINING PROCESS</p>
          <h2>How SAQR Training Works</h2>
        </Reveal>
        <div className="journey">
          <Reveal delay={0.1} className="journey-step">
            <span>01 /</span>
            <h3>Learn</h3>
          </Reveal>
          <Reveal delay={0.2} className="journey-step">
            <span>02 /</span>
            <h3>Practice</h3>
          </Reveal>
          <Reveal delay={0.3} className="journey-step">
            <span>03 /</span>
            <h3>Assess</h3>
          </Reveal>
          <Reveal delay={0.4} className="journey-step">
            <span>04 /</span>
            <h3>Certify</h3>
          </Reveal>
          <Reveal delay={0.5} className="journey-step">
            <span>05 /</span>
            <h3>Build Your Pilot Profile</h3>
          </Reveal>
        </div>
      </section>

      <section className="agriculture-section">
        <div className="section container split">
          <Reveal>
            <FieldVisual />
          </Reveal>
          <Reveal delay={0.2}>
            <p className="eyebrow">APPLICATION</p>
            <h2>Drone Technology Meets Agriculture.</h2>
            <p className="muted">
              Learn how professional drone operations can support modern agriculture through data, inspection and precision workflows.
            </p>
            <div className="use-cases">
              {[
                'Crop monitoring',
                'Field mapping',
                'Multispectral imaging',
                'Field inspection',
                'Precision agriculture',
                'Spraying concepts',
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div style={{ marginTop: '30px' }}>
              <Button asChild variant="secondary">
                <a href="/agriculture">
                  Explore Agriculture Training <span aria-hidden="true">→</span>
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="platform" className="container section split">
        <Reveal>
          <p className="eyebrow">THE PLATFORM</p>
          <h2>Your Training Journey, In One Place.</h2>
          <p className="muted">
            Track your courses, progress, assessments and professional development from a single learning platform.
          </p>
          <Button asChild variant="secondary">
            <a href={platformUrl()}>Explore the Platform <span aria-hidden="true">↗</span></a>
          </Button>
        </Reveal>
        <Reveal delay={0.2} className="preview">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <span style={{ fontSize: '0.875rem' }}>SAQR / PILOT OVERVIEW</span>
            <Badge>DEMO PREVIEW</Badge>
          </div>
          <p className="eyebrow">CONTINUE TRAINING</p>
          <h3>Agricultural Drone Operations</h3>
          <p className="muted" style={{ fontSize: '0.875rem' }}>Module 2 · Drone Systems & Safety</p>
          <div className="preview-row">
            <span>7 of 20 sample lessons</span>
            <strong>35%</strong>
          </div>
          <Progress value={35} />
          <div className="grid-2" style={{ marginTop: '28px' }}>
            <Card>
              <p style={{ fontSize: '0.875rem' }}>Course progress</p>
              <span className="muted" style={{ fontSize: '0.75rem' }}>Track your modules</span>
            </Card>
            <Card>
              <p style={{ fontSize: '0.875rem' }}>Pilot Profile</p>
              <span className="muted" style={{ fontSize: '0.75rem' }}>Certificates & assessments</span>
            </Card>
          </div>
        </Reveal>
      </section>

      <section id="why-saqr" className="section container">
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">WHY SAQR</p>
              <h2>Why Train With SAQR?</h2>
            </div>
          </div>
        </Reveal>
        <div className="grid-3">
          <Reveal delay={0.1}>
            <Card>
              <p className="feature-number">01 — Industry-oriented</p>
              <h3 style={{ fontSize: '1.2rem', marginTop: '10px' }}>Training built around real operational contexts.</h3>
            </Card>
          </Reveal>
          <Reveal delay={0.2}>
            <Card>
              <p className="feature-number">02 — Practical by design</p>
              <h3 style={{ fontSize: '1.2rem', marginTop: '10px' }}>Learn through a structured path from knowledge to practical assessment.</h3>
            </Card>
          </Reveal>
          <Reveal delay={0.3}>
            <Card>
              <p className="feature-number">03 — Built to grow</p>
              <h3 style={{ fontSize: '1.2rem', marginTop: '10px' }}>Develop skills, credentials and a professional pilot profile.</h3>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="section cta-band">
        <Reveal>
          <div className="container">
            <p className="eyebrow">YOUR FUTURE TAKES FLIGHT HERE</p>
            <h2>
              Start with curiosity.<br />
              Build with purpose.
            </h2>
            <p className="muted">
              Your professional drone journey starts with the first step.
            </p>
            <div style={{ marginTop: '30px' }}>
              <Button asChild>
                <a href={platformUrl()}>Start Your Pilot Journey <span aria-hidden="true">↗</span></a>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
