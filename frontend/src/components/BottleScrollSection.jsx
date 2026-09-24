import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiMaximize2, FiRotateCw, FiShield, FiDroplet, FiSun, FiCheck, FiArrowRight } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

gsap.registerPlugin(ScrollTrigger);

// 3 Bespoke Scent Editions that dynamically tint the 3D liquid & cap
const EDITIONS = [
  {
    id: 'amber-royale',
    name: 'Amber Royale Signature',
    tagline: '35% Extrait de Parfum',
    price: 185,
    liquidColor: 0xd4943e, // Warm Amber Honey
    emissiveColor: 0x4a2c08,
    capColor: 0xdfba75, // 24K Gold
    capMetalness: 0.96,
    notes: 'Madagascar Vanilla • Rare Ambergris • Limousin Oak',
    accentColor: '#D4AF37',
    badge: 'Flagship Edition',
  },
  {
    id: 'obsidian-noir',
    name: 'Obsidian Birch Noir',
    tagline: 'Pure Perfume Oil Extract',
    price: 210,
    liquidColor: 0x221815, // Smoky Dark Cognac / Birch
    emissiveColor: 0x180f08,
    capColor: 0x181818, // Polished Obsidian Onyx
    capMetalness: 0.85,
    notes: 'Smoked Birch • Black Agarwood • Indonesian Patchouli',
    accentColor: '#B8956A',
    badge: 'Midnight Vault',
  },
  {
    id: 'rose-damascena',
    name: 'Grasse Rose Impériale',
    tagline: 'Pre-Dawn Floral Absolute',
    price: 195,
    liquidColor: 0xbf5353, // Crimson Rose Extrait
    emissiveColor: 0x3d0d0d,
    capColor: 0xe8b8b8, // Rose Gold
    capMetalness: 0.94,
    notes: 'Centifolia Rose • Pink Peppercorn • White Musk',
    accentColor: '#E09F9F',
    badge: 'Harvest Reserve',
  },
];

