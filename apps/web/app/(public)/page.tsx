import { Badge, Button, Card, FieldVisual, Progress, Reveal } from '@saqr/ui';
import { HeroDroneModel } from '../../components/hero-drone-model';
import { platformUrl } from '../../lib/config';

const trainingSteps = [
  ['01', 'Learn', 'Build a solid understanding of systems, safety and flight principles.'],
  ['02', 'Practice', 'Turn knowledge into reliable operational habits.'],
  ['03', 'Assess', 'Validate your understanding through practical scenarios.'],
  ['04', 'Progress', 'Build credentials and a professional pilot profile.'],
];

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
              SAQR trains professional drone pilots with practical knowledge,
              operational awareness and industry-ready skills.
            </p>
            <div className="hero-actions">
              <Button asChild>
                <a href={platformUrl()}>
                  Start Training <span aria-hidden="true">↗</span>
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href="#programs">
                  Explore Programs <span aria-hidden="true">→</span>
                </a>
              </Button>
            </div>
            <p className="hero-footnote">
              <span className="status-dot" /> Learn. Practice. Assess. Progress.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.2} className="hero-art">
          <HeroDroneModel />
        </Reveal>
      </section>

      <section className="home-intro section container">
        <Reveal>
          <div className="home-intro-copy">
            <p className="eyebrow">A CLEAR PATH TO PROFESSIONAL FLIGHT</p>
            <h2>Learn the essentials. Build the confidence to operate with purpose.</h2>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="home-intro-text muted">
            Our learning experience connects technical knowledge, field context and
            responsible decision-making in one focused journey.
          </p>
        </Reveal>
        <div className="home-principles">
          {[
            ['01', 'Operational foundations', 'Understand the equipment, rules and safety principles behind every mission.'],
            ['02', 'Practical scenarios', 'Learn through workflows inspired by real field operations.'],
            ['03', 'Professional growth', 'Track progress and develop a profile that grows with your skills.'],
          ].map(([number, title, description], index) => (
            <Reveal delay={0.1 + index * 0.1} key={number}>
              <article className="home-principle">
                <p className="feature-number">{number}</p>
                <h3>{title}</h3>
                <p className="muted">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="programs" className="section container">
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">START WITH A REAL APPLICATION</p>
              <h2>Our Training Programs</h2>
            </div>
            <p className="muted">
              Begin with agriculture, where precision, observation and responsible
              operations come together.
            </p>
          </div>
        </Reveal>
        <div className="program-layout">
          <Reveal delay={0.1}>
            <Card className="course-card">
              <FieldVisual compact variant="training-programs" />
              <div className="course-content">
                <Badge>AGRICULTURE · DEMO CURRICULUM</Badge>
                <h2>Agricultural Drone Operations</h2>
                <p className="muted">
                  Learn how professional drones support field inspection, mapping
                  and precision workflows.
                </p>
                <div style={{ marginTop: '28px' }}>
                  <Button asChild>
                    <a href="/agriculture">
                      View program <span aria-hidden="true">↗</span>
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </Reveal>
          <Reveal delay={0.2} className="program-outline">
            <p className="eyebrow">WHAT YOU WILL EXPLORE</p>
            <div className="use-cases">
              <span>Drone systems & safety</span>
              <span>Crop monitoring</span>
              <span>Field mapping</span>
              <span>Multispectral imaging</span>
              <span>Field inspection</span>
              <span>Precision agriculture</span>
            </div>
            <p className="muted program-note">
              A structured starting point for pilots preparing to work with real
              agricultural contexts.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section container training-path-section">
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">HOW THE JOURNEY WORKS</p>
              <h2>From first flight to professional perspective.</h2>
            </div>
          </div>
        </Reveal>
        <div className="journey">
          {trainingSteps.map(([number, title, description], index) => (
            <Reveal delay={0.1 + index * 0.1} className="journey-step" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p className="muted">{description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="agriculture-section">
        <div className="section container split">
          <Reveal>
            <FieldVisual variant="agriculture-feature" />
          </Reveal>
          <Reveal delay={0.2}>
            <p className="eyebrow">AGRICULTURE FIRST</p>
            <h2>See the field differently.</h2>
            <p className="muted">
              Explore how drone operations support informed agricultural decisions
              through observation, mapping and data-led workflows.
            </p>
            <div className="use-cases">
              <span>Crop monitoring</span>
              <span>Field mapping</span>
              <span>Imaging workflows</span>
              <span>Precision agriculture</span>
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

      <section id="platform" className="container section split platform-story">
        <Reveal>
          <p className="eyebrow">THE SAQR PLATFORM</p>
          <h2>Keep every stage of your learning journey in view.</h2>
          <p className="muted">
            Access your courses, track your progress and prepare for your next
            assessment from one focused learning space.
          </p>
          <Button asChild variant="secondary">
            <a href={platformUrl()}>
              Explore the Platform <span aria-hidden="true">↗</span>
            </a>
          </Button>
        </Reveal>
        <Reveal delay={0.2} className="preview">
          <div className="preview-heading">
            <span>SAQR / PILOT OVERVIEW</span>
            <Badge>DEMO PREVIEW</Badge>
          </div>
          <p className="eyebrow">CONTINUE TRAINING</p>
          <h3>Agricultural Drone Operations</h3>
          <p className="muted">Module 2 · Drone Systems & Safety</p>
          <div className="preview-row">
            <span>7 of 20 sample lessons</span>
            <strong>35%</strong>
          </div>
          <Progress value={35} />
          <div className="platform-highlights">
            <span>Courses & progress</span>
            <span>Assessments</span>
            <span>Pilot profile</span>
          </div>
        </Reveal>
      </section>

      <section className="section cta-band">
        <Reveal>
          <div className="container">
            <p className="eyebrow">YOUR FUTURE TAKES FLIGHT HERE</p>
            <h2>
              Start with curiosity.<br />
              Build with purpose.
            </h2>
            <p className="muted">Your professional drone journey starts here.</p>
            <div style={{ marginTop: '30px' }}>
              <Button asChild>
                <a href={platformUrl()}>
                  Start Your Pilot Journey <span aria-hidden="true">↗</span>
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
