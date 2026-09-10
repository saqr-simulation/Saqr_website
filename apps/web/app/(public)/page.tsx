import { Badge, Button, Card, FieldVisual, Progress } from '@saqr/ui';
import { platformUrl } from '../../lib/config';
const features = [
  [
    '01 / KNOWLEDGE',
    'Learn with direction.',
    'A structured curriculum that connects foundational knowledge with professional operating contexts.',
  ],
  [
    '02 / APPLICATION',
    'Give skills a purpose.',
    'Explore how drone operations can support better decisions in the field, starting with agriculture.',
  ],
  [
    '03 / PROGRESSION',
    'Build your pilot identity.',
    'A learning journey designed around competencies, progress and your future professional profile.',
  ],
];
export default function Home() {
  return (
    <>
      <div className="hero-band dark-surface">
        <section className="hero container">
          <div>
            <p className="eyebrow">THE NEXT GENERATION OF DRONE PILOTS</p>
            <h1>
              Train for the future of <em>professional drone operations.</em>
            </h1>
            <p className="hero-description muted">
              SAQR trains the next generation of professional drone pilots,
              starting with agriculture.
            </p>
            <div className="hero-actions">
              <Button asChild>
                <a href={platformUrl()}>
                  Start Training <span aria-hidden="true">↗</span>
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href="/about">
                  Discover SAQR <span aria-hidden="true">→</span>
                </a>
              </Button>
            </div>
            <p className="hero-footnote">
              <span className="status-dot" /> AGRICULTURE FIRST. BUILT FOR
              WHAT’S NEXT.
            </p>
          </div>
          <div className="hero-art">
            <FieldVisual />
            <div className="hero-art-caption">
              <div>
                <strong>A different view of agriculture.</strong>
                <p className="muted">The first SAQR specialization</p>
              </div>
              <span className="text-saqr text-2xl" aria-hidden="true">
                ↗
              </span>
            </div>
          </div>
        </section>
      </div>
      <div className="container strip">
        <span>
          BUILT AROUND <strong>REAL-WORLD PURPOSE</strong>
        </span>
        <span>01 / Professional education</span>
        <span>02 / Practical competencies</span>
        <span>03 / Industry applications</span>
      </div>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR MISSION</p>
            <h2>
              More than flying.
              <br />A foundation for your future.
            </h2>
          </div>
          <p className="muted">
            We’re connecting professional drone education, structured learning
            and technology with the industries that need them.
          </p>
        </div>
        <div className="grid-3">
          {features.map(([number, title, description]) => (
            <Card key={number} className="feature-card">
              <p className="feature-number">{number}</p>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="agriculture-section">
        <div className="section container split">
          <FieldVisual />
          <div>
            <p className="eyebrow">OUR FIRST HORIZON / AGRICULTURE</p>
            <h2>
              Better perspective.
              <br />
              Smarter possibilities.
            </h2>
            <p className="muted">
              Agriculture offers a clear purpose for drone skills: understanding
              land, observing crops and supporting precision decisions.
            </p>
            <p className="muted">
              Our first training track introduces these applications. SAQR is a
              training platform; these are learning topics, not services we
              currently operate.
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
            <a href="/agriculture" className="text-link">
              Explore agriculture training ↗
            </a>
          </div>
        </div>
      </section>
      <section className="section container">
        <p className="eyebrow">YOUR TRAINING JOURNEY</p>
        <h2>A clear path. A higher standard.</h2>
        <p className="muted">
          The journey we’re building, one milestone at a time.
        </p>
        <div className="journey">
          {[
            'Learn',
            'Practice',
            'Assess',
            'Certify',
            'Build your Pilot Profile',
          ].map((step, index) => (
            <div className="journey-step" key={step}>
              <span>0{index + 1} /</span>
              <h3>{step}</h3>
            </div>
          ))}
        </div>
        <p className="legal-note">
          Learning activities, assessments and SAQR course completion
          certificates are planned for the next phases. Certificates will not
          replace regulatory licenses.
        </p>
      </section>
      <section className="container section split">
        <div>
          <p className="eyebrow">YOUR LEARNING FLIGHT DECK</p>
          <h2>
            One place to see
            <br />
            how far you can go.
          </h2>
          <p className="muted">
            Explore courses, follow your learning progress and build your pilot
            profile. AI learning support and certification are on the roadmap.
          </p>
          <Button asChild variant="secondary">
            <a href={platformUrl()}>Explore the platform ↗</a>
          </Button>
        </div>
        <div className="preview dark-surface">
          <div className="flex justify-between items-center mb-7">
            <span className="text-sm">SAQR / PILOT OVERVIEW</span>
            <Badge>DEMO PREVIEW</Badge>
          </div>
          <p className="eyebrow">CONTINUE TRAINING</p>
          <h3>Agricultural Drone Operations</h3>
          <p className="muted text-sm">Module 2 · Drone Systems & Safety</p>
          <div className="preview-row">
            <span>7 of 20 sample lessons</span>
            <strong>35%</strong>
          </div>
          <Progress value={35} />
          <div className="grid-2 mt-7">
            <Card>
              <p className="text-sm">SAQR AI</p>
              <span className="muted text-xs">Learning support · planned</span>
            </Card>
            <Card>
              <p className="text-sm">Pilot Profile</p>
              <span className="muted text-xs">Your professional journey</span>
            </Card>
          </div>
        </div>
      </section>
      <section id="why-saqr" className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHY SAQR</p>
            <h2>
              Designed for pilots.
              <br />
              Connected to industry.
            </h2>
          </div>
          <p className="muted">
            A focused beginning in agriculture, with room to grow into new
            professional specializations.
          </p>
        </div>
        <div className="grid-3">
          {[
            [
              'Industry-oriented',
              'Learn with agricultural operating contexts in mind.',
            ],
            [
              'Structured by design',
              'Move through a clear sequence of knowledge and competencies.',
            ],
            [
              'Built to grow',
              'A foundation for AI-assisted learning, credentials and future tracks.',
            ],
          ].map(([title, text]) => (
            <Card key={title}>
              <h3>{title}</h3>
              <p className="muted text-sm">{text}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="section cta-band dark-surface">
        <div className="container">
          <p className="eyebrow">YOUR FUTURE TAKES FLIGHT HERE</p>
          <h2>
            Start with curiosity.
            <br />
            Build with purpose.
          </h2>
          <p className="muted">
            Your professional drone journey starts with the first step.
          </p>
          <Button asChild>
            <a href={platformUrl()}>Start Your Pilot Journey ↗</a>
          </Button>
        </div>
      </section>
    </>
  );
}
