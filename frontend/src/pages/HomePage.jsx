import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import LuxuryProductGrid from '../components/LuxuryProductGrid';
import HousePillarsSection from '../components/HousePillarsSection';
import NotesAccordion from '../components/NotesAccordion';
import EditorialStoryScroll from '../components/EditorialStoryScroll';
import TestimonialsSection from '../components/TestimonialsSection';
import VelocityShaderGallery from '../components/VelocityShaderGallery';
import LookbookSection from '../components/LookbookSection';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div style={{ background: 'var(--color-cream, #FDFCFA)', color: '#1D1D1F' }}>
      {/* 1. EDITORIAL BOTANICAL LUXURY HERO SECTION */}
      <HeroSection />

      {/* 2. THE GRAND FLACON VAULT: 24+ LUXURY PRODUCT GRID WITH 3D TILT */}
      <LuxuryProductGrid />

      {/* 3. OLFACTORY PYRAMID SECTION */}
      <section
        id="olfactory"
        style={{
          padding: '120px 0',
          background: 'var(--color-warm-white, #FFFBF7)',
          borderTop: '1px solid rgba(184, 149, 106, 0.2)',
          borderBottom: '1px solid rgba(184, 149, 106, 0.2)',
        }}
      >
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ maxWidth: '800px', marginBottom: '80px', textAlign: 'center', margin: '0 auto 80px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: '16px',
                color: '#B8956A',
                fontWeight: '700',
              }}
            >
              <span>✦</span>
              <span>The Olfactory Architecture</span>
              <span>✦</span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(32px, 4vw, 50px)',
                fontWeight: 700,
                color: '#1D1D1F',
                fontFamily: 'var(--font-display)',
                marginBottom: '20px',
                letterSpacing: '-0.02em',
              }}
            >
              A Fragrance That Leaves Your Signature Behind
            </h2>
            <p style={{ color: '#6E6E73', lineHeight: '1.75', fontSize: '16.5px' }}>
              Only For You is concentrated at 35% pure botanical extrait density. Crafted to adapt dynamically to your skin chemistry, revealing different accords throughout the day.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Top Notes */}
            <div
              style={{
                padding: '44px 36px',
                background: '#FFFFFF',
                border: '1px solid rgba(184, 149, 106, 0.25)',
                borderRadius: '24px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.04)',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B8956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18" />
                  <path d="M12 12l6.36-6.36" />
                  <path d="M12 12l6.36 6.36" />
                  <path d="M12 12L5.64 5.64" />
                  <path d="M12 12l-6.36 6.36" />
                </svg>
              </div>
              <h4 style={{ marginBottom: '10px', fontSize: '22px', color: '#1D1D1F', fontFamily: 'var(--font-display)' }}>
                Top Notes
              </h4>
              <p style={{ color: '#6E6E73', marginBottom: '16px', lineHeight: '1.6', fontSize: '14px' }}>
                Sweet Opening, Italian Bergamot, Crisp Calabrian Citrus & Sunlit Neroli
              </p>
              <div style={{ fontSize: '11px', color: '#B8956A', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                FIRST 15–30 MINUTES
              </div>
            </div>

            {/* Heart Notes */}
            <div
              style={{
                padding: '44px 36px',
                background: 'linear-gradient(135deg, rgba(184, 149, 106, 0.1) 0%, #FFFFFF 100%)',
                border: '1.5px solid rgba(184, 149, 106, 0.4)',
                borderRadius: '24px',
                boxShadow: '0 16px 40px rgba(184, 149, 106, 0.12)',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B8956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h4 style={{ marginBottom: '10px', fontSize: '22px', color: '#1D1D1F', fontFamily: 'var(--font-display)' }}>
                Heart Notes
              </h4>
              <p style={{ color: '#4A4A4E', marginBottom: '16px', lineHeight: '1.6', fontSize: '14px' }}>
                Grasse May Rose Centifolia, Madagascar Bourbon Vanilla, Lavender Absolu
              </p>
              <div style={{ fontSize: '11px', color: '#B8956A', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                2–6 HOURS DIFFUSION
              </div>
            </div>

            {/* Base Notes */}
            <div
              style={{
                padding: '44px 36px',
                background: '#FFFFFF',
                border: '1px solid rgba(184, 149, 106, 0.25)',
                borderRadius: '24px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.04)',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B8956A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <h4 style={{ marginBottom: '10px', fontSize: '22px', color: '#1D1D1F', fontFamily: 'var(--font-display)' }}>
                Base Notes
              </h4>
              <p style={{ color: '#6E6E73', marginBottom: '16px', lineHeight: '1.6', fontSize: '14px' }}>
                Warm Ambergris, Aged Mysore Sandalwood, Roasted Tonka & Cedar
              </p>
              <div style={{ fontSize: '11px', color: '#B8956A', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                12–16+ HOURS SILLAGE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOUSE PILLARS GSAP SCROLL SECTION */}
      <HousePillarsSection />

      {/* 5. MASTER INGREDIENTS ACCORDION */}
      <NotesAccordion />

      {/* 6. AWWWARDS SOTD EDITORIAL STORY SCROLL */}
      <EditorialStoryScroll />

      {/* 7. THREE.JS GSAP SCROLL-VELOCITY DISTORTION SHADER GALLERY */}
      <VelocityShaderGallery />

      {/* 8. CLIENT TESTIMONIALS GUILD */}
      <TestimonialsSection />

      {/* 9. EDITORIAL LOOKBOOK */}
      <LookbookSection />
    </div>
  );
};

export default HomePage;
