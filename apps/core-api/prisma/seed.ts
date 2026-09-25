import 'dotenv/config';
import {
  PrismaClient,
  Role,
  CourseStatus,
  LessonType,
  QuestionType,
  DocumentStatus,
} from '@prisma/client';
import { demoCourse, demoProgress, demoUsers } from '@saqr/types';

const prisma = new PrismaClient();

interface LessonSeed {
  title: string;
  type: LessonType;
  content: string;
}

interface ModuleSeed {
  title: string;
  lessons: LessonSeed[];
}

const curriculum: ModuleSeed[] = [
  {
    title: 'Introduction to Agricultural Drones',
    lessons: [
      {
        title: 'The agricultural mission',
        type: LessonType.TEXT,
        content: `### 1. The Modern Agricultural Mission
Precision agriculture leverages unmanned aerial vehicles (UAVs) to transform farm management. By replacing coarse assumptions with high-resolution aerial observations, remote pilots enable targeted resource allocation.

#### Key Objectives:
- **Canopy Health Monitoring**: Rapid detection of moisture stress, nutrient deficiencies, and pest infestations.
- **Yield Optimization**: Measuring vegetative vigor across varied soil parcels to predict crop output.
- **Input Minimization**: Slashing water, herbicide, and fertilizer usage through ultra-localized spot spraying.
- **Environmental Stewardship**: Preventing runoff into local water tables and mitigating chemical drift.

#### The Flight-to-Action Cycle:
1. **Pre-flight Planning**: Boundary definition, safety buffers, and GSD calibration.
2. **Aerial Acquisition**: Automated grid flight capturing calibrated multispectral bands.
3. **Photogrammetric Processing**: Orthomosaic generation, radiometric calibration, and vegetation index (NDVI/NDRE) calculations.
4. **Prescription Delivery**: Direct export of variable-rate prescription maps to agricultural machinery (ISOBUS).`,
      },
      {
        title: 'Aircraft and payloads',
        type: LessonType.VIDEO,
        content: `### 2. Airframe Classifications and Sensor Payloads
Selecting the correct platform and sensor determines operational feasibility and data fidelity.

#### Airframe Configurations:
- **Multirotor (Quadcopter/Hexacopter)**:
  - *Pros*: Vertical takeoff and landing (VTOL), hover precision, ideal for sub-hectare spot-checks and heavy liquid payloads.
  - *Cons*: Limited flight duration (20–40 minutes), smaller area coverage per battery cycle.
- **Fixed-Wing & VTOL Hybrid**:
  - *Pros*: Superior aerodynamic efficiency, expansive coverage (hundreds of hectares per sortie).
  - *Cons*: Higher landing footprint, susceptibility to crosswinds during final approach.

#### Agricultural Sensor Suite:
- **High-Resolution RGB Cameras**: Used for plant population counting, structural digital elevation models (DEM), and boundary surveying.
- **Narrowband Multispectral Arrays**: Capturing discrete bands (Green 560nm, Red 660nm, RedEdge 730nm, Near-Infrared 840nm).
- **Thermal Radiometric Imagers**: Detecting canopy temperature variances indicating transpiration shutdown and drought stress.
- **Ultra-Low Volume (ULV) Spray Systems**: High-torque peristaltic pumps and atomizing centrifugal nozzles for crop treatment.`,
      },
      {
        title: 'Understanding a field',
        type: LessonType.TEXT,
        content: `### 3. Field Assessment and Agronomic Topography
No aerial mission begins in the air. A thorough agronomic and topographic site evaluation protects equipment and ensures mission success.

#### Environmental Topography Analysis:
- **Slope and Elevation Changes**: Flying over hilly orchards requires terrain-following radar or Digital Surface Model (DSM) pre-loading to maintain a consistent Ground Sampling Distance (GSD).
- **Physical Obstacles**: Power transmission lines, pivot irrigation structures, windbreaks, and avian nesting zones.
- **Ground Crew Stationing**: Positioning the Remote Pilot in Command (RPIC) and Visual Observer (VO) with unobstructed Visual Line of Sight (VLOS).

#### Agronomic Zones:
- Delineating management zones according to soil texture (clay, silt, sand) and drainage patterns.
- Establishing geo-referenced ground control points (GCPs) on permanent farm landmarks.`,
      },
      {
        title: 'Your operating environment',
        type: LessonType.RESOURCE,
        content: `### 4. Airspace Regulations and Environmental Constraints
Operating unmanned aircraft over agrarian property requires strict compliance with civil aviation mandates and meteorological safety limits.

#### Regulatory Framework:
- **Maximum Ceiling**: 120 meters (400 ft) Above Ground Level (AGL) unless explicit airspace waiver is granted.
- **Safety Buffers**: 30m minimum standoff from uninvolved bystanders, livestock enclosures, and public highways.
- **NOTAM Auditing**: Reviewing Notices to Air Missions for military training routes, low-flying agricultural crop dusters, and fire-fighting operations.

#### Meteorological Operating Minimums:
- **Maximum Sustained Wind**: Multi-rotors ≤ 10 m/s; Fixed-wing ≤ 12 m/s.
- **Precipitation**: Absolute zero tolerance for rain or heavy mist on non-IP rated avionics.
- **Solar Window**: Radiometric imagery should be gathered during high sun elevation (solar noon ± 2.5 hours) to reduce shadow occlusion.`,
      },
    ],
  },
  {
    title: 'Drone Systems & Safety',
    lessons: [
      {
        title: 'Aircraft systems',
        type: LessonType.TEXT,
        content: `### 1. Drone Avionics, Propulsion, and Link Architecture
Understanding core subsystem interactions enables the pilot to diagnose anomalies before catastrophic failure.

#### Powertrain Subsystems:
- **Lithium-Polymer (LiPo) & Li-Ion Batteries**: High energy density chemistry requiring cell balancing, temperature management, and strict storage voltage protocols.
- **Electronic Speed Controllers (ESCs)**: Rapid microprocessor-controlled switching delivering 3-phase AC power to brushless motors.
- **High-Lift Props**: Carbon-fiber reinforced blades balanced dynamically for low vibration and acoustic efficiency.

#### Avionics and GNSS:
- **Flight Controller & Inertial Measurement Unit (IMU)**: Redundant tri-axial accelerometers and gyroscopes calculating state vectors at 1000Hz.
- **RTK/PPK GNSS Modules**: Multi-frequency GPS, GLONASS, Galileo, and BeiDou receivers delivering 1–2 cm positioning accuracy when synced with a base station.`,
      },
      {
        title: 'Risk assessment',
        type: LessonType.RESOURCE,
        content: `### 2. SORA Risk Matrix and Pre-Mission Analysis
A structured Specific Operations Risk Assessment (SORA) prevents catastrophic operational events.

#### Quantitative Risk Matrix:
| Hazard | Probability | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Control Link Loss** | Medium | High | Dual-frequency 2.4/5.8GHz telemetry + automated RTH on failsafe |
| **Mid-Air Collision** | Low | Critical | Dedicated Visual Observer (VO) + ADS-B In receiver enabled |
| **Propeller Delamination** | Low | High | Preflight tactile inspection and hour-based replacement cycle |
| **Spray Drift to Buffer** | Medium | Medium | Maintain low flight altitude (<3m), coarse droplet nozzle calibration |

#### Operational Check-Items:
- Verify geo-fence barriers are active around power lines and adjacent farms.
- Confirm Return-To-Home altitude is set above the tallest obstacle (+15m clearance).`,
      },
      {
        title: 'Preflight checks',
        type: LessonType.VIDEO,
        content: `### 3. Step-by-Step Airframe and System Verification
The standard physical and software preflight flow must be executed systematically prior to arming the motors.

#### 1. Airframe Inspection:
- Check motor arms for hairline fractures or loose folding clamps.
- Inspect motors for bearing play, sand ingress, and magnetic detent resistance.
- Ensure propellers are firmly locked and leading edges have zero nicks or chips.

#### 2. Electrical & Payload:
- Battery seated with dual locking mechanisms; cell delta voltage < 0.03V.
- Lens cleaned with optical microfiber; gimbal pitch/roll motion completely unhindered.
- Spraying booms purged of air bubbles; pressure nozzles calibrated.

#### 3. Avionics Handshake:
- Compass magnetic declination verified; satellite lock count ≥ 14 with RTK FIX state.
- Telemetry signal strength (RSSI) confirmed at 100%.`,
      },
      {
        title: 'Emergency planning',
        type: LessonType.TEXT,
        content: `### 4. Emergency Procedures and Incident Mitigation
When unexpected conditions manifest, rehearsed emergency protocols safeguard human life and air assets.

#### Critical Emergency Protocols:
- **Motor Loss (Quadcopter vs Hexacopter)**: Quadcopters must initiate immediate ballistic descent throttle cut to preserve payload; Hexacopters/Octocopters maintain attitude using degraded propulsion algorithms for controlled touchdown.
- **Flyaway / Uncontrolled Drift**: Instantly toggle from autonomous GPS/Mission mode to Manual/Attitude mode. If unrecoverable, trigger manual Motor Kill over unpopulated field zone.
- **LiPo Thermal Runaway**: Land immediately. Maintain 15-meter standoff. Extinguish only with Class D fire extinguisher or dry sand; never apply water to burning lithium.`,
      },
    ],
  },
  {
    title: 'Mission & Flight Preparation',
    lessons: [
      {
        title: 'Defining objectives',
        type: LessonType.TEXT,
        content: `### 1. Mission Specification and Ground Sampling Distance (GSD)
Establishing exact data deliverables governs flight parameters such as flight speed, altitude, and sensor exposure.

#### Deliverable Requirements:
- **Stand Counting**: Requires sub-centimeter GSD (0.5 – 1.0 cm/px) to isolate individual emergent seedlings.
- **General Canopy Health (NDVI)**: Standard 2.5 – 5.0 cm/px GSD provides sufficient resolution for prescription fertilization.
- **Topographic Drainage Modeling**: High-overlap RGB surveys accompanied by surveyed Ground Control Points (GCPs).

#### GSD Calculation Formula:
$$\\text{GSD} = \\frac{\\text{Sensor Width (mm)} \\times \\text{Flight Altitude (m)} \\times 100}{\\text{Focal Length (mm)} \\times \\text{Image Width (px)}}$$`,
      },
      {
        title: 'Planning a route',
        type: LessonType.VIDEO,
        content: `### 2. Autonomous Waypoint Path Generation
Designing the autonomous grid path optimizes battery economy while guaranteeing sufficient overlap for photogrammetry.

#### Mission Parameters:
- **Frontal Overlap (Along-Track)**: Minimum 75% for uniform vegetation (wheat, alfalfa, corn) to prevent stitching artifacts.
- **Side Overlap (Cross-Track)**: Minimum 70% to ensure contiguous tie-point correlation across flight lines.
- **Flight Line Alignment**: Orient flight lines parallel to the longest field boundary or dominant wind vector to minimize battery-draining turns.
- **Turnaround Margins**: Extend flight lines 15–20 meters beyond parcel boundaries so the aircraft decelerates, banks, and accelerates outside the data capture area.`,
      },
      {
        title: 'Weather considerations',
        type: LessonType.TEXT,
        content: `### 3. Atmospheric Dynamics and Agronomic Timing
Weather conditions dictate both flight safety and the photometric accuracy of radiometric data.

#### Key Atmospheric Factors:
- **Illumination Uniformity**: Clear skies or consistent high overcast are acceptable. Patchy cumulus clouds cast variable shadows, introducing severe radiometric errors.
- **Ambient Temperature & Battery Capacity**: Extreme heat (>35°C) degrades battery discharge rates and risks flight controller thermal throttling.
- **Wind Velocity and Gust Factors**: High winds cause rapid drone tilt angles, producing extreme image obliqueness and reduced overlap.
- **Relative Humidity & Dew Point**: High morning humidity causes lens fogging upon ascent into cooler air layers.`,
      },
      {
        title: 'Crew briefing',
        type: LessonType.RESOURCE,
        content: `### 4. Crew Resource Management (CRM) for Drone Operations
Clear communication and well-defined roles ensure smooth coordination between team members.

#### Crew Roles & Responsibilities:
- **Remote Pilot in Command (RPIC)**: Holds final authority over flight initiation, course continuation, and emergency execution.
- **Visual Observer (VO)**: Maintains continuous unassisted visual contact with the UAV and monitors airspace for intruders.
- **Field Agronomist / Ground Tech**: Manages RTK base station, battery charging cycles, sensor calibration targets, and chemical mixing.

#### Standard Briefing Script:
1. State mission objectives, planned altitude, and total sortie duration.
2. Designate primary launch/recovery zone and secondary emergency ditch zone.
3. Review abort criteria: low battery alarm, airspace incursion, or telemetry link loss.`,
      },
    ],
  },
  {
    title: 'Agricultural Drone Applications',
    lessons: [
      {
        title: 'Crop monitoring',
        type: LessonType.VIDEO,
        content: `### 1. Vegetation Indices and Early Stress Detection
Translating raw sensor photons into actionable agronomic insights requires spectral index computation.

#### Common Vegetation Indices:
- **NDVI (Normalized Difference Vegetation Index)**:
  $$\\text{NDVI} = \\frac{\\text{NIR} - \\text{Red}}{\\text{NIR} + \\text{Red}}$$
  - Values between 0.6 and 0.9 indicate vigorous, photosynthetic biomass.
  - Values below 0.2 denote bare soil, rock, or dead vegetation.
- **NDRE (Normalized Difference Red Edge)**:
  $$\\text{NDRE} = \\frac{\\text{NIR} - \\text{RedEdge}}{\\text{NIR} + \\text{RedEdge}}$$
  - Ideal for dense, mature canopies where traditional NDVI saturates. Sensitive to nitrogen content and chlorophyll levels.`,
      },
      {
        title: 'Mapping fundamentals',
        type: LessonType.TEXT,
        content: `### 2. Principles of Aerial Photogrammetry
Photogrammetry reconstructs accurate 3D geometry from overlapping 2D aerial photographs.

#### The Processing Pipeline:
1. **Feature Identification & Tie Points**: Computer vision algorithms identify common textural features across multiple images.
2. **Bundle Adjustment**: Minimizing reprojection errors to determine exact camera spatial positions and lens distortions.
3. **Dense Point Cloud Generation**: Generating millions of geo-referenced 3D coordinates.
4. **Digital Elevation Model (DEM) & Orthomosaic**: Projecting rectified pixels onto the digital surface model to create a distortion-free map.`,
      },
      {
        title: 'Multispectral imaging',
        type: LessonType.TEXT,
        content: `### 3. Radiometric Calibration and Spectral Bands
Reliable multi-temporal crop comparisons require radiometric normalization across seasonal flights.

#### Spectral Bands and Agronomic Relevance:
- **Blue (475 nm)**: Atmospheric scattering reference; chlorophyll absorption.
- **Green (560 nm)**: Reflectance peak in healthy plants; useful for plant vigor estimation.
- **Red (668 nm)**: Maximum chlorophyll absorption; primary band for baseline biomass calculations.
- **Red Edge (717 nm)**: Narrow transition band; highly sensitive to early chlorophyll changes before visible symptoms appear.
- **Near-Infrared / NIR (842 nm)**: High reflectance by healthy spongy mesophyll leaf cells.

#### Calibration Targets:
- Capturing calibrated reflectance panels on the ground before and after flight.
- Downwelling Light Sensors (DLS) recording real-time solar irradiance variations.`,
      },
      {
        title: 'Spraying concepts',
        type: LessonType.RESOURCE,
        content: `### 4. Precision Aerial Application and Drift Control
Agricultural spray drones deliver liquid pesticides, fungicides, and micronutrients with millimetric precision.

#### Spray Dynamics:
- **Propeller Downwash Aerodynamics**: Rotor wash drives atomized droplets deep into the under-canopy and reverse side of foliage.
- **Droplet Spectrum (VMD)**: Fine droplets (<150 microns) provide excellent leaf coverage but suffer high wind drift; coarse droplets (>300 microns) minimize drift but risk runoff.
- **Flow Rate Control**: Automatic synchronization between ground speed and peristaltic pump delivery rates ensures constant application volume per hectare (L/ha).`,
      },
    ],
  },
  {
    title: 'Assessment',
    lessons: [
      {
        title: 'Knowledge review',
        type: LessonType.TEXT,
        content: `### 1. Comprehensive Curriculum Synthesis
Reviewing the interconnected pillars of professional agricultural UAV operations:

1. **Airframe & Maintenance**: Motors, ESCs, props, and safe LiPo storage.
2. **Aviation Safety**: SORA risk management, failsafe protocols, and emergency procedures.
3. **Photogrammetry & Flight Planning**: High overlap grids, terrain-following, and ground control points.
4. **Agronomic Data Analytics**: NDVI, NDRE, radiometric calibration, and variable-rate prescription export.`,
      },
      {
        title: 'Mission scenario',
        type: LessonType.TEXT,
        content: `### 2. Operational Case Study: 50-Hectare Olive Orchard
Simulated practical scenario demonstrating real-world mission execution in the Meknès-Fès agricultural basin.

#### Mission Profile:
- **Objective**: Identify early verticillium wilt stress and optimize drip irrigation schedules.
- **Area**: 50 hectares, moderate terrain slope (8%), olive trees spaced 7x7m.
- **Equipment**: Hexacopter equipped with 5-band multispectral sensor + RTK base station.
- **Flight Execution**: 90m AGL, 80% front / 75% side overlap, total flight time: 3 sorties of 18 minutes each.
- **Deliverables**: Calibrated NDRE raster map, elevation drainage contours, and shapefiles for localized soil treatment.`,
      },
      {
        title: 'Safety review',
        type: LessonType.VIDEO,
        content: `### 3. Incident Case Studies and Human Factors
Analyzing real-world drone incidents reinforces preventative safety culture.

#### Primary Incident Drivers:
- **Complacency in Routine Flights**: Omitting tactile propeller checks leading to mid-flight motor dislodgement.
- **Sudden Micro-Weather Shifts**: Localized thermal downdrafts near harvest fields causing sudden loss of altitude.
- **Crew Communication Breakdowns**: Failure of the visual observer to announce low-flying manned traffic immediately.`,
      },
      {
        title: 'Readiness reflection',
        type: LessonType.TEXT,
        content: `### 4. Final Pilot Readiness & Ethical Code
Congratulations on completing the agricultural drone ground school foundation.

#### The Professional Drone Pilot Creed:
- Always prioritize safety of uninvolved persons and manned aviation above mission completion.
- Respect environmental integrity and adhere strictly to legal chemical application rates.
- Maintain meticulous flight logbooks, battery cycles, and maintenance records.
- Strive for continuous learning in precision agriculture and drone automation technologies.`,
      },
    ],
  },
];

