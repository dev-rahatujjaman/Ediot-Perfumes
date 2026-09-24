import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCheckCircle, FiShield, FiFeather, FiLayers } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    num: '01',
    tag: 'Raw Botanical Purity',
    title: 'Zero Synthetic Dilution',
    desc: 'Every batch is formulated with organically certified natural absolute essences. No synthetic fixatives, no artificial stabilizers—only pure, breathing botanical energy.',
    metric: '100% Pure Absolutes',
    icon: <FiFeather />,
    image: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&q=80',
  },
  {
    num: '02',
    tag: 'Unrivaled Density',
    title: '35% Extrait Concentration',
    desc: 'While commercial fragrances settle between 12% and 18% concentration, Ediot Breeze formulas are strictly blended at 35% pure extrait, delivering effortless 16+ hour longevity.',
    metric: '35% Pure Extrait',
    icon: <FiLayers />,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
  },
  {
    num: '03',
    tag: 'Architectural Vessels',
    title: 'Optically Pure French Crystal',
    desc: 'Hand-cut and polished by century-old French glassmakers, our flacons are heavy in hand and sealed with custom magnetic gold-plated zamak closures.',
    metric: 'Hand-Polished Crystal',
    icon: <FiShield />,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
  },
  {
    num: '04',
    tag: 'Bespoke Artistry',
    title: 'Master Nose Compositions',
    desc: 'Crafted over three years in Grasse and Paris, our fragrances are designed to evolve dynamically on human skin rather than fading into a generic drydown.',
    metric: 'Grasse Heritage',
    icon: <FiCheckCircle />,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
  },
];

const HousePillarsSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards || cards.length === 0) return;

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0.2, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 0.5,
          },
        }
      );
    });
  }, []);

  return (
    <section
      id="maison"
      ref={sectionRef}
      style={{
        padding: '140px 0',
        background: 'var(--color-cream, #FDFCFA)',
        color: '#1D1D1F',
        position: 'relative',
        borderTop: '1px solid rgba(184, 149, 106, 0.2)',
        borderBottom: '1px solid rgba(184, 149, 106, 0.2)',
      }}
    >
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <div style={{ maxWidth: '720px', marginBottom: '80px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#B8956A',
            fontWeight: 700,
            marginBottom: '16px',
          }}>
            <span>✦</span>
            <span>The House Standards</span>
            <span>✦</span>
          </div>
          <h2 style={{
            color: '#1D1D1F',
            marginBottom: '20px',
            fontSize: 'clamp(32px, 4.5vw, 54px)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}>
            The Pillars of<br />Haute Parfumerie
          </h2>
          <p style={{ color: '#6E6E73', fontSize: '16.5px', lineHeight: '1.75' }}>
            We reject the shortcuts of mass commercial production. Every bottle represents an uncompromised commitment to heritage, longevity, and timeless craft.
          </p>
        </div>

        {/* Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '28px',
        }}>
          {PILLARS.map((pillar, idx) => (
            <div
              key={pillar.num}
              ref={(el) => (cardsRef.current[idx] = el)}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: 'clamp(28px, 4vw, 44px) clamp(20px, 3vw, 36px)',
                border: '1px solid rgba(184, 149, 106, 0.25)',
                boxShadow: '0 10px 36px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(184, 149, 106, 0.6)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(184, 149, 106, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(184, 149, 106, 0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 36px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '28px',
                }}>
                  <span style={{
                    fontSize: '36px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)',
                    color: '#B8956A',
                    opacity: 0.9,
                  }}>
                    {pillar.num}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#B8956A',
                    background: 'rgba(184, 149, 106, 0.1)',
                    border: '1px solid rgba(184, 149, 106, 0.25)',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontWeight: 700,
                  }}>
                    {pillar.tag}
                  </span>
                </div>

                <h3 style={{
                  color: '#1D1D1F',
                  fontSize: '24px',
                  marginBottom: '14px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                }}>
                  {pillar.title}
                </h3>

                <p style={{
                  color: '#6E6E73',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  marginBottom: '28px',
                }}>
                  {pillar.desc}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '20px',
                borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              }}>
                <span style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#B8956A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  {pillar.icon} {pillar.metric}
                </span>
                <span style={{ color: '#8E8E93', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  House Benchmark
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HousePillarsSection;
