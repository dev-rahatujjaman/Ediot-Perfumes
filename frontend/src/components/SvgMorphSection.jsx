import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiSun, FiDroplet, FiClock, FiAward, FiPlay, FiPause, FiActivity } from 'react-icons/fi';

const PHASES = [
  {
    id: 1,
    num: '01',
    name: 'Dawn Botanical Harvest',
    shortName: 'Harvest',
    subtitle: '05:00 AM • Valley of Grasse',
    tag: 'Pre-Dawn Gather',
    desc: 'Hand-harvested in the misty pre-dawn valleys of Grasse, France before the Mediterranean sunrise. Picking during dawn dew captures volatile terpenes at their absolute peak molecular concentration.',
    origin: 'Plateau de Valensole, Grasse',
    ratio: '10,000 Petals → 1 Flacon',
    temperature: '12°C Ambient Dew',
    purity: '100% Organic Raw Absolute',
    color: '#E8C89B',
    accentGrad: 'linear-gradient(135deg, #F4DFC0 0%, #D4A86C 100%)',
    liquidLevel: 45, // percentage
    image: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=1200&q=80',
    icon: <FiSun />,
    stats: [
      { label: 'Harvest Window', value: '05:00 — 07:30 AM' },
      { label: 'Volatile Terpenes', value: '99.4% Intact' },
      { label: 'Elevation', value: '1,100m Alpine Slope' },
    ],
  },
  {
    id: 2,
    num: '02',
    name: 'Sub-Zero Supercritical Distillation',
    shortName: 'Extraction',
    subtitle: 'Zero-Heat Cold Molecular Isolation',
    tag: 'Supercritical Fluid',
    desc: 'Utilizing cold supercritical fluid technology at controlled sub-thermal pressures. Unlike industrial steam distillation which scorches delicate florals, cold extraction preserves the living bio-molecular fragrance.',
    origin: 'Alchemical Atelier, Grasse',
    ratio: '100% Solvent-Free Yield',
    temperature: '31°C Sub-Thermal',
    purity: '99.8% Bio-Molecular Fidelity',
    color: '#C59B63',
    accentGrad: 'linear-gradient(135deg, #E0B77D 0%, #9F7239 100%)',
    liquidLevel: 65,
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=1200&q=80',
    icon: <FiDroplet />,
    stats: [
      { label: 'Extraction Chamber', value: '73.8 Bar Controlled' },
      { label: 'Solvent Residue', value: '0.00% Pure' },
      { label: 'Molecular Purity', value: 'Haute Standard' },
    ],
  },
  {
    id: 3,
    num: '03',
    name: '180-Day Limousin Oak Maceration',
    shortName: 'Maceration',
    subtitle: 'Aged in Toasted French Oak Casks',
    tag: 'Vault Maturation',
    desc: 'The pure botanical elixir rests undisturbed in toasted French Limousin oak barrels for six months. The wood tannins and coumarin slowly marry with the Madagascar vanilla and warm amber resins.',
    origin: 'Limousin Oak Cask Vaults',
    ratio: '35% Pure Extrait Density',
    temperature: '16°C Cellar Vault',
    purity: 'Skin-Adaptive Matrix',
    color: '#9E6D38',
    accentGrad: 'linear-gradient(135deg, #B5844D 0%, #684118 100%)',
    liquidLevel: 82,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80',
    icon: <FiClock />,
    stats: [
      { label: 'Aging Duration', value: '180 Days Minimum' },
      { label: 'Extrait Density', value: '35% Pure Oil' },
      { label: 'Longevity Sillage', value: '16+ Hours' },
    ],
  },
  {
    id: 4,
    num: '04',
    name: 'Crystal Flacon & 24K Gold Seal',
    shortName: 'Flacon Vault',
    subtitle: 'Hand-Polished French Crystal Vessel',
    tag: 'Bespoke Bottling',
    desc: 'Each numbered edition is hand-filled into ultra-clarity heavy French optical crystal, sealed with an airtight inert argon layer and finished with a weighted 24K gold-plated magnetic zamak crest.',
    origin: 'Parisian Master Atelier',
    ratio: 'Individually Numbered flacons',
    temperature: 'Sealed Under Argon Gas',
    purity: 'Haute Parfumerie Certified',
    color: '#D4AF37',
    accentGrad: 'linear-gradient(135deg, #F3E0A3 0%, #AA8023 100%)',
    liquidLevel: 96,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80',
    icon: <FiAward />,
    stats: [
      { label: 'Vessel Material', value: 'Optical Crystal' },
      { label: 'Closure Mechanism', value: '24K Magnetic Zamak' },
      { label: 'Batch Integrity', value: 'Certified Vaulted' },
    ],
  },
];

const SvgMorphSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);
  const contentRef = useRef(null);
  const liquidPathRef = useRef(null);

  // Animated wave oscillation in the liquid chamber
  useEffect(() => {
    let animId;
    let t = 0;
    const animateWave = () => {
      t += 0.04;
      setWaveOffset(t);
      animId = requestAnimationFrame(animateWave);
    };
    animId = requestAnimationFrame(animateWave);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Auto-cycle through phases if playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PHASES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Transition animation on phase change
  const handleSelectPhase = (index) => {
    setActiveIdx(index);
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0.2, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  };

  const current = PHASES[activeIdx];

  // Dynamic SVG Wave calculation for the liquid vessel
  const calculateWavePath = (level, offset) => {
    const yBase = 320 - (level / 100) * 230; // map 0-100% to bottle height
    const w1 = Math.sin(offset) * 8;
    const w2 = Math.cos(offset * 0.8) * 6;
    const w3 = Math.sin(offset * 1.2) * 7;

    return `
      M 60,${yBase + w1}
      Q 110,${yBase - 12 + w2} 160,${yBase + w3}
      T 260,${yBase + w1}
      L 260,330
      Q 260,360 230,360
      L 90,360
      Q 60,360 60,330
      Z
    `;
  };

  return (
    <section style={{
      padding: '160px 0',
      background: 'var(--color-cream)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Accent Lines */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1280px',
        height: '100%',
        pointerEvents: 'none',
        borderLeft: '1px solid rgba(0,0,0,0.03)',
        borderRight: '1px solid rgba(0,0,0,0.03)',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '64px',
          flexWrap: 'wrap',
          gap: '24px',
        }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 700,
              marginBottom: '16px',
            }}>
              <FiActivity /> 04-Phase Alchemical Distillation
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', lineHeight: 1.1, marginBottom: '20px' }}>
              The Art of Molecular<br />Extraction Mastery
            </h2>
            <p className="text-large" style={{ color: 'var(--color-grey)', lineHeight: 1.7 }}>
              Witness how uncultivated wild essences are elevated into an ultra-dense 35% pure Extrait de Parfum through precision French alchemy.
            </p>
          </div>

          {/* Auto-Play Control Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '980px',
              background: isPlaying ? 'var(--color-black)' : 'var(--color-warm-white)',
              color: isPlaying ? 'var(--color-cream)' : 'var(--color-black)',
              border: '1px solid var(--color-beige)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px var(--color-soft-shadow)',
            }}
          >
            {isPlaying ? <FiPause /> : <FiPlay />}
            <span>{isPlaying ? 'Pause Protocol' : 'Auto Sequence'}</span>
          </button>
        </div>

        {/* Phase Navigation Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '48px',
        }}>
          {PHASES.map((phase, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <button
                key={phase.id}
                onClick={() => handleSelectPhase(idx)}
                style={{
                  padding: '24px 20px',
                  borderRadius: '20px',
                  background: isSelected ? 'var(--color-black)' : 'var(--color-warm-white)',
                  color: isSelected ? 'white' : 'var(--color-charcoal)',
                  border: isSelected ? '1px solid var(--color-black)' : '1px solid var(--color-beige)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  boxShadow: isSelected ? '0 12px 32px rgba(0,0,0,0.18)' : '0 2px 8px var(--color-soft-shadow)',
                }}
              >
                {/* Active Indicator Top Line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: isSelected ? phase.accentGrad : 'transparent',
                  transition: 'background 0.3s ease',
                }} />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: isSelected ? 'var(--color-gold-light)' : 'var(--color-gold)',
                  }}>
                    PHASE {phase.num}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    color: isSelected ? 'var(--color-gold-light)' : 'var(--color-grey)',
                  }}>
                    {phase.icon}
                  </span>
                </div>

                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: isSelected ? 'white' : 'var(--color-black)',
                }}>
                  {phase.shortName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Alchemical Showcase Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: '40px',
          alignItems: 'stretch',
        }}>
          {/* Left Column: Alchemical Extraction Vessel Chamber */}
          <div style={{
            background: 'radial-gradient(ellipse at top, #1c1a17 0%, #0c0b0a 100%)',
            borderRadius: '28px',
            padding: '48px 40px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {/* Ambient Inner Gold Aura */}
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${current.color}44 0%, transparent 70%)`,
              filter: 'blur(50px)',
              pointerEvents: 'none',
              transition: 'background 0.8s ease',
            }} />

            {/* Chamber Header & Live Telemetry */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}>
              <div>
                <span style={{
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold-light)',
                  fontWeight: 700,
                  background: 'rgba(184, 149, 106, 0.15)',
                  padding: '4px 12px',
                  borderRadius: '980px',
                }}>
                  Live Distillation Chamber
                </span>
                <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px', color: 'white' }}>
                  Extrait Density: {current.liquidLevel}%
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Temperature
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-gold-light)' }}>
                  {current.temperature}
                </div>
              </div>
            </div>

            {/* Visual Glass Alembic Vessel & Dynamic SVG Liquid Level */}
            <div style={{
              position: 'relative',
              height: '380px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '20px 0',
              zIndex: 2,
            }}>
              <svg viewBox="0 0 320 400" style={{ width: '100%', height: '100%', maxHeight: '380px' }}>
                <defs>
                  {/* Liquid Gradient */}
                  <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={current.color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#2c1a0c" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Glass Reflection Gradient */}
                  <linearGradient id="glassReflect" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
                    <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.05" />
                    <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.0" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* Glass Vessel Contour Outline */}
                {/* Neck & Cap */}
                <rect x="135" y="30" width="50" height="40" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                <rect x="125" y="15" width="70" height="15" rx="3" fill="var(--color-gold)" opacity="0.85" />

                {/* Main Crystal Vessel Body */}
                <path
                  d="M 135,70 L 135,110 L 60,200 Q 50,215 50,240 L 50,330 Q 50,370 90,370 L 230,370 Q 270,370 270,330 L 270,240 Q 270,215 260,200 L 185,110 L 185,70 Z"
                  fill="rgba(255, 255, 255, 0.03)"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="2"
                />

                {/* Dynamic Oscillating Liquid Wave Body */}
                <g clipPath="url(#vesselClip)">
                  <path
                    ref={liquidPathRef}
                    d={calculateWavePath(current.liquidLevel, waveOffset)}
                    fill="url(#liquidGrad)"
                    style={{ transition: 'fill 0.8s ease' }}
                  />
                </g>

                {/* Clip path to keep liquid inside vessel */}
                <clipPath id="vesselClip">
                  <path d="M 135,70 L 135,110 L 60,200 Q 50,215 50,240 L 50,330 Q 50,370 90,370 L 230,370 Q 270,370 270,330 L 270,240 Q 270,215 260,200 L 185,110 L 185,70 Z" />
                </clipPath>

                {/* Rising Golden Micro-Bubbles */}
                {[
                  { cx: 120, cy: 260 - ((waveOffset * 30) % 80), r: 3 },
                  { cx: 160, cy: 300 - ((waveOffset * 40 + 20) % 100), r: 4.5 },
                  { cx: 200, cy: 280 - ((waveOffset * 35 + 40) % 90), r: 2.5 },
                  { cx: 140, cy: 330 - ((waveOffset * 25 + 10) % 110), r: 3.5 },
                  { cx: 180, cy: 310 - ((waveOffset * 45 + 50) % 120), r: 4 },
                ].map((b, i) => (
                  <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="rgba(255, 235, 180, 0.7)" filter="drop-shadow(0 0 4px rgba(212,175,55,0.8))" />
                ))}

                {/* Glass Facet Reflection Overlay */}
                <path
                  d="M 135,70 L 135,110 L 60,200 Q 50,215 50,240 L 50,330 Q 50,370 90,370 L 230,370 Q 270,370 270,330 L 270,240 Q 270,215 260,200 L 185,110 L 185,70 Z"
                  fill="url(#glassReflect)"
                  pointerEvents="none"
                />

                {/* Measurement Markings on Glass */}
                <line x1="70" y1="230" x2="85" y2="230" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <text x="92" y="233" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="var(--font-text)">80% EXTRAIT</text>

                <line x1="70" y1="270" x2="85" y2="270" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <text x="92" y="273" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="var(--font-text)">50% RESONANCE</text>

                <line x1="70" y1="310" x2="85" y2="310" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <text x="92" y="313" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="var(--font-text)">25% ABSOLUTE</text>
              </svg>
            </div>

            {/* Chamber Footer Benchmark */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              position: 'relative',
              zIndex: 2,
            }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                Standard: <strong style={{ color: 'white' }}>French Extrait Protocol</strong>
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-gold-light)', fontWeight: 600 }}>
                {current.purity}
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Botanical Card & Telemetry */}
          <div
            ref={contentRef}
            style={{
              background: 'var(--color-warm-white)',
              borderRadius: '28px',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 32px var(--color-soft-shadow)',
              border: '1px solid var(--color-beige)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Botanical Details */}
            <div>
              {/* Image & Origin Pill Row */}
              <div style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                height: '240px',
                marginBottom: '32px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}>
                <img
                  src={current.image}
                  alt={current.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                }} />

                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '24px',
                  right: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  color: 'white',
                }}>
                  <div>
                    <span style={{
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--color-gold-light)',
                      fontWeight: 600,
                    }}>
                      Origin Atelier
                    </span>
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>
                      {current.origin}
                    </div>
                  </div>

                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 14px',
                    borderRadius: '980px',
                  }}>
                    {current.tag}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--color-gold)',
                fontWeight: 700,
                marginBottom: '8px',
              }}>
                {current.subtitle}
              </div>

              <h3 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px', lineHeight: 1.25 }}>
                {current.name}
              </h3>

              <p style={{
                color: 'var(--color-charcoal)',
                fontSize: '16px',
                lineHeight: 1.7,
                marginBottom: '32px',
              }}>
                {current.desc}
              </p>
            </div>

            {/* Technical 3-Column Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              paddingTop: '28px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}>
              {current.stats.map((st, i) => (
                <div key={i} style={{
                  background: 'var(--color-cream)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid var(--color-beige)',
                }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-grey)', marginBottom: '4px' }}>
                    {st.label}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-black)' }}>
                    {st.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SvgMorphSection;
