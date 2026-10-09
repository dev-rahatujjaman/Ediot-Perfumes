import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight, FiCompass, FiStar, FiDroplet } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

/**
 * 6 Curated, Uncongested Haute Parfumerie Frames
 * Perfectly balanced across left, right, and center-bottom so the giant EDIOT typography breathes.
 */
const TUNNEL_FRAMES = [
  {
    id: 1,
    title: 'Centifolia Petal Harvest',
    tag: 'N° 01 · 04:30 AM GRASSE',
    src: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1000&q=85',
    alt: 'May Rose Centifolia Botanical Harvest',
    className: 'ft-card-left-bottom',
  },
  {
    id: 2,
    title: 'Crystal Glass Annealing',
    tag: 'N° 02 · 480G MINERAL CRYSTAL',
    src: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1000&q=85',
    alt: 'Luminous Golden Glass Reflection',
    className: 'ft-card-left-top',
  },
  {
    id: 3,
    title: 'Only For You Sovereign',
    tag: 'N° 03 · 35% EXTRAIT DENSITY',
    src: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1000&q=85',
    alt: 'French Crystal Bottle Flacon',
    className: 'ft-card-right-mid',
  },
  {
    id: 4,
    title: 'Vintage Mysore Santal',
    tag: 'N° 04 · 30-YR MACERATION',
    src: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1000&q=85',
    alt: 'Velvet Sandalwood Bottle on Stone',
    className: 'ft-card-right-bottom',
  },
  {
    id: 5,
    title: 'Oud Royale Oak Vaults',
    tag: 'N° 05 · LIMOUSIN OAK AGING',
    src: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000&q=85',
    alt: 'Amber Perfume Vessel with Light Shadows',
    className: 'ft-card-center-left',
  },
  {
    id: 6,
    title: 'The Sovereign Master Cru',
    tag: 'N° 06 · 2026 PRIVATE RESERVE',
    src: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1000&q=85',
    alt: 'Master Black and Gold Perfume Bottle',
    isHero: true,
    className: 'ft-card-hero',
  },
];