const BottleScrollSection = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const triggerRef = useRef(null);
  const dispatch = useDispatch();

  // Active Edition Selection
  const [selectedEdition, setSelectedEdition] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  // References for Three.js state manipulation
  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    bottleRoot: null,
    capGroup: null,
    liquidMesh: null,
    bottleMesh: null,
    capMesh: null,
    sprayMesh: null,
    pointLights: [],
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    orbitRotation: { x: 0, y: 0 },
    targetOrbitRotation: { x: 0, y: 0 },
  });

  // Chapter metadata
  const CHAPTERS = [
    {
      num: '01',
      tag: '01 / 04 • Crystal Monolith',
      title: 'Hand-Polished Heavy French Crystal',
      desc: 'Molded in the historic glass ateliers of Normandy. Each flacon weighs a substantial 320 grams of optically pure crystal, diamond-polished for 48 hours to create zero refractive distortion.',
      stats: [
        { label: 'Crystal Mass', value: '320 Grams' },
        { label: 'Facet Polish', value: 'Diamond Micro-Lap' },
        { label: 'Clarity Index', value: 'Optically Pure' },
      ],
    },
    {
      num: '02',
      tag: '02 / 04 • The Magnetic Crown',
      title: '24K Gold Ball Cap & Micro-Mist Pump',
      desc: 'A solid spherical crown cast in 24K gold-plated zamak. Below sits a precision-machined atomizer pump calibrated to disperse an acoustic 0.05ml plume of microscopic fragrance droplets.',
      stats: [
        { label: 'Cap Closure', value: 'Magnetic Zamak' },
        { label: 'Plume Density', value: '0.05ml / Actuation' },
        { label: 'Dispersion Arc', value: '120° Micro-Cloud' },
      ],
    },
    {
      num: '03',
      tag: '03 / 04 • High-Density Extrait',
      title: '35% Oil Concentration Maceration',
      desc: 'Formulated at a radical 35% pure fragrance oil ratio. Aged undisturbed in toasted French Limousin oak barrels for six months, producing an intimate bond with skin chemistry and a 16-hour trail.',
      stats: [
        { label: 'Oil Density', value: '35% Pure Extrait' },
        { label: 'Oak Maturation', value: '180 Days' },
        { label: 'Sillage Trail', value: '16+ Hours' },
      ],
    },
    {
      num: '04',
      tag: '04 / 04 • Interactive 360° Studio',
      title: 'Inspect Every Facet in Real-Time 3D',
      desc: 'Drag to orbit the 3D flacon in 360 degrees. Switch between master bespoke editions and discover how light refracts through the crystal facets and amber heart.',
      stats: [
        { label: 'Interaction', value: '360° Orbit Drag' },
        { label: 'Custom Finishes', value: '3 Bespoke Editions' },
        { label: 'Authenticity', value: 'Numbered Plate' },
      ],
    },
  ];

  // Initialize Three.js Scene and Load 3D Model
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    threeRef.current.scene = scene;

    // 2. Camera Setup
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 32);
    threeRef.current.camera = camera;

    // 3. High Quality WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    threeRef.current.renderer = renderer;

    // 4. Procedural Studio Lighting Matrix
    const keyLight = new THREE.DirectionalLight(0xfff5e4, 3.5);
    keyLight.position.set(16, 20, 20);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdbe8ff, 4.8);
    rimLight.position.set(-18, 14, -20);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xe8ba78, 2.2);
    fillLight.position.set(0, -15, 12);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const auraLight = new THREE.PointLight(0xd4af37, 2.5, 30);
    auraLight.position.set(0, 2, 8);
    scene.add(auraLight);
    threeRef.current.pointLights.push(auraLight);

    // 5. Floating Ambient Dust Particle Swarm
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 40;
      posArray[i + 1] = (Math.random() - 0.5) * 40;
      posArray[i + 2] = (Math.random() - 0.5) * 30;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0xd4af37,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // 6. Root Transform Group
    const bottleRoot = new THREE.Group();
    scene.add(bottleRoot);
    threeRef.current.bottleRoot = bottleRoot;

    // Independent Group for Ball Cap
    const capGroup = new THREE.Group();
    bottleRoot.add(capGroup);
    threeRef.current.capGroup = capGroup;

    // 7. Load OBJ Model (/models/ball+cap.obj)
    const loader = new OBJLoader();
    loader.load(
      '/models/ball+cap.obj',
      (obj) => {
        const bbox = new THREE.Box3().setFromObject(obj);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 16 / maxDim;

        // Custom High-End Materials
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.93,
          opacity: 1,
          transparent: true,
          roughness: 0.04,
          metalness: 0.0,
          ior: 1.52,
          thickness: 1.4,
          specularIntensity: 1.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.03,
          envMapIntensity: 2.0,
        });

        const liquidMat = new THREE.MeshPhysicalMaterial({
          color: EDITIONS[0].liquidColor,
          emissive: EDITIONS[0].emissiveColor,
          emissiveIntensity: 0.35,
          transmission: 0.62,
          transparent: true,
          roughness: 0.08,
          metalness: 0.05,
          ior: 1.33,
        });

        const sprayMat = new THREE.MeshStandardMaterial({
          color: 0xdfba75,
          metalness: 0.96,
          roughness: 0.16,
          envMapIntensity: 2.2,
        });

        const capMat = new THREE.MeshStandardMaterial({
          color: EDITIONS[0].capColor,
          metalness: EDITIONS[0].capMetalness,
          roughness: 0.08,
          envMapIntensity: 2.5,
        });

        const strawMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.95,
          transparent: true,
          roughness: 0.05,
          ior: 1.49,
        });

        const meshesToReattach = [];

        obj.traverse((child) => {
          if (child.isMesh) {
            child.geometry.computeVertexNormals();

            if (child.name.includes('liquid')) {
              child.material = liquidMat;
              threeRef.current.liquidMesh = child;
            } else if (child.name.includes('bottle')) {
              child.material = glassMat;
              threeRef.current.bottleMesh = child;
            } else if (child.name.includes('spray')) {
              child.material = sprayMat;
              threeRef.current.sprayMesh = child;
            } else if (child.name.includes('Sphere')) {
              child.material = capMat;
              threeRef.current.capMesh = child;
              meshesToReattach.push(child);
            } else if (child.name.includes('Bézier') || child.name.includes('Curve')) {
              child.material = strawMat;
            } else {
              child.material = sprayMat;
            }
          }
        });

        obj.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor);
        obj.scale.set(scaleFactor, scaleFactor, scaleFactor);

        meshesToReattach.forEach((sphereMesh) => {
          capGroup.add(sphereMesh);
        });

        bottleRoot.add(obj);
        bottleRoot.position.set(0, -0.5, 0);
        bottleRoot.rotation.set(0.1, 0, 0);

        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('Error loading OBJ model:', err);
        setIsLoaded(true);
      }
    );

    // 8. Animation & Render Loop
    let animId;
    let clock = new THREE.Clock();

    const render = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const { mouse, bottleRoot, dragStart, orbitRotation, targetOrbitRotation, isDragging } = threeRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      orbitRotation.x += (targetOrbitRotation.x - orbitRotation.x) * 0.1;
      orbitRotation.y += (targetOrbitRotation.y - orbitRotation.y) * 0.1;

      if (dustParticles) {
        dustParticles.rotation.y = elapsed * 0.03;
        dustParticles.rotation.x = Math.sin(elapsed * 0.02) * 0.1;
      }

      if (bottleRoot) {
        if (isDragging || threeRef.current.inOrbitMode) {
          bottleRoot.rotation.y = orbitRotation.y;
          bottleRoot.rotation.x = orbitRotation.x + mouse.y * 0.2;
        }
      }

      if (auraLight) {
        auraLight.position.x = Math.sin(elapsed * 0.8) * 6;
        auraLight.position.y = 2 + Math.cos(elapsed * 0.6) * 3;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // 9. Resize Handling
    const handleResize = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Mouse Interaction on Canvas
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      threeRef.current.mouse.targetX = nx;
      threeRef.current.mouse.targetY = ny;

      if (threeRef.current.isDragging) {
        const deltaX = e.clientX - threeRef.current.dragStart.x;
        const deltaY = e.clientY - threeRef.current.dragStart.y;
        threeRef.current.targetOrbitRotation.y += deltaX * 0.01;
        threeRef.current.targetOrbitRotation.x += deltaY * 0.008;
        threeRef.current.dragStart.x = e.clientX;
        threeRef.current.dragStart.y = e.clientY;
      }
    };

    const handleMouseDown = (e) => {
      threeRef.current.isDragging = true;
      threeRef.current.dragStart = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      threeRef.current.isDragging = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const handleTouchMove = (e) => {
      if (e.touches.length > 0 && threeRef.current.isDragging) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - threeRef.current.dragStart.x;
        const deltaY = touch.clientY - threeRef.current.dragStart.y;
        threeRef.current.targetOrbitRotation.y += deltaX * 0.015;
        threeRef.current.targetOrbitRotation.x += deltaY * 0.01;
        threeRef.current.dragStart.x = touch.clientX;
        threeRef.current.dragStart.y = touch.clientY;
      }
    };
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        threeRef.current.isDragging = true;
        threeRef.current.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchEnd = () => {
      threeRef.current.isDragging = false;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, []);

  // Update Liquid & Cap Materials when user switches editions
  useEffect(() => {
    const edition = EDITIONS[selectedEdition];
    const { liquidMesh, capMesh } = threeRef.current;

    if (liquidMesh && liquidMesh.material) {
      gsap.to(liquidMesh.material.color, {
        r: ((edition.liquidColor >> 16) & 255) / 255,
        g: ((edition.liquidColor >> 8) & 255) / 255,
        b: (edition.liquidColor & 255) / 255,
        duration: 0.8,
        ease: 'power2.out',
      });
      gsap.to(liquidMesh.material.emissive, {
        r: ((edition.emissiveColor >> 16) & 255) / 255,
        g: ((edition.emissiveColor >> 8) & 255) / 255,
        b: (edition.emissiveColor & 255) / 255,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    if (capMesh && capMesh.material) {
      gsap.to(capMesh.material.color, {
        r: ((edition.capColor >> 16) & 255) / 255,
        g: ((edition.capColor >> 8) & 255) / 255,
        b: (edition.capColor & 255) / 255,
        duration: 0.8,
        ease: 'power2.out',
      });
      capMesh.material.metalness = edition.capMetalness;
    }
  }, [selectedEdition]);

  // GSAP ScrollTrigger Master Native Pinning
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=2600', // 2600px of smooth pinned scrub scroll
        pin: true,
        pinSpacing: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollPct(Math.round(p * 100));

          // Determine current active chapter
          if (p < 0.25) setActiveChapter(0);
          else if (p < 0.55) setActiveChapter(1);
          else if (p < 0.8) setActiveChapter(2);
          else setActiveChapter(3);

          const { bottleRoot, capGroup, camera } = threeRef.current;
          if (!bottleRoot || !camera) return;

          // Check if in 360° Orbit Mode
          threeRef.current.inOrbitMode = p >= 0.82;
          setIsOrbiting(p >= 0.82);

          if (p < 0.82) {
            const targetRotY = p * Math.PI * 2.2;
            const targetRotX = 0.08 + Math.sin(p * Math.PI * 2) * 0.12;
            const targetRotZ = Math.sin(p * Math.PI * 3) * 0.06;

            bottleRoot.rotation.y = targetRotY;
            bottleRoot.rotation.x = targetRotX;
            bottleRoot.rotation.z = targetRotZ;

            if (p < 0.25) {
              const localP = p / 0.25;
              camera.position.z = 32 - localP * 6;
              camera.position.y = -localP * 1;
            } else if (p < 0.55) {
              const localP = (p - 0.25) / 0.3;
              camera.position.z = 26 - localP * 7;
              camera.position.y = -1 + localP * 3.5;
            } else {
              const localP = (p - 0.55) / 0.27;
              camera.position.z = 19 + localP * 5;
              camera.position.y = 2.5 - localP * 2.5;
            }

            if (capGroup) {
              if (p >= 0.22 && p <= 0.6) {
                let capP = 0;
                if (p < 0.4) {
                  capP = (p - 0.22) / 0.18;
                } else if (p < 0.46) {
                  capP = 1;
                } else {
                  capP = 1 - (p - 0.46) / 0.14;
                }
                capP = Math.max(0, Math.min(1, capP));
                const floatY = Math.sin(capP * Math.PI * 0.5) * 6.8;
                capGroup.position.y = floatY;
                capGroup.rotation.y = p * 8;
                capGroup.rotation.z = Math.sin(p * 12) * 0.15;
              } else {
                capGroup.position.y = 0;
                capGroup.rotation.z = 0;
              }
            }
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = () => {
    const edition = EDITIONS[selectedEdition];
    dispatch(
      addToCart({
        id: edition.id,
        name: `Ediot Breeze — ${edition.name}`,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        price: edition.price,
        countInStock: 12,
        qty: 1,
      })
    );
    toast.success(`${edition.name} added to your private vault.`);
  };

  const currentCh = CHAPTERS[activeChapter];
  const currentEd = EDITIONS[selectedEdition];

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
      {/* Background Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${currentEd.accentColor}18 0%, rgba(10, 9, 8, 0.95) 70%, #050505 100%)`,
          pointerEvents: 'none',
          transition: 'background 0.8s ease',
        }}
      />

      {/* Top Header Badge & Telemetry Bar */}
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
          pointerEvents: 'none',
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
            }}
          >
            The Architecture of Sillage
          </span>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            360° Real-Time 3D Flacon Anatomy
          </span>
        </div>

        {/* Chapter Step Indicator Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto' }}>
          {CHAPTERS.map((ch, idx) => {
            const isActive = activeChapter === idx;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '980px',
                  background: isActive ? 'var(--color-gold)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#000000' : 'rgba(255,255,255,0.5)',
                  fontSize: '11px',
                  fontWeight: 700,
                  transition: 'all 0.4s ease',
                }}
              >
                <span>{ch.num}</span>
                {isActive && <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>Active</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D WebGL Canvas Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          cursor: isOrbiting ? 'grab' : 'default',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>

      {/* Floating Callout Hotspot Pins (During Phase 2 & 3) */}
      {activeChapter === 1 && (
        <div
          style={{
            position: 'absolute',
            top: '32%',
            left: '52%',
            zIndex: 8,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.6s ease',
          }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.75)',
              border: '1px solid var(--color-gold)',
              backdropFilter: 'blur(12px)',
              padding: '10px 18px',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 8px 32px rgba(212,175,55,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-gold)',
                boxShadow: '0 0 10px var(--color-gold)',
                animation: 'pulse 1.5s infinite',
              }}
            />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-gold)' }}>
                Acoustic Micro-Atomizer
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                0.05ml Precision Nozzle
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Side: Dynamic Chapter Editorial Narrative Card */}
      <div
        style={{
          position: 'absolute',
          left: '48px',
          bottom: '48px',
          maxWidth: '460px',
          zIndex: 10,
          background: 'rgba(18, 16, 14, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          {currentCh.tag}
        </div>

        <h3
          style={{
            fontSize: 'clamp(22px, 2.5vw, 28px)',
            fontWeight: 600,
            lineHeight: 1.25,
            marginBottom: '14px',
            color: '#FFFFFF',
          }}
        >
          {currentCh.title}
        </h3>

        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            lineHeight: 1.7,
            marginBottom: '24px',
          }}
        >
          {currentCh.desc}
        </p>

        {/* 3 Micro Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {currentCh.stats.map((st, i) => (
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

      {/* Right Side: Interactive Bespoke Edition Customizer & Vault Reserve CTA */}
      <div
        style={{
          position: 'absolute',
          right: '48px',
          bottom: '48px',
          width: '380px',
          zIndex: 10,
          background: 'rgba(18, 16, 14, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-gold)', fontWeight: 700 }}>
            Bespoke Edition Matrix
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: isOrbiting ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
              fontWeight: 600,
            }}
          >
            <FiRotateCw /> {isOrbiting ? '360° Drag Active' : 'Scroll or Drag'}
          </div>
        </div>

        {/* 3 Color / Scent Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {EDITIONS.map((ed, idx) => {
            const isSel = selectedEdition === idx;
            return (
              <button
                key={ed.id}
                onClick={() => setSelectedEdition(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: isSel ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSel ? '1px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: ed.accentColor,
                      boxShadow: isSel ? `0 0 10px ${ed.accentColor}` : 'none',
                      border: '2px solid rgba(255,255,255,0.4)',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>
                      {ed.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                      {ed.notes.split('•')[0]}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-gold)' }}>
                    ${ed.price}
                  </div>
                  {isSel && <FiCheck style={{ color: 'var(--color-gold)', fontSize: '14px' }} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scent Accord Notes */}
        <div
          style={{
            padding: '12px 16px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.7)',
            borderLeft: '2px solid var(--color-gold)',
          }}
        >
          <strong style={{ color: 'white', display: 'block', marginBottom: '2px' }}>
            Olfactory Matrix:
          </strong>
          {currentEd.notes}
        </div>

        {/* Add to Cart / Vault CTA */}
        <button
          onClick={handleAddToCart}
          style={{
            width: '100%',
            padding: '16px',
            background: 'var(--color-gold)',
            color: '#000000',
            border: 'none',
            borderRadius: '980px',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-gold-light)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-gold)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>Reserve Numbered Flacon • ${currentEd.price}</span>
          <FiArrowRight />
        </button>
      </div>

      {/* Scroll Progress Bar at Bottom */}
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
            width: `${scrollPct}%`,
            background: 'var(--color-gold)',
            borderRadius: '980px',
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </section>
  );
};

export default BottleScrollSection;
