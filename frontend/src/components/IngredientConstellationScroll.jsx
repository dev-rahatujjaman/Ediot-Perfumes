import React, { useState, useEffect, useRef } from 'react';
import {
  FiStar,
  FiDroplet,
  FiSun,
  FiCompass,
  FiArrowRight,
  FiRefreshCw,
  FiCheck,
  FiLayers,
  FiSliders,
  FiFeather,
  FiClock,
  FiShield
} from 'react-icons/fi';

/**
 * 12 Curated Rare Haute Parfumerie Raw Accords
 * Grouped into 3 Olfactory Tiers with sensory metrics, origins, and matching maison flacons.
 */
const ACCORDS_DATA = [
  // ── Top / Head ──
  {
    id: 'bergamot',
    tier: 'top',
    tierLabel: 'Solar Head Accord',
    name: 'Calabrian Bergamot',
    french: 'Bergamote de Calabre',
    origin: 'Reggio Calabria, Italy',
    harvest: 'Cold-Pressed Nov–Feb',
    volatility: '15 – 45 Min Opening',
    sillage: 'Sparkling • Luminous • Crisp',
    density: 'Pure Essential Essence',
    color: '#F5D791',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&q=80',
    matchProduct: 'Morning Bloom',
    notes: ['Sparkling Citrus', 'Sun-Kissed Rind', 'Green Floral Tint'],
  },
  {
    id: 'neroli',
    tier: 'top',
    tierLabel: 'Solar Head Accord',
    name: 'Sunlit Neroli Solstice',
    french: 'Néroli Doré de Tunisie',
    origin: 'Nabeul, Cap Bon Peninsula',
    harvest: 'Dawn Hand-Pick Apr–May',
    volatility: '30 – 60 Min Radiance',
    sillage: 'Solar • Honeyed • Floral',
    density: 'Steam Hydro-Distilled',
    color: '#F7CE76',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&q=80',
    matchProduct: 'Only For You',
    notes: ['Orange Blossom Water', 'Golden Pollen', 'Brisk Petitgrain'],
  },
  {
    id: 'baie-rose',
    tier: 'top',
    tierLabel: 'Solar Head Accord',
    name: 'Baie Rose Royale',
    french: 'Baies Roses de Madagascar',
    origin: 'Toamasina Coast, Madagascar',
    harvest: 'Artisanal Sun-Dried',
    volatility: '20 – 50 Min Sparkle',
    sillage: 'Peppery • Fruity • Electric',
    density: 'Supercritical CO2 Extract',
    color: '#F4A261',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
    matchProduct: 'Grasse Rose Noire',
    notes: ['Vibrant Pink Peppercorn', 'Juniper Berry', 'Fizzy Amber'],
  },
  {
    id: 'mandarin',
    tier: 'top',
    tierLabel: 'Solar Head Accord',
    name: 'Mandarine Verte',
    french: 'Mandarine Verte de Sicile',
    origin: 'Messina Groves, Sicily',
    harvest: 'Early Unripe Harvest',
    volatility: '15 – 40 Min Zest',
    sillage: 'Tangy • Effervescent • Velvet',
    density: 'Pelatrice Cold-Extraction',
    color: '#E9C46A',
    image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=600&q=80',
    matchProduct: 'Only For You',
    notes: ['Tart Green Peel', 'Fresh Dewdrops', 'Herbal Bittersweet'],
  },

  // ── Heart / Cœur ──
  {
    id: 'rose-centifolia',
    tier: 'heart',
    tierLabel: 'Floral Cœur Absolu',
    name: 'May Rose Centifolia',
    french: 'Rose de Mai de Grasse',
    origin: 'Domaine de Grasse, France',
    harvest: '04:30 AM – 09:00 AM May Only',
    volatility: '2 – 8 Hours Diffusion',
    sillage: 'Opulent • Honeyed • Carnal',
    density: 'Pure 100% Floral Absolu',
    color: '#E76F51',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&q=80',
    matchProduct: 'Grasse Rose Noire',
    notes: ['Honeyed Centifolia Petal', 'Spicy Clove Stem', 'Green Leaf Sap'],
  },
  {
    id: 'bourbon-vanilla',
    tier: 'heart',
    tierLabel: 'Floral Cœur Absolu',
    name: 'Madagascar Bourbon Vanilla',
    french: 'Vanille Bourbon de Sava',
    origin: 'SAVA Rainforest, Madagascar',
    harvest: '36-Month Cured Orchid Pods',
    volatility: '4 – 12 Hours Warmth',
    sillage: 'Smoky • Balsamic • Creamy',
    density: 'Ultrasonic Tincture Extract',
    color: '#D4A373',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&q=80',
    matchProduct: 'Velvet Santal',
    notes: ['Caramelized Orchid Pod', 'Dark Rum Cask', 'Toasted Pod Husk'],
  },
  {
    id: 'jasmine',
    tier: 'heart',
    tierLabel: 'Floral Cœur Absolu',
    name: 'Grasse Night Jasmine',
    french: 'Jasmin Grandiflorum',
    origin: 'Grasse Valleys, France',
    harvest: 'Midnight Harvested',
    volatility: '3 – 9 Hours Seduction',
    sillage: 'Narcotic • Indolic • Velvety',
    density: 'Traditional Enfleurage Pomade',
    color: '#E9D8A6',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&q=80',
    matchProduct: 'Only For You',
    notes: ['Night-Blooming Petals', 'Warm Skin Accord', 'Golden Amber Nectar'],
  },
  {
    id: 'iris',
    tier: 'heart',
    tierLabel: 'Floral Cœur Absolu',
    name: 'Iris Pallida Orris Butter',
    french: 'Beurre d’Iris de Florence',
    origin: 'Chianti Hills, Tuscany',
    harvest: '6-Year Aged Underground Rhizome',
    volatility: '6 – 14 Hours Elegance',
    sillage: 'Powdery • Silken • Regal',
    density: 'Iron Steam Distillate (15% Irones)',
    color: '#BDB2FF',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80',
    matchProduct: 'Only For You',
    notes: ['Silken Violet Root', 'Soft Suede Leather', 'Chalky Mineral Powder'],
  },

  // ── Base / Fond ──
  {
    id: 'sandalwood',
    tier: 'base',
    tierLabel: 'Sacred Fond Sillage',
    name: '30-Yr Mysore Sandalwood',
    french: 'Santal Blanc de Mysore',
    origin: 'Karnataka Reserves, India',
    harvest: '30-Year Mature Heartwood',
    volatility: '12 – 24+ Hours Longevity',
    sillage: 'Creamy • Sacred • Infinite',
    density: 'Hydro-Fractionated Extrait',
    color: '#D4AF37',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80',
    matchProduct: 'Velvet Santal',
    notes: ['Milky White Wood', 'Warm Amber Resin', 'Smoked Sacred Incense'],
  },
  {
    id: 'ambergris',
    tier: 'base',
    tierLabel: 'Sacred Fond Sillage',
    name: 'Oceanic Royal Ambergris',
    french: 'Ambre Gris Océanique',
    origin: 'New Zealand Shoreline',
    harvest: '10-Year Sun-Cured Marine Tincture',
    volatility: '16 – 36+ Hours Fixative',
    sillage: 'Salty • Musky • Golden Seduction',
    density: '3% Pure Ethanolic Maceration',
    color: '#E0A96D',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    matchProduct: 'Imperial Ambergris',
    notes: ['Salty Sea Breeze', 'Golden Animalic Musk', 'Warm Sunlit Sand'],
  },
  {
    id: 'oud',
    tier: 'base',
    tierLabel: 'Sacred Fond Sillage',
    name: 'Oud Royale Terroir Noir',
    french: 'Oud Sauvage du Cambodge',
    origin: 'Koh Kong Jungle, Cambodia',
    harvest: 'Wild Wildwood Aquilaria',
    volatility: '24 – 48+ Hours Immortality',
    sillage: 'Smoky • Balsamic • Majestic',
    density: 'First-Press Direct Steam Extract',
    color: '#8A5A36',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
    matchProduct: 'Grasse Rose Noire',
    notes: ['Dark Resinous Bark', 'Smoked Leather', 'Black Honey Tears'],
  },
  {
    id: 'tonka',
    tier: 'base',
    tierLabel: 'Sacred Fond Sillage',
    name: 'Limousin Smoked Tonka',
    french: 'Fève Tonka des Cèdres',
    origin: 'Orinoco Basin, Venezuela',
    harvest: 'Cured in Aged Limousin Oak',
    volatility: '14 – 28+ Hours Sillage',
    sillage: 'Coumarinic • Almond • Tobacco',
    density: 'Crystalline Coumarin Extrait',
    color: '#C08552',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    matchProduct: 'Morning Bloom',
    notes: ['Roasted Almond Glaze', 'Pipe Tobacco Smoke', 'Dark Brown Sugar'],
  },
];

