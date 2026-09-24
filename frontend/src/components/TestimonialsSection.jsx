import React, { useState } from 'react';
import { FiStar, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Elena Rostova',
    role: 'Fashion Director, Zurich',
    fragrance: 'Only For You (Extrait de Parfum)',
    rating: 5,
    title: '“Unbelievable 18-hour longevity without headache”',
    comment: 'I have worn high-end niche perfumes for 15 years, and nothing has generated compliments like Only For You. The Madagascar vanilla and tonka bean merge into this magnetic warm cloud that people notice the moment you walk into a room.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  },
  {
    id: 2,
    name: 'Marcus Sterling',
    role: 'Architect & Collector, London',
    fragrance: 'Velvet Midnight (Pure Perfume Oil)',
    rating: 5,
    title: '“The bottle is pure art, the juice is hypnotic”',
    comment: 'The craftsmanship of the French crystal flacon is magnificent. The scent itself starts with a dry, crisp Italian bergamot and transitions into a smoky, opulent amber that lasts well past midnight. Pure luxury.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: 3,
    name: 'Camille Dubois',
    role: 'Editorial Stylist, Paris',
    fragrance: 'Santorini Breeze (Eau de Parfum)',
    rating: 5,
    title: '“My permanent signature scent”',
    comment: 'It smells like golden Mediterranean sunlight captured in liquid glass. Extremely crisp, natural, zero synthetic screech. The sillage is elegant—never suffocating, always magnetic.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[activeIndex];

  return (
    <section style={{
      padding: '160px 0',
      background: 'var(--color-warm-white)',
      position: 'relative',
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '60px',
        }}>
          <div>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 600,
              marginBottom: '16px',
            }}>
              The Connoisseur Guild
            </div>
            <h2>Voices of the Maison</h2>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={prev}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '1px solid var(--color-black)',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-black)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-black)';
              }}
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={next}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '1px solid var(--color-black)',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-black)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-black)';
              }}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Testimonials Grid / Carousel Item */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '28px',
        }}>
          {TESTIMONIALS.map((t, idx) => {
            const isFeatured = idx === activeIndex;
            return (
              <div
                key={t.id}
                onClick={() => setActiveIndex(idx)}
                style={{
                  background: isFeatured ? 'white' : 'var(--color-cream)',
                  borderRadius: '24px',
                  padding: '40px',
                  border: isFeatured ? '1.5px solid var(--color-gold)' : '0.5px solid rgba(0,0,0,0.04)',
                  boxShadow: isFeatured ? '0 12px 48px rgba(184, 149, 106, 0.15)' : '0 2px 12px var(--color-soft-shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  cursor: 'pointer',
                }}
              >
                <div>
                  {/* Stars & Tag */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}>
                    <div style={{ display: 'flex', gap: '4px', color: 'var(--color-gold)' }}>
                      {[...Array(t.rating)].map((_, i) => (
                        <FiStar key={i} style={{ fill: 'var(--color-gold)' }} />
                      ))}
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-gold)',
                      background: 'rgba(184, 149, 106, 0.12)',
                      padding: '4px 10px',
                      borderRadius: '980px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <FiCheck /> Verified Patron
                    </span>
                  </div>

                  <h4 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', lineHeight: 1.3 }}>
                    {t.title}
                  </h4>

                  <p style={{
                    color: 'var(--color-charcoal)',
                    fontSize: '15px',
                    lineHeight: '1.7',
                    marginBottom: '28px',
                  }}>
                    {t.comment}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-black)' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-grey)' }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
