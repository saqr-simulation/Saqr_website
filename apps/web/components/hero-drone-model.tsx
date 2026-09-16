'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export function HeroDroneModel() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.15, 4.1);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xd9fff1, 0x07111f, 2.7));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00c982, 2.1);
    rimLight.position.set(-5, 2, -4);
    scene.add(rimLight);

    let drone: THREE.Group | null = null;
    const basePosition = new THREE.Vector3();
    let frameId = 0;
    const clock = new THREE.Clock();

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    new FBXLoader().load(
      '/models/saqr-agriculture-drone.fbx',
      (model) => {
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const scale = 2.9 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);

        const centeredBounds = new THREE.Box3().setFromObject(model);
        const center = centeredBounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        basePosition.copy(model.position);
        model.rotation.set(-0.16, -0.72, 0.04);

        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = false;
            node.receiveShadow = false;
          }
        });

        drone = model;
        scene.add(drone);
      },
      undefined,
      () => undefined,
    );

    const render = () => {
      const elapsed = clock.getElapsedTime();
      if (drone) {
        drone.rotation.y = -0.72 + Math.sin(elapsed * 0.45) * 0.18;
        drone.position.y = basePosition.y + Math.sin(elapsed * 0.9) * 0.08;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      renderer.dispose();
      host.replaceChildren();
    };
  }, []);

  return (
    <div
      className="hero-drone-model"
      ref={hostRef}
      role="img"
      aria-label="Animated three-dimensional agricultural drone"
    />
  );
}
