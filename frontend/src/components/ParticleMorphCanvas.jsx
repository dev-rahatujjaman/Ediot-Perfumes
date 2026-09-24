import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiMaximize2, FiSun, FiFeather, FiCompass, FiActivity, FiArrowDown } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 6500;

// Generate 3D point cloud coordinates synchronously with dispersion vectors
const generateShapePoints = (count) => {
  // 1. Bottle Shape (Architectural Flacon with Neck and Crystal Stopper)
  const bottle = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = Math.random();

    if (r < 0.65) {
      // Main faceted glass body
      const u = (Math.random() - 0.5) * 2.2;
      const v = (Math.random() - 0.5) * 3.0;
      const w = (Math.random() - 0.5) * 1.3;
      const angle = Math.atan2(w, u);
      const dist = Math.sqrt(u * u + w * w);
      bottle[i3] = (dist < 1.0 ? u : Math.cos(angle) * 1.0) + (Math.random() - 0.5) * 0.04;
      bottle[i3 + 1] = v - 0.5;
      bottle[i3 + 2] = (dist < 1.0 ? w : Math.sin(angle) * 0.65) + (Math.random() - 0.5) * 0.04;
    } else if (r < 0.8) {
      // Shoulder & Neck cylinder
      const theta = Math.random() * Math.PI * 2;
      const rad = 0.32 + Math.random() * 0.08;
      const y = 1.0 + Math.random() * 0.65;
      bottle[i3] = Math.cos(theta) * rad;
      bottle[i3 + 1] = y;
      bottle[i3 + 2] = Math.sin(theta) * rad;
    } else {
      // Crystal Stopper
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const rad = 0.55 + Math.random() * 0.12;
      bottle[i3] = rad * Math.sin(phi) * Math.cos(theta);
      bottle[i3 + 1] = 2.1 + rad * Math.cos(phi) * 0.75;
      bottle[i3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
    }
  }

  // 2. Mist / Scent Cloud (Golden logarithmic vortex)
  const mist = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = i * 0.05 + (Math.random() - 0.5) * 0.3;
    const radius = 0.2 + Math.pow(Math.random(), 0.7) * 3.4;
    const height = (Math.random() - 0.5) * 3.8 + Math.sin(angle * 2) * 0.4;
    const spread = (Math.random() - 0.5) * 0.7;

    mist[i3] = Math.cos(angle) * radius + spread;
    mist[i3 + 1] = height;
    mist[i3 + 2] = Math.sin(angle) * radius + spread;
  }

  // 3. Flower / Jasmine Petal Sacred Geometry Mandala
  const flower = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const k = 5;
    const r = Math.sin(k * theta) * 1.6 + 1.2;
    const rad = Math.pow(Math.random(), 0.5) * r;
    const zCurve = -Math.cos(rad * 1.4) * 0.7;

    flower[i3] = Math.cos(theta) * rad * 1.2;
    flower[i3 + 1] = Math.sin(theta) * rad * 1.0;
    flower[i3 + 2] = zCurve + (Math.random() - 0.5) * 0.25;
  }

  // 4. Emblem / Celestial Monogram Rings
  const emblem = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const segment = Math.random();
    if (segment < 0.4) {
      const angle = Math.random() * Math.PI * 2;
      const rad = 2.4 + (Math.random() - 0.5) * 0.15;
      emblem[i3] = Math.cos(angle) * rad;
      emblem[i3 + 1] = Math.sin(angle) * rad;
      emblem[i3 + 2] = (Math.random() - 0.5) * 0.15;
    } else if (segment < 0.7) {
      const angle = Math.random() * Math.PI * 2;
      const rad = 1.5 + (Math.random() - 0.5) * 0.15;
      emblem[i3] = Math.cos(angle) * rad;
      emblem[i3 + 1] = Math.sin(angle) * rad;
      emblem[i3 + 2] = (Math.random() - 0.5) * 0.15;
    } else {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const rad = Math.pow(Math.random(), 0.6) * 1.0;
      emblem[i3] = rad * Math.sin(phi) * Math.cos(theta);
      emblem[i3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      emblem[i3 + 2] = rad * Math.cos(phi);
    }
  }

  // Precompute random 3D explosion dispersion directions per particle
  const explosionVectors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const u = (Math.random() - 0.5) * 2;
    const v = (Math.random() - 0.5) * 2;
    const w = (Math.random() - 0.5) * 2;
    const len = Math.sqrt(u * u + v * v + w * w) || 1;
    const speed = Math.random() * 3.5 + 1.5;
    explosionVectors[i3] = (u / len) * speed;
    explosionVectors[i3 + 1] = (v / len) * speed;
    explosionVectors[i3 + 2] = (w / len) * speed;
  }

  return { bottle, mist, flower, emblem, explosionVectors };
};

const ALL_SHAPES = generateShapePoints(PARTICLE_COUNT);

