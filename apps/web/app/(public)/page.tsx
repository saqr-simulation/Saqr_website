import { sitePath } from '../../lib/site-path';
import { Badge, Button, Card, Progress } from '@saqr/ui';
import {
  AgricultureMission,
  FieldMission,
  MissionCompetencies,
} from '../../components/field-mission';
import { DroneHero } from '../../components/drone-hero';
import { platformUrl } from '../../lib/config';
import { trainingStages } from '../../lib/messaging';
const features = [
  [
    '01 / KNOWLEDGE',
    'Understand the aircraft.',
    'Build a foundation in drone systems, mission planning and responsible operation before taking to the field.',
  ],
  [
    '02 / APPLICATION',
    'Make practice meaningful.',
    'Explore a simulation-led approach to precision flight, terrain awareness and agricultural mission preparation.',
  ],
  [
    '03 / PROGRESSION',
    'See your next milestone.',
    'Connect your learning progress and pilot profile with a clear path toward professional readiness.',
  ],
];
export default function Home() {
  return (
    <>
      <div className="hero-band dark-surface">
        <section className="hero container">
          <div>
            <p className="eyebrow">DRONE SIMULATION / AGRICULTURE FIRST</p>
            <h1>
              Crash here.
              <br />
              <em>Succeed there.</em>
            </h1>
            <p className="hero-description muted">
              Prepare for demanding drone missions before taking a real aircraft
              into the field. SAQR brings structured education and
              simulation-led practice together to build confidence in
              agricultural operations.
            </p>
            <div className="hero-actions">
              <Button asChild>
                <a href={sitePath('/waitlist')}>
                  Join the Pilot Waitlist <span aria-hidden="true">↗</span>
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href={sitePath('/demo')}>
                  Request Institutional Demo <span aria-hidden="true">→</span>
                </a>
              </Button>
            </div>
            <p className="hero-footnote">
              <span className="status-dot" /> AGRICULTURE FIRST. BUILT IN
              MOROCCO.
            </p>
          </div>
          <DroneHero />
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
            <p className="eyebrow">THE CHALLENGE OF DRONE TRAINING</p>
            <h2>
              A first mistake shouldn’t
              <br />
              end a future in flight.
            </h2>
          </div>
          <p className="muted">
            Industrial aircraft demand more than basic flying skills. Learners
            need room to practice without putting equipment, budgets or field
            operations at risk.
          </p>
        </div>
        <div className="grid-3">
          {[
            [
              '01 / EQUIPMENT RISK',
              'Protect the aircraft. Free the learner.',
              'A heavy-lift drone is a significant investment. Virtual practice creates room to learn from mistakes before working with real equipment.',
            ],
            [
              '02 / PRACTICAL EXPERIENCE',
              'Turn knowledge into control skills.',
              'Academic understanding needs hands-on repetition. Simulation-led training helps bridge the gap between knowing how an aircraft works and managing a demanding mission.',
            ],
            [
              '03 / TRAINING CAPACITY',
              'Make more room for practice.',
              'Weather windows, battery charging and shared aircraft limit field time. Virtual exercises can give learners more opportunities to rehearse independently.',
            ],
          ].map(([number, title, text]) => (
            <Card key={number} className="feature-card">
              <p className="feature-number">{number}</p>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR MISSION</p>
            <h2>
              Room to learn.
              <br />
              Confidence to go further.
            </h2>
          </div>
          <p className="muted">
            Learning demanding flight skills starts with the freedom to make
            mistakes. Our vision brings repeatable simulation practice and
            industry-focused education into one learning journey.
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
        <AgricultureMission className="section container split">
          <FieldMission />
          <div>
            <p className="eyebrow">OUR FIRST HORIZON / AGRICULTURE</p>
            <h2>
              From flight lines.
              <br />
              To field insight.
            </h2>
            <p className="muted">
              Agriculture offers a clear purpose for drone skills: planning
              missions, understanding crop health and making precise decisions.
            </p>
            <p className="muted">
              Our first training track introduces these applications. SAQR is a
              training platform; these are learning topics, not services we
              currently operate.
            </p>
            <MissionCompetencies
              items={[
                'Crop monitoring',
                'Field mapping',
                'Multispectral fundamentals',
                'Terrain awareness',
                'Precision agriculture',
                'Spraying concepts',
              ]}
            />
            <a href={sitePath('/agriculture')} className="text-link">
              Explore agriculture training ↗
            </a>
          </div>
        </AgricultureMission>
      </section>
      <section className="section container">
        <p className="eyebrow">HOW SAQR WORKS / FOUR STAGES</p>
        <h2>
          From foundational knowledge
          <br />
          to operational readiness.
        </h2>
        <p className="muted">
          Simulation prepares learners for real flight. The roadmap connects
          theory, repeated practice, supervised field experience and
          professional progression.
        </p>
        <div className="journey">
          {trainingStages.map((step, index) => (
            <div className="journey-step" key={step.title}>
              <span>0{index + 1} /</span>
              <h3>{step.title}</h3>
              <p className="stage-description muted">{step.description}</p>
              <span className="stage-status">{step.status}</span>
            </div>
          ))}
        </div>
        <p className="legal-note">
          Roadmap: full lessons, simulator integration, supervised field
          training and credentials are being developed in phases. SAQR course
          completion certificates will not replace regulatory flight licenses.
        </p>
        <a className="text-link" href={sitePath('/training')}>
          Explore the full training approach →
        </a>
      </section>
      <section className="container section split">
        <div>
          <p className="eyebrow">THE PLATFORM / A FIRST LOOK</p>
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
      <section className="container section">
        <div className="cup-teaser dark-surface">
          <div>
            <p className="eyebrow">SAQR CUP / PLANNED 2026 EDITION</p>
            <h2>
              Practice. Compete.
              <br />
              Grow beyond the simulator.
            </h2>
            <p className="muted">
              A simulation-based challenge designed to discover Morocco’s next
              generation of agricultural drone pilots. Register your interest
              and hear when the official rules are ready.
            </p>
            <p className="muted">
              The launch plan includes student beta participation, a sponsored
              certification opportunity valued at 5,000+ DH and connections with
              agricultural operators. Access, rewards and partners will be
              confirmed with the official rules.
            </p>
          </div>
          <Button asChild>
            <a href={sitePath('/saqr-cup')}>Discover the SAQR Cup ↗</a>
          </Button>
        </div>
      </section>
      <section className="container section institutional-section">
        <div>
          <p className="eyebrow">FOR VOCATIONAL & ENTERPRISE TRAINING</p>
          <h2>
            Build a flight laboratory
            <br />
            around your learners.
          </h2>
          <p className="muted">
            For CMCs, ITSAs, agricultural universities and commercial operators,
            SAQR’s institutional vision brings repeatable simulator practice
            into existing computer labs. Explore curriculum alignment, classroom
            capacity and instructor evaluation tools with the team.
          </p>
          <Button asChild variant="secondary">
            <a href={sitePath('/demo')}>Request an Institutional Demo →</a>
          </Button>
        </div>
        <div className="institutional-details">
          <p>
            <strong>Practice independently</strong>
            <span>
              Plan for more learners to rehearse without sharing one aircraft.
            </span>
          </p>
          <p>
            <strong>Prepare for local missions</strong>
            <span>
              Connect flight scenarios with agricultural terrain and operating
              contexts.
            </span>
          </p>
          <p>
            <strong>Follow learner progression</strong>
            <span>
              Instructor monitoring and telemetry are part of the development
              roadmap.
            </span>
          </p>
        </div>
      </section>
      <section className="container section audience-ctas">
        <Card>
          <p className="eyebrow">FOR ASPIRING PILOTS</p>
          <h2>Your journey starts here.</h2>
          <p className="muted">
            Tell us what you want to learn and the setup you use. Join the early
            access community as the simulator takes shape.
          </p>
          <Button asChild>
            <a href={sitePath('/waitlist')}>Join the Pilot Waitlist ↗</a>
          </Button>
        </Card>
        <Card>
          <p className="eyebrow">FOR INSTITUTIONS & OPERATORS</p>
          <h2>Build your next training chapter.</h2>
          <p className="muted">
            Explore simulation-led education for your learners. Share your
            objectives and start a conversation about institutional evaluation.
          </p>
          <Button asChild variant="secondary">
            <a href={sitePath('/demo')}>Request an Institutional Demo →</a>
          </Button>
        </Card>
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
            For aspiring pilots, educators and agricultural operators ready to
            explore a new perspective.
          </p>
          <Button asChild>
            <a href={sitePath('/waitlist')}>Start Your Pilot Journey ↗</a>
          </Button>
        </div>
      </section>
    </>
  );
}
