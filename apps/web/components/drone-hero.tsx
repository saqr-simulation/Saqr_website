'use client';

import { useEffect, useRef, useState } from 'react';

/** A locally constructed agricultural aircraft: no external model or texture requests. */
export function DroneHero() {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<{
    pause: (value: boolean) => void;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = host.current!;
    let disposed = false;
    let teardown = () => {};
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      try {
        const T = await import('three');
        const { RoundedBoxGeometry } =
          await import('three/addons/geometries/RoundedBoxGeometry.js');
        if (disposed) return;
        const renderer = new T.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(36, 1, 0.1, 100);
        camera.position.set(5.1, 3.6, 5.9);
        camera.lookAt(0, 0, 0);
        scene.add(new T.HemisphereLight(0xe0faff, 0x263c46, 3));
        const key = new T.DirectionalLight(0xffffff, 4);
        key.position.set(3, 6, 4);
        scene.add(key);
        const rim = new T.DirectionalLight(0x54e5ba, 3);
        rim.position.set(-4, 2, -3);
        scene.add(rim);
        const drone = new T.Group();
        scene.add(drone);
        const carbon = new T.MeshStandardMaterial({
          color: 0x19282d,
          metalness: 0.65,
          roughness: 0.32,
        });
        const shell = new T.MeshStandardMaterial({
          color: 0xe5eae5,
          metalness: 0.35,
          roughness: 0.28,
        });
        const green = new T.MeshStandardMaterial({
          color: 0x25d0a0,
          metalness: 0.3,
          roughness: 0.3,
        });
        const tank = new T.MeshStandardMaterial({
          color: 0x9eafad,
          metalness: 0.15,
          roughness: 0.5,
        });
        function box(
          w: number,
          h: number,
          d: number,
          x: number,
          y: number,
          z: number,
          material = carbon,
        ) {
          const mesh = new T.Mesh(
            new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * 0.15),
            material,
          );
          mesh.position.set(x, y, z);
          drone.add(mesh);
          return mesh;
        }
        function rod(
          a: number[],
          b: number[],
          radius = 0.055,
          material = carbon,
        ) {
          const start = new T.Vector3(...a),
            end = new T.Vector3(...b);
          const mesh = new T.Mesh(
            new T.CylinderGeometry(radius, radius, start.distanceTo(end), 12),
            material,
          );
          mesh.position.copy(start).add(end).multiplyScalar(0.5);
          mesh.quaternion.setFromUnitVectors(
            new T.Vector3(0, 1, 0),
            end.sub(start).normalize(),
          );
          drone.add(mesh);
        }
        const body = box(1.1, 0.38, 1.35, 0, 0.2, 0, shell);
        body.rotation.z = 0.04;
        box(0.72, 0.09, 0.9, 0, 0.44, 0, carbon);
        box(0.18, 0.1, 0.92, 0, 0.5, 0, green);
        box(0.82, 0.62, 0.88, 0, -0.3, 0, tank);
        box(0.25, 0.16, 0.1, 0, 0.12, 0.72, carbon);
        const lens = new T.Mesh(new T.SphereGeometry(0.08, 16, 12), green);
        lens.position.set(0, 0.12, 0.79);
        drone.add(lens);
        const rotors: import('three').Group[] = [];
        for (const x of [-1, 1])
          for (const z of [-1, 1]) {
            const px = x * 1.65,
              pz = z * 1.45;
            rod([x * 0.42, 0.2, z * 0.45], [px, 0.32, pz], 0.095);
            rod([x * 0.4, 0.05, z * 0.5], [px, 0.26, pz], 0.035, tank);
            const motor = new T.Mesh(
              new T.CylinderGeometry(0.17, 0.14, 0.26, 20),
              carbon,
            );
            motor.position.set(px, 0.4, pz);
            drone.add(motor);
            const rotor = new T.Group();
            rotor.position.set(px, 0.57, pz);
            for (const angle of [0, Math.PI]) {
              const blade = new T.Mesh(
                new T.BoxGeometry(0.86, 0.025, 0.12),
                carbon,
              );
              blade.position.x = Math.cos(angle) * 0.42;
              blade.rotation.y = angle + 0.12;
              rotor.add(blade);
            }
            const hub = new T.Mesh(new T.SphereGeometry(0.1, 12, 8), shell);
            rotor.add(hub);
            rotor.rotation.y = x * z;
            drone.add(rotor);
            rotors.push(rotor);
            rod([x * 0.5, -0.05, z * 0.4], [x * 0.85, -0.92, z * 0.7], 0.045);
          }
        for (const x of [-0.85, 0.85]) {
          rod([x, -0.92, -1], [x, -0.92, 1], 0.055);
          rod([x, -0.55, -0.4], [x * 1.6, -0.55, -0.4], 0.035, tank);
          box(0.09, 0.12, 0.09, x * 1.6, -0.63, -0.4, green);
        }
        element.appendChild(renderer.domElement);
        renderer.domElement.setAttribute('aria-hidden', 'true');
        let visible = true,
          stopped = false,
          frame = 0,
          last = 0,
          yaw = -0.3;
        let pitch = 0;
        let drag: { id: number; x: number; y: number } | null = null;
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const draw = () => renderer.render(scene, camera);
        const resize = () => {
          renderer.setSize(element.clientWidth, element.clientHeight, false);
          camera.aspect = element.clientWidth / element.clientHeight;
          camera.updateProjectionMatrix();
          draw();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(element);
        const tick = (now: number) => {
          frame = 0;
          if (!visible || document.hidden || stopped || motion.matches) return;
          if (now - last >= 33) {
            last = now;
            drone.position.y = Math.sin(now * 0.001) * 0.08;
            drone.rotation.y += (yaw - drone.rotation.y) * 0.15;
            drone.rotation.x += (pitch - drone.rotation.x) * 0.15;
            rotors.forEach((rotor, index) => {
              rotor.rotation.y += index % 2 ? 0.45 : -0.45;
            });
            draw();
          }
          frame = requestAnimationFrame(tick);
        };
        const resume = () => {
          if (!frame) frame = requestAnimationFrame(tick);
        };
        const visibility = new IntersectionObserver(([item]) => {
          visible = Boolean(item?.isIntersecting);
          if (visible) resume();
        });
        visibility.observe(element);
        const onVisibility = () => {
          if (!document.hidden) resume();
        };
        const onMotion = () => {
          if (motion.matches) {
            drone.position.y = 0;
            draw();
          } else resume();
        };
        const rotate = (horizontal: number, vertical: number) => {
          yaw += horizontal;
          pitch = Math.max(-0.6, Math.min(0.6, pitch + vertical));
          if (stopped || motion.matches) {
            drone.rotation.set(pitch, yaw, 0);
            draw();
          }
        };
        const down = (event: PointerEvent) => {
          if (!event.isPrimary || event.button !== 0 || drag) return;
          drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
          element.setPointerCapture(event.pointerId);
          element.dataset.dragging = 'true';
          element.focus({ preventScroll: true });
        };
        const move = (event: PointerEvent) => {
          if (!drag || drag.id !== event.pointerId) return;
          rotate(
            ((event.clientX - drag.x) / element.clientWidth) * Math.PI * 2,
            ((event.clientY - drag.y) / element.clientHeight) * 1.5,
          );
          drag.x = event.clientX;
          drag.y = event.clientY;
        };
        const up = (event: PointerEvent) => {
          if (!drag || drag.id !== event.pointerId) return;
          drag = null;
          delete element.dataset.dragging;
          if (element.hasPointerCapture(event.pointerId))
            element.releasePointerCapture(event.pointerId);
        };
        const keyboard = (event: KeyboardEvent) => {
          const directions: Record<string, [number, number]> = {
            ArrowLeft: [-0.2, 0],
            ArrowRight: [0.2, 0],
            ArrowUp: [0, -0.1],
            ArrowDown: [0, 0.1],
          };
          const direction = directions[event.key];
          if (!direction) return;
          event.preventDefault();
          rotate(...direction);
        };
        const contextLost = (event: Event) => {
          event.preventDefault();
          stopped = true;
          setFailed(true);
        };
        element.addEventListener('pointerdown', down);
        element.addEventListener('pointermove', move);
        element.addEventListener('pointerup', up);
        element.addEventListener('pointercancel', up);
        element.addEventListener('lostpointercapture', up);
        element.addEventListener('keydown', keyboard);
        renderer.domElement.addEventListener('webglcontextlost', contextLost);
        document.addEventListener('visibilitychange', onVisibility);
        motion.addEventListener('change', onMotion);
        controls.current = {
          pause(value) {
            stopped = value;
            if (!value) resume();
          },
        };
        drone.rotation.y = yaw;
        resize();
        setReady(true);
        resume();
        teardown = () => {
          cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          visibility.disconnect();
          element.removeEventListener('pointerdown', down);
          element.removeEventListener('pointermove', move);
          element.removeEventListener('pointerup', up);
          element.removeEventListener('pointercancel', up);
          element.removeEventListener('lostpointercapture', up);
          element.removeEventListener('keydown', keyboard);
          delete element.dataset.dragging;
          document.removeEventListener('visibilitychange', onVisibility);
          motion.removeEventListener('change', onMotion);
          renderer.domElement.removeEventListener(
            'webglcontextlost',
            contextLost,
          );
          scene.traverse((object) => {
            if (object instanceof T.Mesh) object.geometry.dispose();
          });
          [carbon, shell, green, tank].forEach((material) =>
            material.dispose(),
          );
          renderer.dispose();
          renderer.domElement.remove();
          controls.current = null;
        };
      } catch {
        if (!disposed) setFailed(true);
      }
    });
    observer.observe(element);
    return () => {
      disposed = true;
      observer.disconnect();
      teardown();
    };
  }, []);

  return (
    <div className="drone-stage">
      <div className="drone-stage-heading">
        <span>
          <i className="status-dot" /> AGRICULTURAL DRONE
        </span>
        <span>SAQR / 01</span>
      </div>
      <div className="drone-orbit" aria-hidden="true" />
      <div
        ref={host}
        className="drone-canvas"
        role="img"
        tabIndex={ready && !failed ? 0 : -1}
        aria-label="Interactive 3D agricultural drone. Drag to rotate, or use arrow keys when focused."
      >
        {(!ready || failed) && (
          <svg
            className="drone-fallback"
            viewBox="0 0 500 350"
            aria-hidden="true"
          >
            <g
              fill="none"
              stroke="#77c7b3"
              strokeWidth="12"
              strokeLinecap="round"
            >
              <path d="M250 170 130 95M250 170 370 95M250 170 120 240M250 170 380 240" />
              <path d="M215 185 195 275H300L285 185" />
            </g>
            <g fill="#d7e5e0">
              <ellipse cx="130" cy="95" rx="70" ry="12" />
              <ellipse cx="370" cy="95" rx="70" ry="12" />
              <ellipse cx="120" cy="240" rx="70" ry="12" />
              <ellipse cx="380" cy="240" rx="70" ry="12" />
              <rect x="205" y="130" width="90" height="75" rx="20" />
            </g>
            <path fill="#27cca2" d="M240 135h20v65h-20z" />
          </svg>
        )}
      </div>
      <div className="drone-stage-bottom">
        <div>
          <strong>Precision starts with practice.</strong>
          <p>
            {failed
              ? 'Agricultural aircraft concept'
              : 'Aircraft concept · drag to rotate'}
          </p>
        </div>
        {ready && !failed && (
          <div className="drone-controls">
            <button
              aria-label={
                paused ? 'Resume drone animation' : 'Pause drone animation'
              }
              aria-pressed={paused}
              onClick={() => {
                controls.current?.pause(!paused);
                setPaused(!paused);
              }}
            >
              {paused ? '▶' : 'Ⅱ'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