const STAGES = [
  {
    id: 0,
    key: 'bottle',
    num: '01',
    label: 'The Monolith Flacon',
    title: 'Architectural Heavy Crystal Silhouette',
    desc: 'Each flacon is individually sculpted from 320g of pure French optical crystal. Diamond-polished to reveal sharp geometric bevels that refract internal amber extrait light.',
    stats: [
      { label: 'Form Ratio', value: 'Golden Mean 1.618' },
      { label: 'Material', value: 'Optical Crystal' },
      { label: 'Closure', value: 'Magnetic Zamak' },
    ],
    icon: <FiMaximize2 />,
  },
  {
    id: 1,
    key: 'mist',
    num: '02',
    label: 'Scent Aura & Vortex',
    title: 'Supercritical Volatilization Cloud',
    desc: 'As the 0.05ml micro-atomizer actuates, millions of aerosolized botanical droplets disperse into an expanding golden logarithmic vortex, filling the immediate space with pure sillage.',
    stats: [
      { label: 'Droplet Size', value: '15 Microns' },
      { label: 'Diffusion Arc', value: '120° Acoustic Cone' },
      { label: 'Aura Reach', value: '2.5m Sillage Radius' },
    ],
    icon: <FiSun />,
  },
  {
    id: 2,
    key: 'flower',
    num: '03',
    label: 'Flora Heart Mandala',
    title: 'Grasse Rose & Jasmine Bloom',
    desc: 'The bio-molecular heart of Ediot Breeze. 10,000 hand-picked dawn petals of Centifolia Rose and Grandiflorum Jasmine harmonize into a sacred geometric floral core.',
    stats: [
      { label: 'Harvest Window', value: 'Pre-Dawn 05:00 AM' },
      { label: 'Floral Ratio', value: '10,000 Petals / Bottle' },
      { label: 'Purity Level', value: '100% Raw Absolute' },
    ],
    icon: <FiFeather />,
  },
  {
    id: 3,
    key: 'emblem',
    num: '04',
    label: 'The Guild Emblem',
    title: 'Seal of French Haute Parfumerie',
    desc: 'The eternal celestial seal of the Ediot Breeze Atelier. Concentric rings signify the eternal bond between raw botanical extraction, French oak aging, and human skin resonance.',
    stats: [
      { label: 'Certification', value: 'Numbered Vault Seal' },
      { label: 'Longevity', value: '16+ Hours' },
      { label: 'Authenticity', value: 'Individually Engraved' },
    ],
    icon: <FiCompass />,
  },
];

