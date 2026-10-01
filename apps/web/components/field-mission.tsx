'use client';

import { useEffect, useId, useRef, useState } from 'react';

const route =
  'M90 320V110Q90 90 110 90H150Q170 90 170 110V300Q170 320 190 320H230Q250 320 250 300V110Q250 90 270 90H310Q330 90 330 110V300Q330 320 350 320H390Q410 320 410 300V90';

export function FieldMission() {
  const [mode, setMode] = useState<'mapping' | 'monitoring'>('mapping');
  const scene = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    const svg = scene.current!;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      if (motion.matches || !visible || document.hidden) svg.pauseAnimations();
      else svg.unpauseAnimations();
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
      observer.disconnect();
      motion.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <div className="field-mission">
      <div className="mission-toolbar">
        <span>
          <i className="status-dot" /> MISSION PREVIEW
        </span>
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
        {mode === 'monitoring' && (
          <g key="health">
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
                    index === 8 || index === 13
                      ? '#efb65b'
                      : index % 4 === 0
                        ? '#a8d475'
                        : '#4de0a1'
                  }
                  opacity=".38"
                >
                  <animate
                    attributeName="opacity"
                    values=".08;.08;.48;.48;.08"
                    keyTimes={`0;${0.02 + scanOrder * 0.04};${0.07 + scanOrder * 0.04};.94;1`}
                    dur="18s"
                    repeatCount="indefinite"
                  />
                </rect>
              );
            })}
          </g>
        )}
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
            values="100;0;0;100"
            keyTimes="0;.9;.96;1"
            dur="18s"
            repeatCount="indefinite"
          />
        </path>
        <g>
          <animate
            attributeName="opacity"
            values="1;1;0;0;1"
            keyTimes="0;.9;.94;.99;1"
            dur="18s"
            repeatCount="indefinite"
          />
          <animateMotion
            path={route}
            dur="18s"
            keyPoints="0;1;1;0"
            keyTimes="0;.9;.96;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
          <circle r="43" fill={`url(#${id}-scan)`} />
          <circle r="27" fill="none" stroke="#8bffcf" strokeOpacity=".35" />
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
      <p className="mission-disclaimer">Illustrative training scenario</p>
    </div>
  );
}
