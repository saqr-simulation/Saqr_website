'use client';

import { useEffect, useRef, useState } from 'react';
import { sitePath } from '../lib/site-path';

/** Repository-owned agricultural drone with accessible rotation controls. */
export function DroneHero() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
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
        const { GLTFLoader } =
          await import('three/addons/loaders/GLTFLoader.js');
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
        const rim = new T.DirectionalLight(0x4688c5, 3);
        rim.position.set(-4, 2, -3);
        scene.add(rim);
        const drone = new T.Group();
        scene.add(drone);
        const disposeModel = () => {
          const materials = new Set<import('three').Material>();
          const textures = new Set<import('three').Texture>();
          drone.traverse((object) => {
            if (!(object instanceof T.Mesh)) return;
            object.geometry.dispose();
            for (const material of Array.isArray(object.material)
              ? object.material
              : [object.material]) {
              materials.add(material);
              for (const value of Object.values(material)) {
                if (value instanceof T.Texture) textures.add(value);
              }
            }
          });
          textures.forEach((texture) => {
            texture.dispose();
            if (
              typeof ImageBitmap !== 'undefined' &&
              texture.image instanceof ImageBitmap
            )
              texture.image.close();
          });
          materials.forEach((material) => material.dispose());
        };
        teardown = () => {
          disposeModel();
          renderer.dispose();
        };
        const gltf = await new GLTFLoader().loadAsync(
          sitePath('/models/saqr-agri-drone.glb'),
        );
        drone.add(gltf.scene);
        if (disposed) {
          teardown();
          return;
        }
        // Center and normalize the asset without altering its original materials.
        const bounds = new T.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new T.Vector3());
        const scale = 4.5 / Math.max(size.x, size.y, size.z);
        gltf.scene.position.sub(bounds.getCenter(new T.Vector3()));
        drone.scale.setScalar(scale);
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
          disposeModel();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        teardown();
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
              stroke="#bfe3f0"
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
            <path fill="#4688c5" d="M240 135h20v65h-20z" />
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
      </div>
    </div>
  );
}
