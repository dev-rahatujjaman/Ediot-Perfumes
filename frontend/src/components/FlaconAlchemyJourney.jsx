import React, { useState } from 'react';
import {
  FiDroplet,
  FiAward,
  FiSun,
  FiShoppingBag,
  FiCheck,
  FiLayers,
  FiShield,
  FiCompass,
  FiEye,
  FiFeather,
  FiClock,
  FiArrowRight
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const ALCHEMY_STAGES = [
  {
    id: 'stage-1',
    num: '01',
    badge: 'Raw Botanical Essences',
    name: 'Pre-Dawn Harvest',
    subtitle: 'Grasse Centifolia & Calabrian Bergamot',
    location: 'Private Domain Slopes, Grasse, France',
    timeframe: '04:30 AM — 06:15 AM Daily',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&q=85',
    accentColor: '#B8956A',
    glowColor: 'rgba(184, 149, 106, 0.2)',
    description:
      'Centifolia rose petals and hand-selected bergamot are plucked exclusively in the fragile pre-dawn twilight before sunlight evaporates delicate essential mono-terpenes.',
    specs: [
      { label: 'Yield Ratio', value: '1,000 Petals / Drop' },
      { label: 'Harvest Window', value: 'First 45 Mins' },
      { label: 'Purity Level', value: '100% Organically Certified' },
      { label: 'Aromatic Volatility', value: 'Uncompromised' },
    ],
    alchemyNote:
      'Gathered in wicker hampers lined with raw silk to prevent thermal bruising of the flower petals.',
  },
  {
    id: 'stage-2',
    num: '02',
    badge: 'Molecular Extraction',
    name: 'Fractional Cold-Distillation',
    subtitle: 'Zero-Heat Cryogenic Extraction',
    location: 'Atelier de Chimie & Alchimie, Paris',
    timeframe: '18°C Controlled Vacuum',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&q=85',
    accentColor: '#2E6F40',
    glowColor: 'rgba(46, 111, 64, 0.2)',
    description:
      'By employing state-of-the-art fractional cold-distillation at 18°C, we capture high-frequency top note esters that conventional high-heat steam distillation burns away.',
    specs: [
      { label: 'Concentration', value: '32% – 36% Pure Extrait' },
      { label: 'Extraction Temp', value: '18°C Vacuum Pressure' },
      { label: 'Synthetic Fixatives', value: '0% Clean Formula' },
      { label: 'Top Note Retention', value: '99.4% Preserved' },
    ],
    alchemyNote:
      'Preserves the hyper-realistic dewy scent of living blooms as if smelled directly in the garden.',
  },
  {
    id: 'stage-3',
    num: '03',
    badge: 'French Master Glassmaking',
    name: 'Crystal Vessel Annealing',
    subtitle: 'Mouth-Blown Normandy Crystal & 24K Gold',
    location: 'Normandy Artisan Crystalworks, France',
    timeframe: '1,400°C Crucible Furnace',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=85',
    accentColor: '#B8956A',
    glowColor: 'rgba(184, 149, 106, 0.25)',
    description:
      'Each flacon is individually mouth-blown from heavyweight mineral crystal by master French glassblowers, annealed over 72 hours, and fitted with a 24K gold engraved collar.',
    specs: [
      { label: 'Glass Mass', value: '480g Ultra-Heavy Crystal' },
      { label: 'Collar Finish', value: '24-Karat Gold Plated' },
      { label: 'Optical Purity', value: 'Museum Grade Glass' },
      { label: 'Numbering', value: 'Individually Serialized' },
    ],
    alchemyNote:
      'Weighted base creates a sensory haptic ritual, stabilizing temperature fluctuations.',
  },
  {
    id: 'stage-4',
    num: '04',
    badge: 'Maison Aging Vault',
    name: 'Sovereign 90-Day Maceration',
    subtitle: 'Oak & Dark Vault Maturation',
    location: 'Underground Cellars, Place Vendôme',
    timeframe: '90 Consecutive Days',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=85',
    accentColor: '#A47D4C',
    glowColor: 'rgba(164, 125, 76, 0.2)',
    description:
      'The pure extrait rests in light-sealed obsidian glass carboys in underground limestone vaults for 90 days. Accords fuse into a multi-layered, lingering trail.',
    specs: [
      { label: 'Sillage Longevity', value: '16+ Hours on Skin' },
      { label: 'Maturation Time', value: '90 Days in Darkness' },
      { label: 'Diffusion Radius', value: '3 Meters Projection' },
      { label: 'Batch Allocation', value: 'Limited 500 Flacons' },
    ],
    alchemyNote:
      'Allows rare resins, aged woods, and floral notes to harmonize into a singular olfactory melody.',
  },
];

const MASTER_EDITIONS = [
  {
    id: '1',
    name: 'Morning Bloom',
    subtitle: 'Solar Bergamot & Crisp Coffee Blossom',
    concentration: '32% Extrait',
    price: 185,
    volume: '50ML',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    color: '#B8956A',
    notes: 'Italian Bergamot • Neroli Petals • White Ambergris',
  },
  {
    id: '2',
    name: 'Velvet Santal',
    subtitle: 'Aged Mysore Sandalwood & Bourbon Amber',
    concentration: '34% Extrait',
    price: 210,
    volume: '50ML',
    badge: 'Private Reserve',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    color: '#A47D4C',
    notes: 'Mysore Sandalwood • Madagascar Vanilla • Bourbon Resin',
  },
  {
    id: '3',
    name: 'Grasse Rose Noire',
    subtitle: 'Centifolia Rose & Midnight Smoked Oud',
    concentration: '30% Extrait',
    price: 195,
    volume: '50ML',
    badge: 'Maison Exclusive',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    color: '#B66E7C',
    notes: 'May Rose Centifolia • Smoked Oud • Black Saffron',
  },
  {
    id: '4',
    name: 'Imperial Ambergris',
    subtitle: 'Floating Marine Amber & Florentine Iris',
    concentration: '36% Extrait',
    price: 245,
    volume: '50ML',
    badge: 'Grand Extrait',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
    color: '#C49746',
    notes: 'Wild Sea Ambergris • Orris Root • Cashmere Musk',
  },
];

const FlaconAlchemyJourney = () => {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [selectedEdition, setSelectedEdition] = useState(MASTER_EDITIONS[0]);
  const [selectedSize, setSelectedSize] = useState('50ML');
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  const currentStage = ALCHEMY_STAGES[activeStageIdx];

  const sizePriceMultiplier = {
    '50ML': 1,
    '100ML': 1.6,
    '10ML': 0.35,
  };

  const currentPrice = Math.round(selectedEdition.price * sizePriceMultiplier[selectedSize]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: `${selectedEdition.id}-${selectedSize.toLowerCase()}`,
        name: `Ediot Breeze - ${selectedEdition.name} (${selectedSize})`,
        image: selectedEdition.image,
        price: currentPrice,
        countInStock: 10,
        qty: 1,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  return (
    <section
      id="alchemy"
      style={{
        position: 'relative',
        background: 'var(--color-cream, #FDFCFA)',
        color: '#1D1D1F',
        padding: '100px 0 120px',
        borderTop: '1px solid rgba(184, 149, 106, 0.2)',
        borderBottom: '1px solid rgba(184, 149, 106, 0.2)',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1360px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 64px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 22px',
              borderRadius: '999px',
              background: 'rgba(184, 149, 106, 0.1)',
              border: '1px solid rgba(184, 149, 106, 0.3)',
              color: '#B8956A',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            <span>✦</span>
            <span>Haute Extraction & Formulation Alchemy</span>
            <span>✦</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 54px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#1D1D1F',
              fontFamily: 'var(--font-display)',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            The Four Sacred Stages of <span style={{ color: '#B8956A', fontStyle: 'italic' }}>Extraction</span>
          </h2>

          <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#6E6E73', margin: '0 auto', maxWidth: '680px' }}>
            From pre-dawn Mediterranean harvests to 90 days of subterranean cask maturation, each flacon represents
            uncompromised alchemical purity and artisanal French craftsmanship.
          </p>
        </div>

        {/* 4 Interactive Stage Navigation Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '48px',
          }}
          className="stage-tabs-grid"
        >
          {ALCHEMY_STAGES.map((stage, idx) => {
            const isActive = activeStageIdx === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageIdx(idx)}
                style={{
                  padding: '20px 20px',
                  borderRadius: '20px',
                  background: isActive
                    ? '#FFFFFF'
                    : 'rgba(0, 0, 0, 0.02)',
                  border: isActive
                    ? '1.5px solid #B8956A'
                    : '1px solid rgba(0, 0, 0, 0.06)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  boxShadow: isActive
                    ? '0 12px 30px rgba(184, 149, 106, 0.15)'
                    : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: isActive ? '#B8956A' : '#8E8E93',
                      letterSpacing: '0.12em',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    STAGE {stage.num}
                  </span>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isActive ? '#B8956A' : 'rgba(0,0,0,0.1)',
                      boxShadow: isActive ? '0 0 10px #B8956A' : 'none',
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: isActive ? '#1D1D1F' : '#6E6E73',
                    marginBottom: '4px',
                  }}
                >
                  {stage.name}
                </div>
                <div style={{ fontSize: '11.5px', color: '#8E8E93', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {stage.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Master Stage Details & Interactive Allocation Chamber */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '40px',
            alignItems: 'stretch',
            marginBottom: '72px',
          }}
          className="stage-details-grid"
        >
          {/* Left Stage Visual & Technical Matrix */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(184, 149, 106, 0.3)',
              borderRadius: '28px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(0,0,0,0.04)',
            }}
          >
            <div>
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#B8956A',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: 'rgba(184, 149, 106, 0.1)',
                    border: '1px solid rgba(184, 149, 106, 0.3)',
                  }}
                >
                  {currentStage.badge}
                </span>

                <span style={{ fontSize: '12px', color: '#6E6E73', fontWeight: 600 }}>
                  {currentStage.location}
                </span>
              </div>

              <h3
                style={{
                  fontSize: 'clamp(26px, 2.5vw, 36px)',
                  fontWeight: 700,
                  color: '#1D1D1F',
                  marginBottom: '10px',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {currentStage.name}
              </h3>

              <div style={{ fontSize: '13px', color: '#B8956A', fontWeight: 600, marginBottom: '18px' }}>
                {currentStage.subtitle} • {currentStage.timeframe}
              </div>

              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#6E6E73', marginBottom: '28px' }}>
                {currentStage.description}
              </p>

              {/* 4 Metric Specs Matrix */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '14px',
                  marginBottom: '28px',
                }}
              >
                {currentStage.specs.map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid rgba(184, 149, 106, 0.2)',
                      borderRadius: '16px',
                      padding: '14px 18px',
                    }}
                  >
                    <div style={{ fontSize: '10.5px', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                      {spec.label}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1D1D1F' }}>
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note Capsule */}
            <div
              style={{
                background: 'rgba(184, 149, 106, 0.08)',
                borderLeft: '3px solid #B8956A',
                padding: '14px 18px',
                borderRadius: '0 12px 12px 0',
                fontSize: '12.5px',
                lineHeight: 1.6,
                color: '#4A4A4E',
              }}
            >
              <strong style={{ color: '#1D1D1F' }}>Olfactory Master’s Log:</strong> {currentStage.alchemyNote}
            </div>
          </div>

          {/* Right Stage Visual Showcase */}
          <div
            style={{
              position: 'relative',
              borderRadius: '28px',
              overflow: 'hidden',
              minHeight: '440px',
              border: '1.5px solid rgba(184, 149, 106, 0.3)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            }}
          >
            <img
              src={currentStage.image}
              alt={currentStage.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.8s ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '32px',
                color: 'white',
              }}
            >
              <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F4E4BA', fontWeight: 700, marginBottom: '6px' }}>
                Stage 0{activeStageIdx + 1} Documentation
              </div>
              <h4 style={{ fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                {currentStage.name}
              </h4>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                {currentStage.location}
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Master Edition Allocation Drawer */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid rgba(184, 149, 106, 0.3)',
            borderRadius: '28px',
            padding: '36px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '28px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              paddingBottom: '20px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#B8956A', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
                Reserve Directly From Extraction Batch
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1D1D1F', margin: 0, fontFamily: 'var(--font-display)' }}>
                Select Master Creation For Private Reservation
              </h3>
            </div>

            {/* Size Selector */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['10ML', '50ML', '100ML'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: selectedSize === size ? '#1D1D1F' : 'rgba(0, 0, 0, 0.04)',
                    color: selectedSize === size ? '#FFFFFF' : '#4A4A4E',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Edition Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '32px',
            }}
            className="edition-reserve-grid"
          >
            {MASTER_EDITIONS.map((edition) => {
              const isSelected = selectedEdition.id === edition.id;
              const edPrice = Math.round(edition.price * sizePriceMultiplier[selectedSize]);

              return (
                <div
                  key={edition.id}
                  onClick={() => setSelectedEdition(edition)}
                  style={{
                    padding: '20px',
                    borderRadius: '20px',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(184, 149, 106, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)'
                      : 'rgba(0, 0, 0, 0.02)',
                    border: isSelected
                      ? '1.5px solid #B8956A'
                      : '1px solid rgba(0, 0, 0, 0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected ? '0 8px 24px rgba(184, 149, 106, 0.15)' : 'none',
                  }}
                >
                  <div style={{ height: '140px', borderRadius: '14px', overflow: 'hidden', marginBottom: '14px', background: '#F6F3EE' }}>
                    <img
                      src={edition.image}
                      alt={edition.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#B8956A', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {edition.badge}
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1D1D1F', marginBottom: '4px' }}>
                    {edition.name}
                  </h4>
                  <div style={{ fontSize: '11px', color: '#6E6E73', marginBottom: '12px' }}>
                    {edition.concentration}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1D1D1F' }}>
                    ${edPrice} <span style={{ fontSize: '11px', color: '#8E8E93' }}>USD</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reserve CTA Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '14px', color: '#6E6E73' }}>
                Reserving <strong style={{ color: '#1D1D1F' }}>{selectedEdition.name}</strong> ({selectedSize}) •
                Numbered Batch #{Math.floor(100 + activeStageIdx * 45)}/500
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                padding: '16px 36px',
                borderRadius: '999px',
                background: added
                  ? 'linear-gradient(135deg, #2E6F40 0%, #1E4E2C 100%)'
                  : 'linear-gradient(135deg, #1D1D1F 0%, #000000 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '13.5px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
              }}
            >
              {added ? (
                <>
                  <FiCheck style={{ fontSize: '18px' }} />
                  <span>Flacon Reserved in Cart</span>
                </>
              ) : (
                <>
                  <FiShoppingBag style={{ fontSize: '17px' }} />
                  <span>Reserve {selectedEdition.name} ({selectedSize}) • ${currentPrice}</span>
                  <FiArrowRight style={{ fontSize: '16px' }} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stage-tabs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stage-details-grid {
            grid-template-columns: 1fr !important;
          }
          .edition-reserve-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FlaconAlchemyJourney;