const ParticleMorphCanvas = () => {
  const sectionRef = useRef(null);
  const mountRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // References for Three.js state
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    globalProgress: 0, // 0.0 to 3.0
    targetGlobalProgress: 0,
  });

  // 1. Setup Three.js Canvas & Particle System
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    stateRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8.2;
    stateRef.current.camera = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      stateRef.current.renderer = renderer;
    } catch (err) {
      console.warn('WebGL init skipped:', err);
      return;
    }

    // Geometry & Color Attributes
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(ALL_SHAPES.bottle);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const goldColor1 = new THREE.Color('#E8D2AA');
    const goldColor2 = new THREE.Color('#D4AF37');
    const amberColor = new THREE.Color('#B8860B');
    const sparkleColor = new THREE.Color('#FFFFFF');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const pick = Math.random();
      let c = goldColor1;
      if (pick < 0.35) c = goldColor2;
      else if (pick < 0.7) c = amberColor;
      else if (pick < 0.88) c = sparkleColor;

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(245, 220, 165, 0.9)');
      grad.addColorStop(0.7, 'rgba(184, 149, 106, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.085,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    stateRef.current.particles = particles;

    // Mouse listener
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      stateRef.current.mouse.targetX = x * 0.6;
      stateRef.current.mouse.targetY = y * 0.6;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container || !stateRef.current.renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      stateRef.current.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Master WebGL Render Loop with Explosion & Reassembly Physics
    let animId;
    const clock = new THREE.Clock();
    const shapeKeys = ['bottle', 'mist', 'flower', 'emblem'];

    const render = () => {
      animId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      // Mouse inertia lerp
      const { mouse, particles, targetGlobalProgress } = stateRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Smooth progress interpolation
      stateRef.current.globalProgress += (targetGlobalProgress - stateRef.current.globalProgress) * 0.1;
      const prog = stateRef.current.globalProgress; // 0.0 to 3.0

      if (particles) {
        // Continuous organic rotation + mouse parallax
        particles.rotation.y = elapsed * 0.08 + mouse.x * 0.35;
        particles.rotation.x = Math.sin(elapsed * 0.05) * 0.05 + mouse.y * 0.2;

        const posArray = particles.geometry.attributes.position.array;
        const explosion = ALL_SHAPES.explosionVectors;

        // Calculate active shape pair
        const currentIdx = Math.min(2, Math.floor(prog));
        const nextIdx = currentIdx + 1;
        const t = Math.max(0, Math.min(1, prog - currentIdx)); // 0.0 to 1.0

        const shapeFrom = ALL_SHAPES[shapeKeys[currentIdx]];
        const shapeTo = ALL_SHAPES[shapeKeys[nextIdx]] || ALL_SHAPES.emblem;

        // Explosion burst factor follows a sine dome: peaks at t = 0.5
        const burstFactor = Math.sin(t * Math.PI); // 0 -> 1 -> 0

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;

          // 1. Interpolate between base shapes
          const lx = shapeFrom[i3] + (shapeTo[i3] - shapeFrom[i3]) * t;
          const ly = shapeFrom[i3 + 1] + (shapeTo[i3 + 1] - shapeFrom[i3 + 1]) * t;
          const lz = shapeFrom[i3 + 2] + (shapeTo[i3 + 2] - shapeFrom[i3 + 2]) * t;

          // 2. High-energy explosion displacement when transitioning
          const ex = explosion[i3] * burstFactor * 2.2;
          const ey = explosion[i3 + 1] * burstFactor * 2.2;
          const ez = explosion[i3 + 2] * burstFactor * 2.2;

          // Micro harmonic breathing wave
          const wave = Math.sin(elapsed * 2.0 + i * 0.08) * 0.015;

          posArray[i3] = lx + ex + wave;
          posArray[i3 + 1] = ly + ey + wave * 0.5;
          posArray[i3 + 2] = lz + ez + wave;
        }

        particles.geometry.attributes.position.needsUpdate = true;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer?.dispose();
    };
  }, []);

  // 2. GSAP Native Pinning with ScrollTrigger
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=2400', // 2400px of smooth pinned scrub scroll
        pin: true,
        pinSpacing: true,
        scrub: 1.0,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress; // 0.0 to 1.0
          setScrollProgress(Math.round(p * 100));

          // Map 0.0 -> 1.0 to 0.0 -> 3.0 across the 4 shapes
          const targetGProg = p * 3.0;
          stateRef.current.targetGlobalProgress = targetGProg;

          // Update active stage indicator (0, 1, 2, 3)
          const stg = Math.min(3, Math.floor(p * 3.99));
          setActiveStage(stg);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Click on stage tab to scroll to exact pinned progress
  const scrollToStage = (stageIdx) => {
    if (!triggerRef.current) return;
    const start = triggerRef.current.start;
    const end = triggerRef.current.end;
    const targetScroll = start + (stageIdx / 3) * (end - start);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const current = STAGES[activeStage];

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0a0908',
        color: 'white',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient Radial Background Aura */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.14) 0%, rgba(10, 9, 8, 0.95) 70%, #050505 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 3D WebGL Canvas Layer */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          cursor: 'grab',
          width: '100%',
          height: '100%',
        }}
      />

      {/* Top Header Badge & Stage Navigation Bar */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          left: '48px',
          right: '48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 700,
              border: '1px solid rgba(212, 175, 55, 0.3)',
              padding: '6px 14px',
              borderRadius: '980px',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FiActivity /> 3D Olfactory Geometry
          </span>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            Scroll-Driven Stardust Metamorphosis
          </span>
        </div>

        {/* Interactive Stage Step Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {STAGES.map((st, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={st.id}
                onClick={() => scrollToStage(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '980px',
                  background: isActive ? 'var(--color-gold)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#000000' : 'rgba(255,255,255,0.6)',
                  border: isActive ? '1px solid var(--color-gold)' : '1px solid rgba(255,255,255,0.1)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Left Editorial Card Overlay */}
      <div
        style={{
          position: 'absolute',
          left: '48px',
          bottom: '48px',
          maxWidth: '480px',
          zIndex: 10,
          background: 'rgba(18, 16, 14, 0.78)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.4s ease',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            fontWeight: 700,
            marginBottom: '10px',
          }}
        >
          PHASE {current.num} • {current.label}
        </div>

        <h2
          style={{
            fontSize: 'clamp(24px, 3vw, 34px)',
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: '14px',
            color: '#FFFFFF',
          }}
        >
          {current.title}
        </h2>

        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            lineHeight: 1.7,
            marginBottom: '24px',
          }}
        >
          {current.desc}
        </p>

        {/* 3 Metric Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {current.stats.map((st, i) => (
            <div key={i}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                {st.label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-gold-light)' }}>
                {st.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Right Scroll Helper / Progress Indicator */}
      <div
        style={{
          position: 'absolute',
          right: '48px',
          bottom: '48px',
          zIndex: 10,
          background: 'rgba(18, 16, 14, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)' }}>
          Scrub Metamorphosis
        </div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-gold)' }}>
          {scrollProgress}%
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
          <FiArrowDown style={{ animation: 'bounce 1.5s infinite' }} />
          <span>Scroll to Explode & Morph</span>
        </div>
      </div>

      {/* Bottom Horizontal Scrub Progress Line */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '280px',
          height: '3px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '980px',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${scrollProgress}%`,
            background: 'var(--color-gold)',
            borderRadius: '980px',
            transition: 'width 0.05s linear',
          }}
        />
      </div>
    </section>
  );
};

export default ParticleMorphCanvas;