const PRESETS = [
  {
    name: 'The Sovereign Imperial Extrait',
    subtitle: 'Warm Ambergris • Mysore Santal • May Rose Centifolia',
    accords: ['ambergris', 'sandalwood', 'rose-centifolia'],
    density: '38% Extrait',
    sillageRadius: '4.8 Meters',
    archetype: 'Regal Parisian Sovereign',
  },
  {
    name: 'Solar Dawn Solstice',
    subtitle: 'Calabrian Bergamot • Sunlit Neroli • Bourbon Vanilla',
    accords: ['bergamot', 'neroli', 'bourbon-vanilla'],
    density: '32% Extrait',
    sillageRadius: '3.6 Meters',
    archetype: 'Riviera Morning Radiance',
  },
  {
    name: 'Nocturnal Grasse Alchemy',
    subtitle: 'Grasse Jasmine • Oud Royale • Limousin Tonka',
    accords: ['jasmine', 'oud', 'tonka'],
    density: '36% Extrait',
    sillageRadius: '4.2 Meters',
    archetype: 'Midnight Black Sillage',
  },
];

const IngredientConstellationScroll = () => {
  const [selectedAccords, setSelectedAccords] = useState([
    'bergamot',
    'rose-centifolia',
    'sandalwood',
  ]);
  const [activeTier, setActiveTier] = useState('all');
  const [activeAccordPreview, setActiveAccordPreview] = useState(ACCORDS_DATA[0]);
  const [isForging, setIsForging] = useState(false);
  const [alchemyAuraPulse, setAlchemyAuraPulse] = useState(false);

  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  // Toggle Accord in Formula (Max 3: one per tier or custom 3)
  const handleToggleAccord = (accord) => {
    setActiveAccordPreview(accord);
    setAlchemyAuraPulse(true);
    setTimeout(() => setAlchemyAuraPulse(false), 800);

    setSelectedAccords((prev) => {
      if (prev.includes(accord.id)) {
        return prev.filter((id) => id !== accord.id);
      }
      if (prev.length >= 3) {
        // Replace matching tier or first item
        const sameTierIndex = prev.findIndex((id) => {
          const item = ACCORDS_DATA.find((a) => a.id === id);
          return item?.tier === accord.tier;
        });
        if (sameTierIndex !== -1) {
          const next = [...prev];
          next[sameTierIndex] = accord.id;
          return next;
        }
        return [...prev.slice(1), accord.id];
      }
      return [...prev, accord.id];
    });
  };

  const handleApplyPreset = (preset) => {
    setIsForging(true);
    setSelectedAccords(preset.accords);
    const first = ACCORDS_DATA.find((a) => a.id === preset.accords[0]);
    if (first) setActiveAccordPreview(first);
    setTimeout(() => setIsForging(false), 600);
  };

  // Selected Objects
  const selectedObjects = selectedAccords
    .map((id) => ACCORDS_DATA.find((a) => a.id === id))
    .filter(Boolean);

  // Dynamic Metrics Calculation
  const calculatedDensity = Math.min(
    38,
    28 + selectedObjects.length * 3.2
  ).toFixed(1);

  const calculatedLongevity = Math.min(
    36,
    14 + selectedObjects.length * 7.5
  ).toFixed(0);

  // Filtered List
  const filteredAccords =
    activeTier === 'all'
      ? ACCORDS_DATA
      : ACCORDS_DATA.filter((a) => a.tier === activeTier);

  // ─── Golden Ember Particle Aura Canvas ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.4 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 215, 145, ${alpha.toFixed(2)})`;
        ctx.shadowColor = '#D4AF37';
        ctx.shadowBlur = 12;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="olfactory-lexicon"
      className="alchemy-vault-section"
      style={{
        position: 'relative',
        background: '#070605',
        color: '#FDFCFA',
        padding: '120px 0 140px',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
      }}
      aria-label="The Scent Constellation and Olfactory Accord Synthesizer"
    >
      <style>{`
        /* ─── AMBIENT ATMOSPHERE & GOLDEN CAUSTIC BACKDROP ─── */
        .vault-bg-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.25;
          filter: contrast(1.15) brightness(0.65);
          pointer-events: none;
          z-index: 0;
        }

        .vault-aurora-glow {
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translate(-50%, -20%);
          width: 80vw;
          height: 60vh;
          background: radial-gradient(ellipse at center, rgba(184, 134, 45, 0.22) 0%, rgba(142, 94, 25, 0.12) 45%, transparent 75%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
        }

        .vault-particles-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        /* ─── SECTION HEADER ─── */
        .vault-header-wrap {
          text-align: center;
          max-width: 840px;
          margin: 0 auto 64px;
          position: relative;
          z-index: 10;
          padding: 0 24px;
        }

        .vault-super-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 22px;
          border-radius: 999px;
          background: rgba(22, 16, 10, 0.75);
          border: 1px solid rgba(212, 175, 55, 0.45);
          backdrop-filter: blur(16px);
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #F5D791;
          font-weight: 700;
          margin-bottom: 24px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .vault-title {
          font-family: var(--font-display, 'Neue Montreal', serif);
          font-size: clamp(34px, 5.2vw, 68px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #FFF;
          margin-bottom: 20px;
        }

        .vault-title span.gold-shimmer {
          background: linear-gradient(135deg, #FFFFFF 0%, #FFF3D6 25%, #F5D791 55%, #B8862D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .vault-sub {
          font-size: clamp(15px, 1.3vw, 18px);
          color: rgba(235, 230, 220, 0.75);
          line-height: 1.7;
          max-width: 680px;
          margin: 0 auto;
          font-weight: 300;
        }

        /* ─── PRESET FORMULA PILLS ─── */
        .vault-preset-bar {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .vault-preset-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.25);
          color: rgba(245, 215, 145, 0.9);
          font-size: 11.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .vault-preset-chip:hover {
          background: rgba(212, 175, 55, 0.18);
          border-color: #F5D791;
          color: #FFF;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(184, 134, 45, 0.3);
        }

        /* ─── MAIN DUAL-PANEL GRID (CRUCIBLE & LEXICON MATRIX) ─── */
        .vault-matrix-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 28px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 36px;
          position: relative;
          z-index: 10;
        }

        /* ─── LEFT PANEL: THE ACCORD GALLERY & TIER FILTER ─── */
        .vault-gallery-card {
          background: rgba(14, 11, 8, 0.82);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 28px;
          padding: 36px;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .vault-tier-nav {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .vault-tier-tab {
          padding: 8px 18px;
          border-radius: 999px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.65);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .vault-tier-tab.active {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(184, 134, 45, 0.15) 100%);
          border-color: #F5D791;
          color: #FFF;
          box-shadow: 0 4px 18px rgba(184, 134, 45, 0.25);
        }

        /* Accord Grid */
        .vault-accord-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .vault-accord-tile {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(22, 17, 12, 0.9);
          border: 1.5px solid rgba(212, 175, 55, 0.2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .vault-accord-tile:hover {
          transform: translateY(-4px);
          border-color: rgba(245, 215, 145, 0.8);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.25);
        }

        .vault-accord-tile.selected {
          border-color: #F5D791;
          background: linear-gradient(180deg, rgba(34, 25, 16, 0.95) 0%, rgba(20, 14, 9, 0.98) 100%);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.4);
        }

        .vault-tile-img-wrap {
          height: 110px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .vault-tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .vault-accord-tile:hover .vault-tile-img {
          transform: scale(1.08);
        }

        .vault-tile-tag {
          position: absolute;
          top: 8px;
          left: 8px;
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: rgba(10, 8, 6, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212, 175, 55, 0.35);
          color: #F5D791;
          padding: 3px 8px;
          border-radius: 99px;
          font-weight: 700;
        }

        .vault-tile-check {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #F5D791;
          color: #1A1208;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .vault-tile-body {
          padding: 12px 14px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
        }

        .vault-tile-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #FFF;
          margin-bottom: 2px;
          letter-spacing: -0.01em;
        }

        .vault-tile-french {
          font-size: 10.5px;
          font-style: italic;
          color: rgba(245, 215, 145, 0.85);
          margin-bottom: 8px;
        }

        .vault-tile-meta {
          font-size: 9.5px;
          color: rgba(255, 255, 255, 0.55);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ─── RIGHT PANEL: THE SILLAGE SYNTHESIZER CRUCIBLE ─── */
        .vault-crucible-card {
          background: linear-gradient(165deg, rgba(20, 15, 10, 0.92) 0%, rgba(10, 8, 6, 0.96) 100%);
          border: 1.5px solid rgba(212, 175, 55, 0.4);
          border-radius: 28px;
          padding: 36px;
          backdrop-filter: blur(24px);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.8), 0 0 50px rgba(184, 134, 45, 0.2);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .crucible-glow-ring {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(245, 215, 145, 0.25) 0%, transparent 70%);
          filter: blur(30px);
          pointer-events: none;
        }

        .crucible-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .crucible-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #F5D791;
          font-weight: 700;
        }

        .crucible-reset-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 11px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s ease;
        }

        .crucible-reset-btn:hover {
          color: #F5D791;
        }

        /* Crucible Selected Accords Slots */
        .crucible-slots-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }

        .crucible-slot-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 16px;
          transition: all 0.25s ease;
        }

        .crucible-slot-row:hover {
          border-color: rgba(245, 215, 145, 0.6);
          background: rgba(212, 175, 55, 0.08);
        }

        .crucible-slot-orb {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid #F5D791;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .crucible-slot-orb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .crucible-slot-info {
          flex: 1;
        }

        .crucible-slot-tier {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #F5D791;
          font-weight: 700;
        }

        .crucible-slot-title {
          font-size: 14px;
          font-weight: 700;
          color: #FFF;
        }

        .crucible-slot-origin {
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Sillage Radiance Gauge */
        .crucible-metrics-box {
          background: rgba(14, 10, 7, 0.85);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .crucible-meter-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .crucible-meter-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .crucible-meter-label {
          font-size: 9.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
        }

        .crucible-meter-value {
          font-size: 22px;
          font-weight: 800;
          color: #F5D791;
          font-family: var(--font-display, serif);
        }

        .crucible-meter-sub {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Formula CTA Button */
        .crucible-cta-btn {
          width: 100%;
          padding: 16px 24px;
          border-radius: 999px;
          background: linear-gradient(135deg, #F5D791 0%, #D4AF37 50%, #B8862D 100%);
          color: #120D08;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(184, 134, 45, 0.4);
        }

        .crucible-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(245, 215, 145, 0.6);
          background: linear-gradient(135deg, #FFF0C8 0%, #F5D791 50%, #D4AF37 100%);
        }

        /* ─── LIVE ACCORD DOSSIER PREVIEW BANNER (BOTTOM) ─── */
        .vault-preview-banner {
          max-width: 1400px;
          margin: 36px auto 0;
          padding: 0 28px;
          position: relative;
          z-index: 10;
        }

        .dossier-card {
          background: rgba(18, 14, 10, 0.88);
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 24px;
          padding: 28px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.6);
        }

        .dossier-main {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .dossier-thumb {
          width: 76px;
          height: 76px;
          border-radius: 18px;
          object-fit: cover;
          border: 1.5px solid #F5D791;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          flex-shrink: 0;
        }

        .dossier-info-title {
          font-size: 20px;
          font-weight: 700;
          color: #FFF;
          margin-bottom: 4px;
        }

        .dossier-info-sub {
          font-size: 12.5px;
          color: rgba(245, 215, 145, 0.9);
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .dossier-notes-chips {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .dossier-chip {
          font-size: 10px;
          padding: 4px 12px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(212, 175, 55, 0.25);
          color: rgba(255, 255, 255, 0.85);
        }

        .dossier-side-action {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }

        .dossier-match-badge {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #D4AF37;
          font-weight: 700;
        }

        .dossier-view-flacon-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #FFF;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .dossier-view-flacon-btn:hover {
          background: #F5D791;
          color: #140E08;
          border-color: #F5D791;
        }

        /* ─── RESPONSIVE BREAKPOINTS ─── */
        @media (max-width: 1100px) {
          .vault-matrix-container {
            grid-template-columns: 1fr;
          }
          .dossier-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .dossier-side-action {
            align-items: flex-start;
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .vault-gallery-card,
          .vault-crucible-card {
            padding: 24px;
          }
          .vault-accord-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .dossier-main {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      {/* ─── 1. BACKGROUND AURA & PARTICLE DRIFT ─── */}
      <img
        src="/images/constellation-luxury-bg.jpg"
        alt="Haute Parfumerie Gold Extraction"
        className="vault-bg-photo"
      />
      <div className="vault-aurora-glow" />
      <canvas ref={canvasRef} className="vault-particles-canvas" />

      {/* ─── 2. SECTION HEADER & PHILOSOPHY ─── */}
      <div className="vault-header-wrap">
        <div className="vault-super-badge">
          <FiStar style={{ color: '#D4AF37' }} />
          <span>The Olfactory Lexicon & Synthesis</span>
          <FiStar style={{ color: '#D4AF37' }} />
        </div>

        <h2 className="vault-title">
          The Alchemy of <span className="gold-shimmer">Rare Botanical Accords</span>
        </h2>

        <p className="vault-sub">
          Every Ediot formulation is extracted at 35% pure Grand Cru density.
          Explore the 12 sovereign raw botanicals and forge your bespoke harmonic sillage architecture in real time.
        </p>

        {/* Preset Sillage Formulations */}
        <div className="vault-preset-bar">
          <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', alignSelf: 'center' }}>
            Maison Presets:
          </span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="vault-preset-chip"
            >
              <span>✦</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── 3. DUAL-PANEL CRUCIBLE & ACCORD MATRIX ─── */}
      <div className="vault-matrix-container">
        {/* LEFT PANEL: 12 RAW BOTANICAL TILES */}
        <div className="vault-gallery-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 700 }}>
                Haute Parfumerie Vault
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFF', margin: '2px 0 0' }}>
                Select Accords for Synthesis
              </h3>
            </div>

            {/* Tier Filter Tabs */}
            <div className="vault-tier-nav" style={{ margin: 0 }}>
              {[
                { key: 'all', label: 'All 12 Accords' },
                { key: 'top', label: 'Solar Head' },
                { key: 'heart', label: 'Cœur Floral' },
                { key: 'base', label: 'Sacred Fond' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTier(tab.key)}
                  className={`vault-tier-tab ${activeTier === tab.key ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accord Tiles Grid */}
          <div className="vault-accord-grid">
            {filteredAccords.map((accord) => {
              const isSelected = selectedAccords.includes(accord.id);
              return (
                <div
                  key={accord.id}
                  onClick={() => handleToggleAccord(accord)}
                  className={`vault-accord-tile ${isSelected ? 'selected' : ''}`}
                >
                  <div className="vault-tile-img-wrap">
                    <img src={accord.image} alt={accord.name} className="vault-tile-img" loading="lazy" />
                    <span className="vault-tile-tag">{accord.tierLabel.split(' ')[0]}</span>
                    {isSelected && (
                      <div className="vault-tile-check">
                        <FiCheck />
                      </div>
                    )}
                  </div>

                  <div className="vault-tile-body">
                    <div>
                      <div className="vault-tile-name">{accord.name}</div>
                      <div className="vault-tile-french">{accord.french}</div>
                    </div>

                    <div className="vault-tile-meta">
                      <FiClock style={{ color: '#D4AF37' }} />
                      <span>{accord.volatility.split(' ')[0]} {accord.volatility.split(' ')[1]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: LIVE SILLAGE SYNTHESIZER CRUCIBLE */}
        <div className="vault-crucible-card">
          <div className="crucible-glow-ring" />

          <div>
            <div className="crucible-header">
              <div className="crucible-badge">
                <FiDroplet style={{ color: '#D4AF37' }} />
                <span>Bespoke Sillage Crucible</span>
              </div>

              <button
                onClick={() => setSelectedAccords(['bergamot', 'rose-centifolia', 'sandalwood'])}
                className="crucible-reset-btn"
                title="Reset to Signature Blend"
              >
                <FiRefreshCw />
                <span>Reset Crucible</span>
              </button>
            </div>

            {/* Active Selected Accords Slots */}
            <div className="crucible-slots-wrap">
              {selectedObjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                  Click any accord on the left to begin formulating your bespoke extrait.
                </div>
              ) : (
                selectedObjects.map((accord, idx) => (
                  <div key={accord.id} className="crucible-slot-row">
                    <div className="crucible-slot-orb">
                      <img src={accord.image} alt={accord.name} />
                    </div>

                    <div className="crucible-slot-info">
                      <div className="crucible-slot-tier">{accord.tierLabel}</div>
                      <div className="crucible-slot-title">{accord.name}</div>
                      <div className="crucible-slot-origin">{accord.origin} • {accord.harvest}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAccord(accord);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '6px',
                      }}
                      title="Remove Accord"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            {/* Real-time Extrait Metrics Gauge */}
            <div className="crucible-metrics-box">
              <div className="crucible-meter-grid">
                <div className="crucible-meter-item">
                  <span className="crucible-meter-label">Extrait Density</span>
                  <span className="crucible-meter-value">{calculatedDensity}%</span>
                  <span className="crucible-meter-sub">Pure botanical absolute concentration</span>
                </div>

                <div className="crucible-meter-item">
                  <span className="crucible-meter-label">Sillage Diffusion</span>
                  <span className="crucible-meter-value">{calculatedLongevity}+ Hrs</span>
                  <span className="crucible-meter-sub">Dynamic skin chemistry longevity</span>
                </div>
              </div>
            </div>

            {/* CTA to Discover Matching Perfume */}
            <button
              onClick={() => {
                const target = document.getElementById('fragrances');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
              className="crucible-cta-btn"
            >
              <span>Explore Matching Flacons in Vault</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 4. LIVE ACCORD DOSSIER PREVIEW BANNER ─── */}
      {activeAccordPreview && (
        <div className="vault-preview-banner">
          <div className="dossier-card">
            <div className="dossier-main">
              <img
                src={activeAccordPreview.image}
                alt={activeAccordPreview.name}
                className="dossier-thumb"
              />

              <div>
                <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 700, marginBottom: '2px' }}>
                  Botanical Dossier • {activeAccordPreview.tierLabel}
                </div>
                <div className="dossier-info-title">{activeAccordPreview.name} ({activeAccordPreview.french})</div>
                <div className="dossier-info-sub">
                  <span>📍 {activeAccordPreview.origin}</span>
                  <span>•</span>
                  <span>🌾 {activeAccordPreview.harvest}</span>
                  <span>•</span>
                  <span>⚗️ {activeAccordPreview.density}</span>
                </div>

                <div className="dossier-notes-chips">
                  {activeAccordPreview.notes.map((note, nIdx) => (
                    <span key={nIdx} className="dossier-chip">
                      ✦ {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="dossier-side-action">
              <span className="dossier-match-badge">Primary Flacon Match</span>
              <button
                onClick={() => {
                  const target = document.getElementById('fragrances');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="dossier-view-flacon-btn"
              >
                <span>Discover {activeAccordPreview.matchProduct}</span>
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default IngredientConstellationScroll;
