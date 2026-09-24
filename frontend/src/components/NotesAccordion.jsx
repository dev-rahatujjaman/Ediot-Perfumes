import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const INGREDIENTS = [
  {
    id: 1,
    name: 'Calabrian Bergamot',
    category: 'Top Accord • Bright Opening',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M12 12l6.36-6.36" />
        <path d="M12 12l6.36 6.36" />
        <path d="M12 12L5.64 5.64" />
        <path d="M12 12l-6.36 6.36" />
      </svg>
    ),
    origin: 'Reggio Calabria, Southern Italy',
    harvest: 'December — February (Hand-Cold-Pressed)',
    desc: 'Known as the "Green Gold" of Calabria, our bergamot is cold-expressed without chemical solvents, yielding an effervescent, sparkling citrus aroma with delicate floral undertones.',
    sensory: 'Sparkling, luminous, awakening opening that cuts cleanly through cold evening air.',
  },
  {
    id: 2,
    name: 'Madagascar Bourbon Vanilla',
    category: 'Heart Accord • Gourmand Warmth',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    origin: 'Sava Region, Madagascar',
    harvest: 'Hand-Pollinated & Sun-Cured for 6 Months',
    desc: 'Unlike synthetic vanillin, our whole Bourbon vanilla beans are macerated slowly to release over 250 distinct flavor molecules, creating a creamy, smoky, balsamic sweetness.',
    sensory: 'Velvety, intoxicating warmth that wraps around pulse points and deepens over 12 hours.',
  },
  {
    id: 3,
    name: 'French High-Altitude Lavender',
    category: 'Heart Accord • Parisian Elegance',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    origin: 'Plateau de Valensole, Grasse, France',
    harvest: 'July Midday Harvest at 1,100m Altitude',
    desc: 'Harvested exclusively at high altitude where intense ultraviolet exposure prompts the flowers to produce higher concentrations of linalyl acetate, giving a clean, powdery, soothing heart.',
    sensory: 'Clean, noble floral structure that tempers the sweet opening and brings understated luxury.',
  },
  {
    id: 4,
    name: 'Toasted Tonka Bean & Warm Amber',
    category: 'Base Accord • Tenacious Drydown',
    iconSvg: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    origin: 'Amazon Basin & Limousin Cask Vaults',
    harvest: 'Wild-Foraged & Roasted to Release Coumarin',
    desc: 'Carefully roasted over almond wood to unlock rich crystalline coumarin, then married with warm botanical amber resins to create an unbreakable bond with human skin chemistry.',
    sensory: 'Hypnotic, warm, powdery sillage that leaves an unforgettable presence long after you exit.',
  },
];

const NotesAccordion = () => {
  const [openId, setOpenId] = useState(1);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="notes" style={{
      padding: '160px 0',
      background: 'var(--color-cream)',
      position: 'relative',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '80px',
          alignItems: 'start',
        }}>
          {/* Left Column Sticky Intro */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 600,
              marginBottom: '16px',
            }}>
              Master Ingredients
            </div>
            <h2 style={{ marginBottom: '24px' }}>
              The World's Most<br />Coveted Essences
            </h2>
            <p className="text-large" style={{ color: 'var(--color-grey)', lineHeight: '1.7', marginBottom: '32px' }}>
              We partner directly with family-owned sustainable estates across Grasse, Madagascar, and Calabria to source ingredients of unprecedented purity.
            </p>

            <div style={{
              background: 'var(--color-warm-white)',
              borderRadius: '20px',
              padding: '28px',
              border: '0.5px solid rgba(0, 0, 0, 0.04)',
              boxShadow: '0 2px 16px var(--color-soft-shadow)',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-black)' }}>
                Sustainable Heritage Guarantee
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-grey)', lineHeight: '1.6' }}>
                Every botanical is fair-trade harvested and tracked with origin batch certificates included in your flacon's presentation vault.
              </p>
            </div>
          </div>

          {/* Right Column Accordions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {INGREDIENTS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--color-warm-white)',
                    borderRadius: '20px',
                    border: isOpen ? '1px solid var(--color-gold)' : '0.5px solid rgba(0, 0, 0, 0.04)',
                    boxShadow: isOpen ? '0 8px 32px rgba(184, 149, 106, 0.12)' : '0 2px 12px var(--color-soft-shadow)',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  <button
                    onClick={() => toggle(item.id)}
                    style={{
                      width: '100%',
                      padding: '28px 32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(184, 149, 106, 0.12)', color: 'var(--color-gold)' }}>
                        {item.iconSvg}
                      </span>
                      <div>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '4px' }}>
                          {item.category}
                        </div>
                        <h4 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-black)' }}>
                          {item.name}
                        </h4>
                      </div>
                    </div>

                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isOpen ? 'var(--color-black)' : 'var(--color-cream)',
                      color: isOpen ? 'white' : 'var(--color-black)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      transition: 'var(--transition-fast)',
                    }}>
                      {isOpen ? <FiMinus /> : <FiPlus />}
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 32px 32px 32px',
                      borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                      paddingTop: '24px',
                    }}>
                      <p style={{
                        color: 'var(--color-charcoal)',
                        fontSize: '16px',
                        lineHeight: '1.7',
                        marginBottom: '24px',
                      }}>
                        {item.desc}
                      </p>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        background: 'var(--color-cream)',
                        borderRadius: '16px',
                        padding: '20px',
                        fontSize: '13px',
                      }}>
                        <div>
                          <div style={{ color: 'var(--color-grey)', marginBottom: '4px' }}>Origin</div>
                          <div style={{ fontWeight: 600, color: 'var(--color-black)' }}>{item.origin}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--color-grey)', marginBottom: '4px' }}>Harvesting Protocol</div>
                          <div style={{ fontWeight: 600, color: 'var(--color-black)' }}>{item.harvest}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotesAccordion;
