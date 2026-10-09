import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiSun, FiMoon, FiCompass, FiArrowUpRight, FiStar, FiDroplet } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

/**
 * GrasseVertigoParallax
 *
 * Inspired by the multi-scene SVG Vertigo Parallax engine.
 * Depicts the diurnal cycle of the Grasse botanical harvest:
 * 1. L'Aube Dorée (Golden Sunlit Dawn over Centifolia Rose Hills)
 * 2. Le Crépuscule des Alambics (Copper Still Twilight in Provence)
 * 3. La Nuit d’Obsidienne (Midnight Star Vault & Crystal Flacon Extraction)
 *
 * Implemented with ultra-lightweight GPU-optimized vector paths and GSAP ScrollTrigger.
 */

const GrasseVertigoParallax = () => {
  const navigate = useNavigate();
  const triggerRef = useRef(null);
  const pinTargetRef = useRef(null);
  const svgRef = useRef(null);

  // HUD refs for direct DOM updates (0 React re-renders during scroll)
  const timeHudRef = useRef(null);
  const stageHudRef = useRef(null);
  const progressFillRef = useRef(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const pinTarget = pinTargetRef.current;
    const svg = svgRef.current;
    if (!trigger || !pinTarget || !svg) return;

    const ctx = gsap.context(() => {
      const speed = 75;

      // Master Vertigo Timeline pinned over 320vh scroll distance
      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinTarget,
          pinSpacing: false,
          scrub: 1.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Direct HUD telemetry updates without React re-renders
            if (progressFillRef.current) {
              progressFillRef.current.style.width = `${(p * 100).toFixed(1)}%`;
            }

            if (timeHudRef.current && stageHudRef.current) {
              if (p < 0.35) {
                timeHudRef.current.textContent = '05:45 AM • L’Aube Dorée';
                stageHudRef.current.textContent = 'Centifolia Rose Dawn Harvest';
              } else if (p < 0.7) {
                timeHudRef.current.textContent = '08:15 PM • Le Crépuscule';
                stageHudRef.current.textContent = 'Copper Alembic Maceration';
              } else {
                timeHudRef.current.textContent = '03:30 AM • Nuit d’Obsidienne';
                stageHudRef.current.textContent = '35% Pure Extrait Sealed';
              }
            }
          },
        },
      });

      // ─── SCENE 1: Golden Dawn Vertigo Parallax ───
      // Mountain ridges pull apart at differential parallax speeds
      masterTL
        .to('#grasse-sun', { attr: { cy: 380, r: 180 }, ease: 'power1.inOut' }, 0)
        .to('#grasse-bg-grad stop:nth-child(1)', { attr: { 'stop-color': '#9E5B32' } }, 0)
        .to('#grasse-bg-grad stop:nth-child(2)', { attr: { 'stop-color': '#5A2A38' } }, 0)
        .to('#grasse-bg-grad stop:nth-child(3)', { attr: { 'stop-color': '#1E1226' } }, 0)

        // Hills 1: Foreground and Midground vertigo shift
        .to('#h-dawn-1', { y: speed * 4.2, x: speed * 1.2, scale: 1.05, ease: 'power1.in' }, 0)
        .to('#h-dawn-2', { y: speed * 3.4, x: -speed * 0.8, ease: 'power1.in' }, 0)
        .to('#h-dawn-3', { y: speed * 2.5, x: speed * 1.5 }, 0.05)
        .to('#h-dawn-4', { y: speed * 1.8, x: -speed * 1.2 }, 0.05)
        .to('#h-dawn-5', { y: speed * 1.2, x: speed * 0.5 }, 0.05)

        // Botanical Mist Clouds drifting outward
        .to('#mist-left', { x: -350, opacity: 0 }, 0)
        .to('#mist-right', { x: 350, opacity: 0 }, 0)
        .to('#swallow-birds', { x: 500, y: -220, opacity: 0, ease: 'power2.out' }, 0.05)

        // Scene 1 Title fade-out
        .to('#scene1-title-group', { y: -180, opacity: 0, ease: 'power2.in' }, 0.1);

      // ─── SCENE 2: Twilight Alambic Hills Rise ───
      masterTL
        .fromTo('#scene2-group', { opacity: 0, y: 150 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.28)
        .fromTo('#h-twilight-1', { y: 350 }, { y: 0, ease: 'power1.out' }, 0.3)
        .fromTo('#h-twilight-2', { y: 450 }, { y: 0, ease: 'power1.out' }, 0.35)
        .fromTo('#h-twilight-3', { y: 550 }, { y: 0, ease: 'power1.out' }, 0.4)
        .to('#scene2-group', { y: -150, opacity: 0, ease: 'power2.in' }, 0.65);

      // ─── SCENE 3: Midnight Stars & Cosmic Crystal Summit ───
      masterTL
        .fromTo('#scene3-group', { opacity: 0, visibility: 'visible' }, { opacity: 1, duration: 0.3 }, 0.6)
        .fromTo('#stars-constellation', { opacity: 0, y: 100 }, { opacity: 0.9, y: 0, ease: 'power2.out' }, 0.65)
        .fromTo('#h-night-back', { y: 400 }, { y: -100, ease: 'power1.out' }, 0.65)
        .fromTo('#h-night-mid', { y: 550 }, { y: -60, ease: 'power1.out' }, 0.68)
        .fromTo('#h-night-front', { y: 700 }, { y: 0, ease: 'power1.out' }, 0.72)

        // Falling Gold Shooting Star
        .fromTo('#shooting-star', { x: 300, y: -150, opacity: 0 }, { x: -450, y: 250, opacity: 1, ease: 'power3.inOut' }, 0.75)
        .to('#shooting-star', { opacity: 0, duration: 0.1 }, 0.92)

        // Final Sovereign Crystal Bottle & Callout reveal
        .fromTo('#sovereign-flacon-svg', { scale: 0.6, y: 120, opacity: 0 }, { scale: 1, y: 0, opacity: 1, ease: 'back.out(1.4)' }, 0.78)
        .fromTo('#night-cta-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.85);

    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={triggerRef}
      id="grasse-vertigo-terroir"
      className="vertigo-supersection"
      style={{
        position: 'relative',
        height: '350vh', // Provides generous scroll room for the 3 distinct diurnal scenes
        background: '#070609',
        color: '#FDFCFA',
        overflow: 'visible',
      }}
      aria-label="The Grasse Terroir: Vertigo Parallax Diurnal Journey"
    >
      <style>{`
        /* ─── Pinned Viewport Container ─── */
        .vertigo-pin-viewport {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #060508;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .vertigo-svg {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          pointer-events: none;
        }

        /* ─── Top Telemetry HUD ─── */
        .vertigo-hud-top {
          position: absolute;
          top: 36px;
          left: 0;
          right: 0;
          padding: 0 44px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 30;
          pointer-events: none;
        }

        .vertigo-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 999px;
          background: rgba(14, 10, 8, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.35);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #E6CA9E;
          font-weight: 700;
        }

        .vertigo-time-tag {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(14, 10, 8, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vertigo-time-tag span.time-val {
          color: #F5D791;
          font-weight: 700;
        }

        /* ─── Bottom Navigation HUD ─── */
        .vertigo-hud-bottom {
          position: absolute;
          bottom: 30px;
          left: 0;
          right: 0;
          padding: 0 44px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 30;
          pointer-events: none;
        }

        .vertigo-progress-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255, 245, 225, 0.65);
          background: rgba(14, 10, 8, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 7px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .vertigo-progress-bar {
          width: 140px;
          height: 2px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .vertigo-progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #D4AF37, #FFF);
          transition: width 0.05s linear;
        }

        .vertigo-stage-status {
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #E6CA9E;
          background: rgba(14, 10, 8, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 7px 18px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.25);
        }

        /* ─── Interactive Summit CTA Callout ─── */
        .vertigo-summit-cta {
          position: absolute;
          bottom: 90px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          background: rgba(16, 12, 9, 0.88);
          border: 1px solid rgba(212, 175, 55, 0.4);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(184, 134, 45, 0.25);
          border-radius: 28px;
          padding: 22px 36px;
          z-index: 40;
          pointer-events: auto;
        }

        .vertigo-summit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border-radius: 999px;
          background: linear-gradient(135deg, #F5D791 0%, #B8862D 100%);
          color: #1A1208;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .vertigo-summit-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 6px 24px rgba(245, 215, 145, 0.5);
        }

        @media (max-width: 900px) {
          .vertigo-hud-top,
          .vertigo-hud-bottom {
            padding: 0 20px;
          }
          .vertigo-summit-cta {
            padding: 18px 24px;
            bottom: 75px;
            width: 90%;
            max-width: 360px;
          }
          .vertigo-stage-hide-mob {
            display: none;
          }
        }
      `}</style>

      {/* ─── PINNED PARALLAX STAGE ─── */}
      <div ref={pinTargetRef} className="vertigo-pin-viewport">
        {/* Top Telemetry HUD */}
        <div className="vertigo-hud-top">
          <div className="vertigo-badge">
            <FiCompass />
            <span>Le Terroir de Grasse</span>
            <FiCompass />
          </div>

          <div className="vertigo-time-tag">
            <FiSun style={{ color: '#F5D791' }} />
            <span ref={timeHudRef} className="time-val">05:45 AM • L’Aube Dorée</span>
          </div>
        </div>

        {/* Bottom Progress HUD */}
        <div className="vertigo-hud-bottom">
          <div className="vertigo-progress-wrap">
            <span>Diurnal Traverse</span>
            <div className="vertigo-progress-bar">
              <div ref={progressFillRef} className="vertigo-progress-fill" style={{ width: '0%' }} />
            </div>
          </div>

          <div ref={stageHudRef} className="vertigo-stage-status vertigo-stage-hide-mob">
            Centifolia Rose Dawn Harvest
          </div>
        </div>

        {/* ─── MASTER MULTI-SCENE VERTIGO SVG ─── */}
        <svg
          ref={svgRef}
          className="vertigo-svg"
          viewBox="0 0 1000 650"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Atmospheric Gradients */}
            <radialGradient id="grasse-bg-grad" cx="500" cy="80" r="600" gradientUnits="userSpaceOnUse">
              <stop offset="0.05" stopColor="#F5C54E" />
              <stop offset="0.25" stopColor="#E28E58" />
              <stop offset="0.6" stopColor="#7E3A52" />
              <stop offset="1.0" stopColor="#1B1226" />
            </radialGradient>

            {/* Sun Core Glow */}
            <radialGradient id="sun-core-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF5" />
              <stop offset="35%" stopColor="#F5D791" />
              <stop offset="70%" stopColor="#E59845" />
              <stop offset="100%" stopColor="#E59845" stopOpacity="0" />
            </radialGradient>

            {/* Dawn Mountain Terracotta / Rose Gold Layers */}
            <linearGradient id="g-dawn-1" x1="0" y1="280" x2="0" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E89B7B" />
              <stop offset="100%" stopColor="#8C4456" />
            </linearGradient>

            <linearGradient id="g-dawn-2" x1="1000" y1="320" x2="0" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D2776E" />
              <stop offset="100%" stopColor="#5E2C48" />
            </linearGradient>

            <linearGradient id="g-dawn-3" x1="0" y1="360" x2="1000" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A84E62" />
              <stop offset="100%" stopColor="#3C1A38" />
            </linearGradient>

            <linearGradient id="g-dawn-4" x1="500" y1="400" x2="500" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6C2E4E" />
              <stop offset="100%" stopColor="#221028" />
            </linearGradient>

            <linearGradient id="g-dawn-5" x1="0" y1="460" x2="0" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3A1732" />
              <stop offset="100%" stopColor="#120818" />
            </linearGradient>

            {/* Twilight Ridge Gradients */}
            <linearGradient id="g-twi-1" x1="0" y1="340" x2="1000" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4A3468" />
              <stop offset="100%" stopColor="#201438" />
            </linearGradient>

            <linearGradient id="g-twi-2" x1="0" y1="400" x2="1000" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#31224E" />
              <stop offset="100%" stopColor="#150C24" />
            </linearGradient>

            <linearGradient id="g-twi-3" x1="0" y1="470" x2="1000" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1D1230" />
              <stop offset="100%" stopColor="#08040F" />
            </linearGradient>

            {/* Night Alpine Gradients */}
            <linearGradient id="g-night-sky" x1="0" y1="0" x2="0" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#08060F" />
              <stop offset="40%" stopColor="#140E26" />
              <stop offset="75%" stopColor="#221638" />
              <stop offset="100%" stopColor="#0A0612" />
            </linearGradient>

            <linearGradient id="g-night-front" x1="0" y1="420" x2="0" y2="650" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#161026" />
              <stop offset="100%" stopColor="#040206" />
            </linearGradient>

            <linearGradient id="flacon-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF2D1" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A671E" />
            </linearGradient>
          </defs>

          {/* ─── BASE SKY BACKGROUND ─── */}
          <rect id="grasse-sky-rect" width="1000" height="650" fill="url(#grasse-bg-grad)" />

          {/* ─── CELESTIAL SUN (Dips down during scroll) ─── */}
          <circle id="grasse-sun" cx="500" cy="110" r="110" fill="url(#sun-core-grad)" />

          {/* ─── MIST CLOUDS (Drift apart on scroll) ─── */}
          <g id="mist-layers" fill="#FFF7EE" opacity="0.35">
            <path
              id="mist-left"
              d="M-50,260 Q120,200 280,250 Q420,300 560,260 L560,330 L-50,330 Z"
            />
            <path
              id="mist-right"
              d="M480,250 Q650,210 820,260 Q940,290 1060,250 L1060,330 L480,330 Z"
            />
          </g>

          {/* ─── PROVENCE SWALLOW BIRDS (Fly across dawn sky) ─── */}
          <g id="swallow-birds" fill="#2E1624">
            <path d="M180,180 Q192,168 205,182 Q218,168 230,180 Q215,175 205,190 Q195,175 180,180 Z" transform="scale(0.8)" />
            <path d="M250,140 Q260,130 272,142 Q284,130 294,140 Q281,136 272,148 Q263,136 250,140 Z" transform="scale(0.7)" />
            <path d="M310,165 Q318,157 328,166 Q338,157 346,165 Q335,162 328,172 Q321,162 310,165 Z" transform="scale(0.6)" />
          </g>

          {/* ─── SCENE 1: DAWN GRASSE HILLS (Vertigo Differential Pull) ─── */}
          <g id="scene1-hills">
            {/* Distant Alpine Crest */}
            <path
              id="h-dawn-5"
              d="M-20,380 L80,330 L220,360 L380,310 L520,350 L680,290 L850,340 L1020,310 L1020,650 L-20,650 Z"
              fill="url(#g-dawn-1)"
            />
            {/* Mid-Distance Terraces */}
            <path
              id="h-dawn-4"
              d="M-20,410 Q150,350 320,390 Q500,430 680,360 Q860,390 1020,360 L1020,650 L-20,650 Z"
              fill="url(#g-dawn-2)"
            />
            {/* Centifolia Ridge Left */}
            <path
              id="h-dawn-3"
              d="M-20,450 Q180,390 400,470 Q620,530 840,440 L1020,490 L1020,650 L-20,650 Z"
              fill="url(#g-dawn-3)"
            />
            {/* Grasse Rose Slope Right */}
            <path
              id="h-dawn-2"
              d="M1020,460 Q780,410 520,490 Q300,560 60,520 L-20,540 L-20,650 L1020,650 Z"
              fill="url(#g-dawn-4)"
            />
            {/* Immediate Foreground Valley Slope */}
            <path
              id="h-dawn-1"
              d="M-20,530 Q220,480 480,540 Q750,590 1020,520 L1020,650 L-20,650 Z"
              fill="url(#g-dawn-5)"
            />
          </g>

          {/* Scene 1 Hero Callout Typography in SVG */}
          <g id="scene1-title-group">
            <text
              x="500"
              y="280"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="var(--font-display, 'Neue Montreal', sans-serif)"
              fontSize="48"
              fontWeight="700"
              letterSpacing="0.08em"
            >
              L’AUBE DORÉE
            </text>
            <text
              x="500"
              y="315"
              textAnchor="middle"
              fill="#F5D791"
              fontFamily="var(--font-text, sans-serif)"
              fontSize="14"
              fontWeight="600"
              letterSpacing="0.3em"
            >
              VALLEY OF CENTIFOLIA ROSES • 05:45 AM
            </text>
          </g>

          {/* ─── SCENE 2: TWILIGHT CRÉPUSCULE HILLS (Rises up during scroll) ─── */}
          <g id="scene2-group" opacity="0">
            <path
              id="h-twilight-3"
              d="M-20,380 Q250,310 550,370 Q800,420 1020,350 L1020,650 L-20,650 Z"
              fill="url(#g-twi-1)"
            />
            <path
              id="h-twilight-2"
              d="M1020,420 Q700,360 420,440 Q200,510 -20,460 L-20,650 L1020,650 Z"
              fill="url(#g-twi-2)"
            />
            <path
              id="h-twilight-1"
              d="M-20,490 Q280,440 600,510 Q850,560 1020,480 L1020,650 L-20,650 Z"
              fill="url(#g-twi-3)"
            />
            <text
              x="500"
              y="320"
              textAnchor="middle"
              fill="#FFF"
              fontFamily="var(--font-display, 'Neue Montreal', sans-serif)"
              fontSize="42"
              fontWeight="700"
              letterSpacing="0.1em"
            >
              LE CRÉPUSCULE DES ALAMBICS
            </text>
            <text
              x="500"
              y="350"
              textAnchor="middle"
              fill="#D4AF37"
              fontFamily="var(--font-text, sans-serif)"
              fontSize="13"
              letterSpacing="0.28em"
              fontWeight="600"
            >
              SLOW LOW-TEMPERATURE VACUUM DISTILLATION
            </text>
          </g>

          {/* ─── SCENE 3: MIDNIGHT OBSIDIAN & CRYSTAL SUMMIT ─── */}
          <g id="scene3-group" style={{ visibility: 'hidden' }}>
            {/* Deep Night Backdrop */}
            <rect width="1000" height="650" fill="url(#g-night-sky)" />

            {/* Twinkling Constellation Stars */}
            <g id="stars-constellation" fill="#FFF">
              <circle cx="150" cy="80" r="1.5" opacity="0.8" />
              <circle cx="280" cy="120" r="2.2" opacity="0.9" />
              <circle cx="420" cy="60" r="1.2" opacity="0.7" />
              <circle cx="580" cy="110" r="1.8" opacity="0.85" />
              <circle cx="720" cy="70" r="2.5" opacity="0.95" />
              <circle cx="850" cy="130" r="1.4" opacity="0.75" />
              <circle cx="210" cy="190" r="1.8" opacity="0.8" />
              <circle cx="360" cy="220" r="1.3" opacity="0.65" />
              <circle cx="640" cy="180" r="2.0" opacity="0.9" />
              <circle cx="790" cy="210" r="1.5" opacity="0.75" />
              <circle cx="490" cy="40" r="2.8" fill="#F5D791" opacity="1" />
              <circle cx="920" cy="90" r="1.6" opacity="0.7" />
              <circle cx="80" cy="160" r="1.2" opacity="0.6" />
            </g>

            {/* Falling Gold Comet Trail */}
            <g id="shooting-star" opacity="0">
              <line x1="680" y1="60" x2="600" y2="120" stroke="url(#flacon-gold)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="600" cy="120" r="3.5" fill="#FFFDF5" />
            </g>

            {/* Night Ridges */}
            <path
              id="h-night-back"
              d="M-20,380 L180,310 L420,370 L650,290 L880,360 L1020,300 L1020,650 L-20,650 Z"
              fill="#181228"
            />
            <path
              id="h-night-mid"
              d="M1020,430 Q750,370 480,440 Q240,510 -20,450 L-20,650 L1020,650 Z"
              fill="#100C1C"
            />
            <path
              id="h-night-front"
              d="M-20,500 Q260,450 500,520 Q740,570 1020,490 L1020,650 L-20,650 Z"
              fill="url(#g-night-front)"
            />

            {/* Sovereign Flacon Silhouette on the Summit */}
            <g id="sovereign-flacon-svg" transform="translate(450, 240)">
              {/* Bottle Halo */}
              <circle cx="50" cy="90" r="110" fill="url(#sun-core-grad)" opacity="0.4" />
              {/* Gold Magnetic Cap */}
              <rect x="36" y="10" width="28" height="26" rx="4" fill="url(#flacon-gold)" stroke="#FFF" strokeWidth="0.8" />
              {/* Bottle Neck Collar */}
              <rect x="42" y="36" width="16" height="12" fill="#E6CA9E" />
              {/* Crystal Vessel Body */}
              <rect x="15" y="48" width="70" height="95" rx="8" fill="#140E20" stroke="url(#flacon-gold)" strokeWidth="2" />
              {/* Inner Extrait Liquid Level */}
              <rect x="22" y="65" width="56" height="70" rx="4" fill="url(#flacon-gold)" opacity="0.35" />
              {/* Front Plate Emblem */}
              <rect x="28" y="75" width="44" height="42" rx="3" fill="#0A0612" stroke="#E6CA9E" strokeWidth="0.8" />
              <text x="50" y="94" textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="700" letterSpacing="0.1em">EDIOT</text>
              <text x="50" y="105" textAnchor="middle" fill="#D4AF37" fontSize="5.5" letterSpacing="0.15em">EXTRAIT</text>
            </g>
          </g>
        </svg>

        {/* ─── SCENE 3 NIGHT CTA CALLOUT OVERLAY ─── */}
        <div id="night-cta-card" className="vertigo-summit-cta" style={{ opacity: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: '#D4AF37', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>
            <FiStar />
            <span>Nuit d’Obsidienne • 35% Extrait Sealed</span>
            <FiStar />
          </div>

          <h3 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#FFF', letterSpacing: '-0.02em', margin: 0 }}>
            The 2026 Grasse Harvest Reserve
          </h3>

          <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', maxWidth: '440px', lineHeight: 1.5, margin: 0 }}>
            Distilled from volatile early-dawn Centifolia petals and aged under Provence starlight in Limousin oak barrels.
          </p>

          <button
            onClick={() => {
              const el = document.getElementById('fragrances');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else navigate('/');
            }}
            className="vertigo-summit-btn"
          >
            <FiDroplet />
            <span>Acquire Harvest Reserve</span>
            <FiArrowUpRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default GrasseVertigoParallax;
