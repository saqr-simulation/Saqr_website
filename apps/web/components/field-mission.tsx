'use client';

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';

const route =
  'M90 320V110Q90 90 110 90H150Q170 90 170 110V300Q170 320 190 320H230Q250 320 250 300V110Q250 90 270 90H310Q330 90 330 110V300Q330 320 350 320H390Q410 320 410 300V90';
const stages = [
  'Mission Planning',
  'Takeoff',
  'Field Mapping',
  'Crop Scan',
  'Analysis Complete',
];
const stageAt = (time: number) =>
  time < 1.2 ? 0 : time < 2.4 ? 1 : time < 5 ? 2 : time < 12 ? 3 : 4;
const MissionContext = createContext<{
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
} | null>(null);

export function AgricultureMission({
  children,
  className = 'split',
}: {
  children: ReactNode;
  className?: string;
}) {
  const [time, setTime] = useState(0);
  return (
    <MissionContext.Provider value={{ time, setTime }}>
      <div className={className}>{children}</div>
    </MissionContext.Provider>
  );
}

export function MissionCompetencies({ items }: { items: string[] }) {
  const mission = useContext(MissionContext);
  const stage = stageAt(mission?.time ?? 0);
  return (
    <div className="use-cases mission-competencies">
      {items.map((item) => {
        const text = item.toLowerCase();
        const active =
          stage === 0 || stage === 2
            ? /mapping|planning/.test(text)
            : stage === 1
              ? /terrain|wind/.test(text)
              : stage === 3
                ? /crop monitoring|multispectral/.test(text)
                : /precision agriculture/.test(text);
        return (
          <span
            key={item}
            className={active ? 'mission-competency-active' : undefined}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
}

export function FieldMission() {
  const [mode, setMode] = useState<'mapping' | 'monitoring'>('mapping');
  const scene = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, '');
  const mission = useContext(MissionContext);
  const setTime = mission?.setTime;
  const time = mission?.time ?? 0;
  const stage = stageAt(time);
  const progress = Math.round(
    Math.max(0, Math.min(1, (time - 2.4) / 9.6)) * 100,
  );

  useEffect(() => {
    const svg = scene.current!;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const sample = () => setTime?.(svg.getCurrentTime() % 14);
    const update = () => {
      clearInterval(timer);
      if (motion.matches) {
        svg.pauseAnimations();
        svg.setCurrentTime(12.4);
        sample();
      } else if (!visible || document.hidden) svg.pauseAnimations();
      else {
        svg.unpauseAnimations();
        timer = setInterval(sample, 200);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      update();
    });
    observer.observe(svg);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    update();
    return () => {
      clearInterval(timer);
      observer.disconnect();
      motion.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [setTime]);

  return (
    <div className="field-mission">
      <div className="mission-toolbar">
        <span>
          <i className="status-dot" /> MISSION PREVIEW
        </span>
        <span className="mission-stage-label">{stages[stage]}</span>
      </div>
      <div
        className="mission-modes"
        role="group"
        aria-label="Agricultural mission view"
      >
        <button
          type="button"
          aria-pressed={mode === 'mapping'}
          onClick={() => setMode('mapping')}
        >
          Field Mapping
        </button>
        <button
          type="button"
          aria-pressed={mode === 'monitoring'}
          onClick={() => setMode('monitoring')}
        >
          Crop Monitoring
        </button>
      </div>
      <svg
        ref={scene}
        viewBox="0 0 500 390"
        role="img"
        aria-label={
          mode === 'mapping'
            ? 'Illustrative drone following a survey route over crop rows'
            : 'Illustrative drone scanning a field to reveal crop health zones'
        }
      >
        <defs>
          <pattern
            id={`${id}-rows`}
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(12)"
          >
            <rect width="22" height="22" fill="#214a40" />
            <rect width="9" height="22" fill="#356650" />
            <path d="M4 0V22" stroke="#56825a" strokeWidth="1" />
          </pattern>
          <radialGradient id={`${id}-scan`}>
            <stop stopColor="#8bffcf" stopOpacity=".3" />
            <stop offset="1" stopColor="#8bffcf" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect
          x="42"
          y="52"
          width="416"
          height="296"
          rx="12"
          fill={`url(#${id}-rows)`}
        />
        <path
          d="M42 200H458M210 52V348"
          stroke="#172f2b"
          strokeWidth="10"
          opacity=".55"
        />
        <g>
          {Array.from({ length: 20 }, (_, index) => {
            const column = index % 5;
            const row = Math.floor(index / 5);
            const scanOrder = column * 4 + (column % 2 === 0 ? 3 - row : row);
            return (
              <rect
                key={index}
                x={57 + (index % 5) * 78}
                y={65 + Math.floor(index / 5) * 68}
                width="72"
                height="60"
                rx="5"
                fill={
                  mode === 'mapping'
                    ? '#bfe3f0'
                    : index === 8 || index === 13
                      ? '#efb65b'
                      : index % 4 === 0
                        ? '#a8d475'
                        : '#4de0a1'
                }
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values="0;0;.42;.42;0"
                  keyTimes={`0;${(2.4 + scanOrder * 0.46) / 14};${(2.8 + scanOrder * 0.46) / 14};.93;1`}
                  dur="14s"
                  repeatCount="indefinite"
                />
              </rect>
            );
          })}
        </g>
        <rect
          x="42"
          y="52"
          width="416"
          height="296"
          rx="12"
          fill="none"
          stroke="#b8e3c5"
          strokeOpacity=".4"
        />
        <path
          d={route}
          fill="none"
          stroke="#d8f8e5"
          strokeOpacity=".35"
          strokeWidth="1.5"
          strokeDasharray="5 6"
        />
        <path
          d={route}
          fill="none"
          stroke="#70f1c2"
          strokeWidth="3"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset="100"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="100;100;0;0;100"
            keyTimes="0;.1714;.8571;.93;1"
            dur="14s"
            repeatCount="indefinite"
          />
        </path>
        <g>
          <animate
            attributeName="opacity"
            values="0;0;1;1;0;0"
            keyTimes="0;.0857;.12;.9;.96;1"
            dur="14s"
            repeatCount="indefinite"
          />
          <animateMotion
            path={`M30 360L90 320${route.slice('M90 320'.length)}`}
            dur="14s"
            keyPoints="0;0;.05;1;1"
            keyTimes="0;.0857;.1714;.8571;1"
            calcMode="spline"
            keySplines="0 0 1 1;.4 0 .2 1;0 0 1 1;0 0 1 1"
            repeatCount="indefinite"
          />
          <g>
            <animate
              attributeName="opacity"
              values="0;0;1;1;0"
              keyTimes="0;.1714;.2;.8571;1"
              dur="14s"
              repeatCount="indefinite"
            />
            <circle r="43" fill={`url(#${id}-scan)`} />
            <circle r="27" fill="none" stroke="#8bffcf" strokeOpacity=".35" />
          </g>
          <g stroke="#effff6" strokeWidth="3" strokeLinecap="round">
            <path d="M-12 -12L12 12M-12 12L12 -12" />
            {[-12, 12].flatMap((x) =>
              [-12, 12].map((y) => (
                <ellipse
                  key={`${x}-${y}`}
                  cx={x}
                  cy={y}
                  rx="7"
                  ry="3"
                  fill="#0e3430"
                  strokeWidth="1.5"
                />
              )),
            )}
          </g>
          <rect x="-5" y="-7" width="10" height="14" rx="3" fill="#f2fff8" />
          <path d="M0 -4V4" stroke="#35dba4" strokeWidth="2" />
        </g>
        <circle cx="90" cy="320" r="4" fill="#ceffe4" />
        <text x="44" y="375" fill="#a9c7bd" fontSize="9" letterSpacing="2">
          SAQR / AGRICULTURAL OPERATIONS
        </text>
      </svg>
      <div
        className="mission-telemetry"
        aria-label="Illustrative mission telemetry"
      >
        <span>
          ALTITUDE
          <strong>
            {stage === 0
              ? '0'
              : stage === 1
                ? Math.round((time - 1.2) * 25)
                : '30'}{' '}
            m
          </strong>
        </span>
        <span>
          MISSION<strong>{progress}%</strong>
        </span>
        <span>
          WIND
          <strong>
            {stage < 2 ? '2.4' : (2.4 + Math.sin(time) * 0.3).toFixed(1)} m/s
          </strong>
        </span>
        <span>
          NDVI
          <strong>
            {stage < 3 ? '—' : (0.72 + Math.sin(time * 0.7) * 0.04).toFixed(2)}
          </strong>
        </span>
      </div>
      <ol className="mission-stages" aria-label="Mission sequence">
        {stages.map((label, index) => (
          <li
            key={label}
            className={
              index === stage
                ? 'is-current'
                : index < stage
                  ? 'is-complete'
                  : undefined
            }
            aria-current={index === stage ? 'step' : undefined}
          >
            <span>{index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="mission-caption">
        <span>
          {mode === 'mapping'
            ? 'Survey route · systematic field coverage'
            : 'Crop health · illustrative scan zones'}
        </span>
        <span className="mission-legend">
          {mode === 'mapping' ? '↗ Flight path' : '● Healthy   ◐ Review'}
        </span>
      </div>
      <p className="mission-disclaimer">
        Illustrative training scenario · simulated readings
      </p>
    </div>
  );
}