async function seed() {
  console.log('--- Starting SAQR MVP Database Seed ---');

  await prisma.$transaction(async (tx) => {
    // 1. Seed Demo Users
    console.log('Seeding demo users across roles...');
    const users = [
      {
        id: demoUsers.traineeStudent.id,
        email: demoUsers.traineeStudent.email,
        name: demoUsers.traineeStudent.name,
        role: Role.STUDENT,
      },
      {
        id: demoUsers.graduateStudent.id,
        email: demoUsers.graduateStudent.email,
        name: demoUsers.graduateStudent.name,
        role: Role.STUDENT,
      },
      {
        id: demoUsers.newStudent.id,
        email: demoUsers.newStudent.email,
        name: demoUsers.newStudent.name,
        role: Role.STUDENT,
      },
      {
        id: demoUsers.instructor.id,
        email: demoUsers.instructor.email,
        name: demoUsers.instructor.name,
        role: Role.INSTRUCTOR,
      },
      {
        id: demoUsers.admin.id,
        email: demoUsers.admin.email,
        name: demoUsers.admin.name,
        role: Role.ADMIN,
      },
    ];

    for (const u of users) {
      await tx.user.upsert({
        where: { id: u.id },
        update: { email: u.email, name: u.name, role: u.role },
        create: u,
      });
    }

    // 2. Seed Primary Agricultural Course
    console.log('Seeding course: Agricultural Drone Operations...');
    const course = await tx.course.upsert({
      where: { slug: demoCourse.id },
      update: {
        title: demoCourse.title,
        description: demoCourse.description,
        status: CourseStatus.PUBLISHED,
      },
      create: {
        id: demoCourse.id,
        slug: demoCourse.id,
        title: demoCourse.title,
        description: demoCourse.description,
        status: CourseStatus.PUBLISHED,
      },
    });

    // 3. Seed Modules and Lessons
    console.log('Seeding 5 modules and 20 detailed lessons...');
    const allLessonIds: string[] = [];

    for (const [moduleIdx, mod] of curriculum.entries()) {
      const position = moduleIdx + 1;
      const moduleId = `agriculture-module-${position}`;

      await tx.module.upsert({
        where: { id: moduleId },
        update: {
          title: mod.title,
          position,
          courseId: course.id,
        },
        create: {
          id: moduleId,
          courseId: course.id,
          title: mod.title,
          position,
        },
      });

      for (const [lessonIdx, lessonData] of mod.lessons.entries()) {
        const lessonNumber = moduleIdx * 4 + lessonIdx + 1;
        const lessonId = `agriculture-lesson-${lessonNumber}`;
        allLessonIds.push(lessonId);

        await tx.lesson.upsert({
          where: { id: lessonId },
          update: {
            title: lessonData.title,
            type: lessonData.type,
            content: lessonData.content,
            position: lessonIdx + 1,
            moduleId,
          },
          create: {
            id: lessonId,
            moduleId,
            title: lessonData.title,
            type: lessonData.type,
            content: lessonData.content,
            position: lessonIdx + 1,
          },
        });
      }
    }

    // 4. Seed Enrollments
    console.log('Seeding student enrollments...');
    // Trainee Student Enrollment (35% completion demo)
    const traineeEnrollment = await tx.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: demoUsers.traineeStudent.id,
          courseId: course.id,
        },
      },
      update: {
        completedAt: null,
      },
      create: {
        id: 'demo-enrollment',
        userId: demoUsers.traineeStudent.id,
        courseId: course.id,
        enrolledAt: new Date('2026-01-10T09:00:00Z'),
        completedAt: null,
      },
    });

    // Graduate Student Enrollment (100% completion)
    const graduateEnrollment = await tx.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: demoUsers.graduateStudent.id,
          courseId: course.id,
        },
      },
      update: {
        completedAt: new Date('2026-02-15T16:00:00Z'),
      },
      create: {
        id: 'graduate-enrollment',
        userId: demoUsers.graduateStudent.id,
        courseId: course.id,
        enrolledAt: new Date('2026-01-05T08:00:00Z'),
        completedAt: new Date('2026-02-15T16:00:00Z'),
      },
    });

    // New Student Enrollment (0% completion)
    await tx.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: demoUsers.newStudent.id,
          courseId: course.id,
        },
      },
      update: {
        completedAt: null,
      },
      create: {
        id: 'new-enrollment',
        userId: demoUsers.newStudent.id,
        courseId: course.id,
        enrolledAt: new Date('2026-03-01T10:00:00Z'),
        completedAt: null,
      },
    });

    // 5. Seed Representative Progress Data
    console.log('Seeding representative progress data...');
    // Trainee student: exactly 7 completed lessons (matching demoProgress: 35%)
    for (let i = 0; i < demoProgress.completedLessons; i++) {
      const lessonId = allLessonIds[i]!;
      const completedDate = new Date(
        Date.parse('2026-01-12T10:00:00Z') + i * 86400000 * 2,
      );

      await tx.lessonProgress.upsert({
        where: {
          enrollmentId_lessonId: {
            enrollmentId: traineeEnrollment.id,
            lessonId,
          },
        },
        update: { completedAt: completedDate },
        create: {
          enrollmentId: traineeEnrollment.id,
          lessonId,
          completedAt: completedDate,
        },
      });
    }

    // Graduate student: all 20 lessons completed
    for (let i = 0; i < allLessonIds.length; i++) {
      const lessonId = allLessonIds[i]!;
      const completedDate = new Date(
        Date.parse('2026-01-06T10:00:00Z') + i * 86400000 * 1.5,
      );

      await tx.lessonProgress.upsert({
        where: {
          enrollmentId_lessonId: {
            enrollmentId: graduateEnrollment.id,
            lessonId,
          },
        },
        update: { completedAt: completedDate },
        create: {
          enrollmentId: graduateEnrollment.id,
          lessonId,
          completedAt: completedDate,
        },
      });
    }

    // 6. Seed Quizzes & Questions
    console.log('Seeding quizzes and assessment questions...');
    // Module 2 Safety Quiz
    const safetyQuiz = await tx.quiz.upsert({
      where: { id: 'agriculture-safety-quiz' },
      update: {
        title: 'Drone Systems & Safety Assessment',
        passScore: 70,
        moduleId: 'agriculture-module-2',
      },
      create: {
        id: 'agriculture-safety-quiz',
        moduleId: 'agriculture-module-2',
        title: 'Drone Systems & Safety Assessment',
        passScore: 70,
      },
    });

    const safetyQuestions = [
      {
        id: 'agriculture-safety-question-1',
        prompt: 'What procedure is mandatory prior to arming motors for an agricultural mission?',
        options: [
          'A documented physical and avionics preflight check',
          'Bypassing the weather check to save daylight',
          'Launching immediately without checking Return-To-Home settings',
          'Setting battery failsafe threshold to 0%',
        ],
        answerIndex: 0,
        position: 1,
      },
      {
        id: 'agriculture-safety-question-2',
        prompt: 'What is the recommended minimum battery reserve when calculating mission Return-to-Home (RTH)?',
        options: ['5%', '10%', '20% to 25%', '0% (fly until forced landing)'],
        answerIndex: 2,
        position: 2,
      },
      {
        id: 'agriculture-safety-question-3',
        prompt: 'What is the standard maximum legal ceiling (AGL) for commercial drone flights without a special waiver?',
        options: [
          '50 meters (164 ft)',
          '120 meters (400 ft)',
          '300 meters (1000 ft)',
          'Unlimited in agricultural zones',
        ],
        answerIndex: 1,
        position: 3,
      },
    ];

    for (const q of safetyQuestions) {
      await tx.question.upsert({
        where: { id: q.id },
        update: {
          prompt: q.prompt,
          options: q.options,
          answerIndex: q.answerIndex,
          position: q.position,
          quizId: safetyQuiz.id,
        },
        create: {
          id: q.id,
          quizId: safetyQuiz.id,
          prompt: q.prompt,
          type: QuestionType.SINGLE_CHOICE,
          options: q.options,
          answerIndex: q.answerIndex,
          position: q.position,
        },
      });
    }

    // Module 5 Final Readiness Quiz
    const finalQuiz = await tx.quiz.upsert({
      where: { id: 'agriculture-final-quiz' },
      update: {
        title: 'Agricultural Drone Operations Final Readiness Quiz',
        passScore: 75,
        moduleId: 'agriculture-module-5',
      },
      create: {
        id: 'agriculture-final-quiz',
        moduleId: 'agriculture-module-5',
        title: 'Agricultural Drone Operations Final Readiness Quiz',
        passScore: 75,
      },
    });

    const finalQuestions = [
      {
        id: 'agriculture-final-question-1',
        prompt: 'Which spectral band combination is primarily used to calculate NDVI (Normalized Difference Vegetation Index)?',
        options: [
          'Red and Near-Infrared (NIR)',
          'Blue and Green',
          'Thermal Infrared and RedEdge',
          'Ultraviolet and Visible Green',
        ],
        answerIndex: 0,
        position: 1,
      },
      {
        id: 'agriculture-final-question-2',
        prompt: 'Why is solar noon (± 2.5 hours) preferred for agricultural photogrammetry and multispectral flights?',
        options: [
          'Drone motors run cooler at midday',
          'To minimize long shadows that distort radiometric vegetative analysis',
          'Airspace regulations only permit flights at midday',
          'GPS satellites are only visible around noon',
        ],
        answerIndex: 1,
        position: 2,
      },
      {
        id: 'agriculture-final-question-3',
        prompt: 'What role does rotor downwash play in agricultural spray drone operations?',
        options: [
          'It disperses spray droplets randomly into the upper atmosphere',
          'It forces atomized spray droplets downward into the inner crop canopy',
          'It cools the liquid chemical reservoir',
          'It has no effect on droplet dispersion',
        ],
        answerIndex: 1,
        position: 3,
      },
    ];

    for (const q of finalQuestions) {
      await tx.question.upsert({
        where: { id: q.id },
        update: {
          prompt: q.prompt,
          options: q.options,
          answerIndex: q.answerIndex,
          position: q.position,
          quizId: finalQuiz.id,
        },
        create: {
          id: q.id,
          quizId: finalQuiz.id,
          prompt: q.prompt,
          type: QuestionType.SINGLE_CHOICE,
          options: q.options,
          answerIndex: q.answerIndex,
          position: q.position,
        },
      });
    }

    // 7. Seed Quiz Attempts
    console.log('Seeding quiz attempts...');
    // Graduate passed safety quiz
    await tx.quizAttempt.upsert({
      where: { id: 'attempt-graduate-safety' },
      update: { score: 100 },
      create: {
        id: 'attempt-graduate-safety',
        userId: demoUsers.graduateStudent.id,
        quizId: safetyQuiz.id,
        score: 100,
        answers: [0, 2, 1],
        startedAt: new Date('2026-01-20T14:00:00Z'),
        submittedAt: new Date('2026-01-20T14:18:00Z'),
      },
    });

    // Graduate passed final quiz
    await tx.quizAttempt.upsert({
      where: { id: 'attempt-graduate-final' },
      update: { score: 100 },
      create: {
        id: 'attempt-graduate-final',
        userId: demoUsers.graduateStudent.id,
        quizId: finalQuiz.id,
        score: 100,
        answers: [0, 1, 1],
        startedAt: new Date('2026-02-15T15:00:00Z'),
        submittedAt: new Date('2026-02-15T15:25:00Z'),
      },
    });

    // Trainee in-progress attempt
    await tx.quizAttempt.upsert({
      where: { id: 'attempt-trainee-safety' },
      update: {},
      create: {
        id: 'attempt-trainee-safety',
        userId: demoUsers.traineeStudent.id,
        quizId: safetyQuiz.id,
        score: null,
        answers: [0],
        startedAt: new Date('2026-01-25T11:00:00Z'),
        submittedAt: null,
      },
    });

    // 8. Seed Certificate
    console.log('Seeding course completion certificate...');
    await tx.certificate.upsert({
      where: {
        userId_courseId: {
          userId: demoUsers.graduateStudent.id,
          courseId: course.id,
        },
      },
      update: {
        issuedAt: new Date('2026-02-15T16:30:00Z'),
        revokedAt: null,
      },
      create: {
        id: 'cert-sarah-agri-2026',
        userId: demoUsers.graduateStudent.id,
        courseId: course.id,
        issuedAt: new Date('2026-02-15T16:30:00Z'),
      },
    });

    // 9. Seed Course Documents / Resources
    console.log('Seeding course documents uploaded by instructor...');
    const documents = [
      {
        id: 'doc-preflight-checklist',
        title: 'SAQR Pre-flight Safety Checklist v2.1',
        objectPath: 'courses/agricultural-drone-operations/saqr-preflight-safety-checklist.pdf',
        mimeType: 'application/pdf',
      },
      {
        id: 'doc-ndvi-guide',
        title: 'Multispectral NDVI Field Interpretation Guide',
        objectPath: 'courses/agricultural-drone-operations/multispectral-ndvi-interpretation-guide.pdf',
        mimeType: 'application/pdf',
      },
      {
        id: 'doc-spraying-manual',
        title: 'Agricultural Drone Spraying & Drift Mitigation Manual',
        objectPath: 'courses/agricultural-drone-operations/agri-drone-spraying-safety-manual.pdf',
        mimeType: 'application/pdf',
      },
    ];

    for (const doc of documents) {
      await tx.document.upsert({
        where: { objectPath: doc.objectPath },
        update: {
          title: doc.title,
          mimeType: doc.mimeType,
          status: DocumentStatus.READY,
        },
        create: {
          id: doc.id,
          courseId: course.id,
          uploaderId: demoUsers.instructor.id,
          title: doc.title,
          bucket: 'course-resources',
          objectPath: doc.objectPath,
          mimeType: doc.mimeType,
          status: DocumentStatus.READY,
        },
      });
    }
  });

  console.log('====================================================');
  console.log('✔ SAQR MVP Database successfully seeded!');
  console.log('  - Users seeded: 5 (Trainee, Graduate, New, Instructor, Admin)');
  console.log('  - Course: Agricultural Drone Operations (PUBLISHED)');
  console.log('  - Modules: 5 fully structured modules');
  console.log('  - Lessons: 20 comprehensive lessons with rich content and types');
  console.log('  - Enrollments: 3 representative student enrollments');
  console.log('  - Progress: Trainee (35% - 7 lessons), Graduate (100% - 20 lessons), New (0%)');
  console.log('  - Quizzes: 2 (Drone Systems & Safety, Final Readiness)');
  console.log('  - Quiz Questions: 6 single-choice questions');
  console.log('  - Quiz Attempts: 3 (2 passed by Graduate, 1 in-progress by Trainee)');
  console.log('  - Certificates: 1 issued to Graduate');
  console.log('  - Documents: 3 resources uploaded by Instructor');
  console.log('====================================================');
}

seed()
  .catch((err) => {
    console.error('Seed failed. Check database configuration and migrations.', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