const ParallaxFlaconTunnel = () => {
  const navigate = useNavigate();
  const tunnelWrapperRef = useRef(null);
  const bgPhotoRef = useRef(null);
  const imgCardsRef = useRef([]);
  const brandTitleRef = useRef(null);
  const heroCardRef = useRef(null);

  useEffect(() => {
    const tunnel = tunnelWrapperRef.current;
    const cards = imgCardsRef.current.filter(Boolean);
    const brand = brandTitleRef.current;
    const heroCard = heroCardRef.current;
    const bgPhoto = bgPhotoRef.current;

    if (!tunnel || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // 3D Perspective Fly-Through Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: tunnel,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 1.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Background gentle cinematic zoom
      if (bgPhoto) {
        tl.to(
          bgPhoto,
          {
            scale: 1.15,
            y: -40,
            ease: 'none',
          },
          0
        );
      }

      // Fly images through perspective camera (z: 2200 + i * 400)
      tl.to(
        cards,
        {
          z: (i) => 2100 + i * 420,
          opacity: (i) => (i === cards.length - 1 ? 1 : 0),
          ease: 'power1.inOut',
          stagger: {
            each: 0.05,
          },
        },
        0
      );

      // Subtle 3D tilting on images
      cards.forEach((card, i) => {
        const tiltX = (i % 2 === 0 ? 1 : -1) * (6 + (i % 3) * 3);
        const tiltY = (i % 3 === 0 ? -1 : 1) * (8 + (i % 2) * 4);
        tl.to(
          card,
          {
            rotationX: tiltX,
            rotationY: tiltY,
            ease: 'none',
          },
          0
        );
      });

      // Brand typography micro-motion & letter-spacing morph
      if (brand) {
        tl.fromTo(
          brand,
          {
            letterSpacing: '0.18em',
            scale: 0.92,
            opacity: 0.5,
          },
          {
            letterSpacing: '-0.05em',
            scale: 1.06,
            opacity: 0.95,
            ease: 'power2.out',
          },
          0
        );
      }

      // Final hero frame reveal
      if (heroCard) {
        tl.fromTo(
          heroCard,
          { opacity: 0, scale: 0.85, y: 35 },
          { opacity: 1, scale: 1, y: 0, ease: 'power2.out', duration: 0.4 },
          0.72
        );
      }
    }, tunnelWrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="spatial-tunnel-expedition"
      className="flacon-tunnel-supersection"
      style={{
        background: '#070605',
        color: '#FDFCFA',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* ─── INTRO SECTION ─── */
        .ft-intro-section {
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 80px 24px 60px;
          position: relative;
          background: radial-gradient(circle at 50% 60%, rgba(184, 134, 45, 0.16) 0%, transparent 70%);
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }

        .ft-intro-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 999px;
          background: rgba(26, 18, 10, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.35);
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #E6CA9E;
          font-weight: 700;
          margin-bottom: 28px;
          backdrop-filter: blur(12px);
        }

        .ft-intro-title {
          font-family: var(--font-display, 'Neue Montreal', sans-serif);
          font-size: clamp(3.5rem, 8.5vw, 9rem);
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: #FFF;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .ft-intro-title span.gold {
          background: linear-gradient(135deg, #FFFFFF 0%, #F5D791 40%, #B8862D 85%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ft-intro-sub {
          max-width: 620px;
          font-size: clamp(15px, 1.4vw, 19px);
          line-height: 1.6;
          color: rgba(235, 230, 220, 0.72);
          margin-bottom: 38px;
          font-weight: 300;
          letter-spacing: -0.01em;
        }

        .ft-intro-scroll-hint {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #D4AF37;
          font-weight: 600;
          animation: ftFloat 2.4s ease-in-out infinite;
        }

        .ft-intro-scroll-pill {
          width: 22px;
          height: 36px;
          border-radius: 20px;
          border: 1.5px solid rgba(212, 175, 55, 0.5);
          display: flex;
          justify-content: center;
          padding-top: 6px;
        }

        .ft-intro-scroll-dot {
          width: 4px;
          height: 7px;
          border-radius: 3px;
          background: #E6CA9E;
          animation: ftScrollWheel 2s ease-in-out infinite;
        }

        @keyframes ftScrollWheel {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(14px); opacity: 0; }
        }

        @keyframes ftFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        /* ─── 3D PERSPECTIVE TUNNEL WRAPPER ─── */
        .ft-tunnel-wrapper {
          position: relative;
          height: 100vh;
          width: 100%;
          background: #060504;
          perspective: 2500px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* HIGH QUALITY LUXURY ATELIER BACKGROUND PHOTO */
        .ft-tunnel-bg-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
          opacity: 0.65;
          filter: contrast(1.1) brightness(0.9);
          pointer-events: none;
          z-index: 1;
          will-change: transform;
        }

        /* Ambient caustics vignette */
        .ft-tunnel-vignette {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 65% 55% at 50% 50%, rgba(184, 134, 45, 0.12) 0%, transparent 70%),
            radial-gradient(circle at 50% 50%, transparent 45%, rgba(6, 5, 4, 0.85) 85%, #060504 100%);
          pointer-events: none;
          z-index: 2;
        }

        /* ─── BRAND TYPOGRAPHY OVERLAY (DIFFERENCE BLEND) ─── */
        .ft-brand-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          z-index: 20;
          user-select: none;
        }

        .ft-brand-overlay span.giant-stroke {
          font-family: var(--font-display, 'Neue Montreal', sans-serif);
          font-size: clamp(5.5rem, 19vw, 24rem);
          font-weight: 900;
          letter-spacing: -0.06em;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 2.2px rgba(255, 255, 255, 0.7);
          mix-blend-mode: difference;
          line-height: 0.85;
          text-align: center;
        }

        .ft-brand-overlay span.sub-hologram {
          font-size: clamp(10px, 1.4vw, 14px);
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.75);
          mix-blend-mode: difference;
          font-weight: 600;
          margin-top: 16px;
        }

        /* ─── UNCONGESTED 3D IMAGE CARDS ─── */
        .ft-card {
          position: absolute;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 0, 0, 0.5);
          will-change: transform, opacity;
          transform-style: preserve-3d;
          border: 1px solid rgba(212, 175, 55, 0.35);
          background: #110E0A;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .ft-card:hover {
          border-color: rgba(245, 215, 145, 0.85);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(212, 175, 55, 0.3);
        }

        .ft-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: contrast(1.05) saturate(1.05);
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .ft-card:hover img {
          transform: scale(1.06);
        }

        .ft-card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 18px;
          background: linear-gradient(to top, rgba(7, 6, 5, 0.94) 0%, rgba(7, 6, 5, 0.5) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          gap: 3px;
          pointer-events: none;
        }

        .ft-card-tag {
          font-size: 8.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #D4AF37;
          font-weight: 700;
        }

        .ft-card-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #FFF;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        /* ─── UNCONGESTED ASYMMETRICAL POSITIONS ─── */
        /* Top center is completely clear so typography can breathe! */

        /* 1. Far Left Botanical (Bottom) */
        .ft-card-left-bottom {
          height: 42vh;
          width: calc(42vh * 0.72);
          left: 5%;
          bottom: 14%;
          z-index: 6;
        }

        /* 2. Left Upper Flacon (Shifted far left, away from center) */
        .ft-card-left-top {
          height: 32vh;
          width: calc(32vh * 0.72);
          left: 14%;
          top: 10%;
          z-index: 7;
        }

        /* 3. Far Right Sovereign (Mid) */
        .ft-card-right-mid {
          height: 40vh;
          width: calc(40vh * 0.7);
          right: 6%;
          bottom: 30%;
          z-index: 7;
        }

        /* 4. Right Lower Maceration (Bottom) */
        .ft-card-right-bottom {
          height: 32vh;
          width: calc(32vh * 0.72);
          right: 20%;
          bottom: 10%;
          z-index: 8;
        }

        /* 5. Center-Left Oak Aging (Bottom) */
        .ft-card-center-left {
          height: 36vh;
          width: calc(36vh * 0.72);
          left: 32%;
          bottom: 12%;
          z-index: 9;
        }

        /* 6. Center Hero Bottle */
        .ft-card-hero {
          height: 34vh;
          width: calc(34vh * 0.74);
          left: 52%;
          bottom: 8rem;
          transform: translateX(-50%);
          z-index: 15;
          box-shadow: 0 35px 90px rgba(0, 0, 0, 0.95), 0 0 60px rgba(212, 175, 55, 0.4);
          border: 1.5px solid #F5D791;
        }

        /* Hero Floating Callout Box */
        .ft-hero-callout {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 25;
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(18, 14, 10, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(212, 175, 55, 0.4);
          padding: 10px 24px;
          border-radius: 999px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(212, 175, 55, 0.2);
          white-space: nowrap;
        }

        .ft-hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 999px;
          background: linear-gradient(135deg, #F5D791 0%, #B8862D 100%);
          color: #1A1208;
          font-weight: 700;
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ft-hero-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 4px 18px rgba(245, 215, 145, 0.5);
        }

        @media (max-width: 900px) {
          .ft-card-left-bottom { left: 2%; bottom: 10%; height: 32vh; width: calc(32vh * 0.72); }
          .ft-card-left-top { left: 5%; top: 6%; height: 26vh; width: calc(26vh * 0.72); }
          .ft-card-right-mid { right: 2%; bottom: 25%; height: 32vh; width: calc(32vh * 0.7); }
          .ft-card-center-left { left: 25%; bottom: 8%; height: 28vh; width: calc(28vh * 0.72); }
          .ft-hero-callout {
            flex-direction: column;
            gap: 8px;
            padding: 12px 18px;
            bottom: 1.2rem;
          }
        }
      `}</style>

      {/* ─── 2. 3D PERSPECTIVE FLY-THROUGH TUNNEL ─── */}
      <div ref={tunnelWrapperRef} className="ft-tunnel-wrapper">
        {/* HIGH RESOLUTION LUXURY ATELIER BACKGROUND */}
        <img
          ref={bgPhotoRef}
          src="/images/flacon-tunnel-bg.jpg"
          alt="Maison Ediot Perfume Atelier Laboratory"
          className="ft-tunnel-bg-photo"
          loading="lazy"
        />

        <div className="ft-tunnel-vignette" />

        {/* Giant Hollow Brand Overlay (Difference Blend) */}
        <div className="ft-brand-overlay">
          <span ref={brandTitleRef} className="giant-stroke">
            EDIOT.
          </span>
          <span className="sub-hologram">
            MAISON DE PARFUM · GRASSE & PARIS
          </span>
        </div>

        {/* 6 Perfectly Spaced, Uncongested Luxury Panels */}
        {TUNNEL_FRAMES.map((item, idx) => {
          return (
            <div
              key={item.id}
              ref={(el) => (imgCardsRef.current[idx] = el)}
              className={`ft-card ${item.className}`}
            >
              <img src={item.src} alt={item.alt} loading="lazy" />
              <div className="ft-card-overlay">
                <span className="ft-card-tag">{item.tag}</span>
                <span className="ft-card-title">{item.title}</span>
              </div>
            </div>
          );
        })}

        {/* Ending Hero Callout at bottom of tunnel */}
        <div ref={heroCardRef} className="ft-hero-callout">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCompass style={{ color: '#D4AF37' }} />
            <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FFF' }}>
              The 2026 Sovereign Extrait Vault
            </span>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('fragrances');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else navigate('/');
            }}
            className="ft-hero-btn"
          >
            <span>Explore Collection</span>
            <FiArrowUpRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ParallaxFlaconTunnel;
