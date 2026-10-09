import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 50 Olfactory Accords, Raw Botanicals & Haute Parfumerie Lexicon
 * Mapped to the exact 50 animation-range and grid-area slots.
 */
const ITEMS = [
  { text: 'Calabrian Bergamot', category: 'Top Accord' },
  { text: 'Rose Centifolia', category: 'Floral Absolu' },
  { text: 'Mysore Sandalwood', category: 'Sacred Wood' },
  { text: 'Oud Royale', category: 'Precious Resin' },
  { text: 'Neroli Solstice', category: 'Solar Bloom' },
  { text: 'Ambergris Absolu', category: 'Oceanic Glow' },
  { text: 'Madagascar Vanilla', category: 'Gourmand' },
  { text: 'Grasse Jasmine', category: 'Night Harvest' },
  { text: 'Smoked Tonka', category: 'Aromatic Bean' },
  { text: 'Iris Pallida', category: 'Orris Butter' },
  // 11. Center Special Hero
  { text: 'EDIOT', isSpecial: true, subtitle: 'HAUTE PARFUMERIE · PARIS', category: 'Maison Cru' },
  { text: 'Haitian Vetiver', category: 'Earthy Root' },
  { text: 'Cistus Labdanum', category: 'Golden Balsam' },
  { text: 'Patchouli Cœur', category: 'Terroir Noir' },
  { text: 'Atlas Cedar', category: 'Highland Wood' },
  { text: 'Ylang-Ylang N°1', category: 'Exotic Petal' },
  { text: 'Saffron Nectar', category: 'Crimson Spice' },
  { text: 'Flacon de Cristal', category: 'Bespoke Vessel' },
  { text: 'Cold Maceration', category: 'Artisan Method' },
  { text: 'Cardamom Pod', category: 'Green Spice' },
  { text: 'Black Amber', category: 'Ancient Warmth' },
  { text: 'Baie Rose', category: 'Sparkling Pepper' },
  { text: 'Somalian Myrrh', category: 'Sacred Gum' },
  { text: 'Sillage Infini', category: 'Trail of Legend' },
  { text: 'Osmanthus Flos', category: 'Velvet Apricot' },
  { text: 'Tuberose de Nuit', category: 'Carnal Floral' },
  { text: 'Mandarine Verte', category: 'Zest Essence' },
  { text: '35% Extrait Density', category: 'Haute Density' },
  { text: 'Bourbon Benzoin', category: 'Sweet Resin' },
  { text: 'Enfleurage Tradition', category: 'Heritage Craft' },
  { text: 'Frankincense Oliban', category: 'Incense Tear' },
  { text: 'Damask Rose Absolu', category: 'Royal Bloom' },
  { text: 'Oakmoss Royale', category: 'Chypre Base' },
  { text: 'Elemi Wild Resin', category: 'Citrus Gum' },
  { text: 'Violette Impériale', category: 'Powdery Velvet' },
  { text: 'Headspace Scent', category: 'Molecular Capture' },
  { text: 'Ambrette Seed', category: 'Botanical Musk' },
  { text: 'Copaiba Balsam', category: 'Amazonian Nectar' },
  { text: 'Gaiac Heartwood', category: 'Smoked Wood' },
  { text: 'Pure Extrait', category: 'Unfiltered Cru' },
  { text: 'Alchimie Noire', category: 'Night Sillage' },
  { text: 'Zamak Gold Collar', category: 'Magnetic Crown' },
  { text: 'Petite Fleur d’Oranger', category: 'Solar Mist' },
  { text: 'Distillation Vapeur', category: 'Pure Vapour' },
  { text: 'Precious Amber', category: 'Solar Gem' },
  { text: 'Velvet Cedarwood', category: 'Silken Bark' },
  { text: 'Galbanum Vert', category: 'Crisp Sap' },
  { text: 'Sunlit Neroli', category: 'Morning Dew' },
  { text: 'Accord Solaire', category: 'Radiant Heat' },
  { text: 'Maison 1984', category: 'Founding Year' },
];

// Exact animation-range percentages from the CSS snippet
const RANGES = [
  [40, 50], [20, 30], [52, 62], [50, 60], [45, 55],
  [10, 20], [90, 100], [30, 40], [80, 90], [70, 80],
  [-10, 50], // 11th - Center Special
  [52, 62], [15, 25], [7, 17], [75, 85], [3, 13],
  [87, 97], [42, 52], [57, 67], [37, 47], [12, 22],
  [8, 18], [84, 94], [33, 43], [48, 58], [13, 23],
  [78, 88], [62, 72], [31, 41], [8, 18], [4, 14],
  [74, 84], [61, 71], [26, 36], [63, 73], [11, 21],
  [89, 99], [33, 43], [88, 98], [22, 32], [16, 26],
  [26, 36], [66, 76], [3, 13], [44, 54], [11, 21],
  [23, 33], [39, 49], [59, 69], [6, 16],
];

// Exact grid-area coordinates from the CSS snippet
const GRID_AREAS = [
  '1/1', '1/2', '1/3', '1/4',
  '2/1', '2/2', '2/3', '2/4',
  '3/1', '3/2', '3/3', '3/4',
  '4/1', '4/2', '4/3', '4/4',
  '2/1', '2/2', '2/3', '2/4',
  '3/1', '3/2', '3/3', '3/4',
  '1/1', '1/2', '1/3', '1/4',
  '4/1', '4/2', '4/3', '4/4',
  '2/1', '2/2', '2/3', '2/4',
  '3/1', '3/2', '3/3', '3/4',
  '1/1', '1/2', '1/3', '1/4',
  '4/1', '4/2', '4/3', '4/4',
  '3/1', '3/2', '3/3', '3/4',
];

const IngredientConstellationScroll = () => {
  const containerRef = useRef(null);
  const stuckGridRef = useRef(null);
  const bgImageRef = useRef(null);
  const itemsRef = useRef([]);

  // Direct DOM refs to avoid React re-renders on scroll
  const progressFillRef = useRef(null);
  const progressTextRef = useRef(null);
  const activeCountRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const stuckGrid = stuckGridRef.current;
    const bgImage = bgImageRef.current;
    const items = itemsRef.current;

    if (!container || !stuckGrid || !items || items.length === 0) return;

    // Track active visibility states to prevent redundant DOM updates
    const isVisibleArray = new Array(items.length).fill(false);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        pin: stuckGrid,
        pinSpacing: false,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const scrollPct = self.progress * 100;

          // 1. Direct DOM updates for HUD (ZERO React re-renders)
          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${scrollPct}%`;
          }
          if (progressTextRef.current) {
            progressTextRef.current.textContent = `${Math.round(scrollPct)}%`;
          }

          // 2. Parallax drift on background (GPU translate only)
          if (bgImage) {
            const bgTranslateY = self.progress * -30;
            bgImage.style.transform = `translate3d(0, ${bgTranslateY.toFixed(1)}px, 0)`;
          }

          let activeCount = 0;

          // 3. Ultra-fast GPU-only item transforms with Visibility Culling
          for (let idx = 0; idx < items.length; idx++) {
            const el = items[idx];
            if (!el) continue;

            const range = RANGES[idx];
            const start = range[0];
            const end = range[1];

            // CULLING: Skip items outside the active window completely
            if (scrollPct < start || scrollPct > end) {
              if (isVisibleArray[idx]) {
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
                isVisibleArray[idx] = false;
              }
              continue;
            }

            // Item is active
            activeCount++;
            if (!isVisibleArray[idx]) {
              el.style.visibility = 'visible';
              isVisibleArray[idx] = true;
            }

            const p = (scrollPct - start) / (end - start);

            // Fast linear interpolation using translate3d and opacity
            // 0 -> -1000px, 0.5 -> 0px, 1.0 -> 1000px
            let translateZ;
            let opacity;
            let scale;

            if (p <= 0.5) {
              const sub = p / 0.5; // 0 to 1
              translateZ = -900 + sub * 900;
              opacity = sub;
              scale = 0.7 + sub * 0.3;
            } else {
              const sub = (p - 0.5) / 0.5; // 0 to 1
              translateZ = sub * 900;
              opacity = 1 - sub;
              scale = 1.0 + sub * 0.3;
            }

            // Hardware-accelerated transform only (NO filter: blur)
            el.style.transform = `translate3d(0, 0, ${translateZ.toFixed(0)}px) scale(${scale.toFixed(2)})`;
            el.style.opacity = opacity.toFixed(2);
          }

          if (activeCountRef.current) {
            activeCountRef.current.textContent = `${activeCount} / 50`;
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="olfactory-lexicon"
      className="constellation-wrapper"
      style={{
        position: 'relative',
        height: '340vh',
        background: '#060504',
        color: '#FDFCFA',
        overflow: 'visible',
      }}
      aria-label="The Olfactory Constellation: 3D Scroll Journey"
    >
      <style>{`
        /* 3D Stuck Grid Core */
        .constellation-grid {
          height: 100vh;
          width: 100%;
          perspective: 1200px;
          transform-style: preserve-3d;
          display: grid;
          grid-template-columns: repeat(4, 25vw);
          grid-template-rows: repeat(4, 25vh);
          place-items: center;
          position: sticky;
          top: 0;
          left: 0;
          overflow: hidden;
          background: #060504;
          z-index: 10;
        }

        /* ─── OPTIMIZED LUXURY BACKGROUND ─── */
        .constellation-bg-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          opacity: 0.58;
          pointer-events: none;
          z-index: 1;
          will-change: transform;
        }

        .constellation-bg-radial {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 50% 50%, rgba(184, 134, 45, 0.22) 0%, rgba(94, 58, 18, 0.12) 40%, transparent 75%),
            radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.14) 0%, transparent 45%);
          pointer-events: none;
          z-index: 2;
        }

        /* Subtle Static Astrolabe (Zero-cost SVG) */
        .constellation-astrolabe {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(80vmin, 680px);
          height: min(80vmin, 680px);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 3;
          opacity: 0.28;
        }

        /* Vignettes */
        .constellation-vignette-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 160px;
          background: linear-gradient(to bottom, #060504 0%, rgba(6, 5, 4, 0) 100%);
          z-index: 20;
          pointer-events: none;
        }

        .constellation-vignette-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 160px;
          background: linear-gradient(to top, #060504 0%, rgba(6, 5, 4, 0) 100%);
          z-index: 20;
          pointer-events: none;
        }

        /* ─── GPU-EFFICIENT GRID ITEMS (No blur filter, pre-baked glass) ─── */
        .c-item {
          transform-style: preserve-3d;
          font-family: var(--font-display, 'Neue Montreal', sans-serif);
          font-size: clamp(12px, 2.2vmin, 18px);
          font-weight: 500;
          letter-spacing: 0.06em;
          color: rgba(248, 244, 238, 0.92);
          white-space: nowrap;
          padding: 7px 16px;
          border-radius: 999px;
          background: rgba(18, 14, 10, 0.88);
          border: 1px solid rgba(212, 175, 55, 0.32);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
          position: relative;
          user-select: none;
          will-change: transform, opacity;
          visibility: hidden;
          opacity: 0;
          z-index: 10;
        }

        .c-item-tag {
          display: block;
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #D4AF37;
          font-weight: 700;
          margin-bottom: 2px;
          font-family: var(--font-text, sans-serif);
        }

        /* Special Hero Center: EDIOT */
        .c-item-special {
          grid-row: 2 / span 2 !important;
          grid-column: 2 / span 2 !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          z-index: 15;
          padding: 30px 40px;
          background: rgba(14, 10, 7, 0.9);
          border-radius: 36px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(184, 134, 45, 0.25);
        }

        .c-item-special .c-special-brand {
          font-size: clamp(48px, 13vmin, 120px);
          font-weight: 700;
          letter-spacing: 0.16em;
          line-height: 0.92;
          color: #FFF;
          background: linear-gradient(135deg, #FFFFFF 0%, #FFF4D8 30%, #E6CA9E 60%, #D4AF37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: var(--font-display, 'Neue Montreal', sans-serif);
        }

        .c-item-special .c-special-sub {
          font-size: clamp(10px, 1.6vmin, 14px);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #E6CA9E;
          font-weight: 600;
          margin-top: 14px;
        }

        .c-item-special .c-special-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 18px;
          margin-top: 16px;
          border-radius: 99px;
          background: rgba(212, 175, 55, 0.18);
          border: 1px solid rgba(240, 200, 110, 0.4);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #FFF0C8;
          font-weight: 600;
        }

        /* ─── HUD OVERLAYS ─── */
        .constellation-hud-top {
          position: absolute;
          top: 32px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          z-index: 25;
          pointer-events: none;
        }

        .hud-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #F5D791;
          font-weight: 700;
          background: rgba(18, 13, 8, 0.85);
          padding: 8px 18px;
          border-radius: 99px;
          border: 1px solid rgba(212, 175, 55, 0.35);
        }

        .hud-metric {
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(18, 13, 8, 0.85);
          padding: 8px 18px;
          border-radius: 99px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hud-metric span.value {
          color: #F5D791;
          font-weight: 700;
        }

        .constellation-hud-bottom {
          position: absolute;
          bottom: 28px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          z-index: 25;
          pointer-events: none;
        }

        .hud-scroll-cue {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255, 245, 225, 0.65);
          background: rgba(18, 13, 8, 0.85);
          padding: 7px 16px;
          border-radius: 99px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hud-progress-bar {
          width: 140px;
          height: 3px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }

        .hud-progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #B8862D, #F5D791, #FFFFFF);
          transition: width 0.05s linear;
        }

        @media (max-width: 900px) {
          .constellation-hud-top,
          .constellation-hud-bottom {
            padding: 0 16px;
          }
          .constellation-grid {
            grid-template-columns: repeat(3, 33.33vw);
          }
          .c-item-special {
            grid-row: 2 / span 2 !important;
            grid-column: 1 / span 3 !important;
            padding: 20px 16px;
          }
        }

        @media (max-width: 600px) {
          .constellation-grid {
            grid-template-columns: repeat(2, 50vw);
          }
          .c-item-special {
            grid-column: 1 / span 2 !important;
          }
          .hud-metric-hide-mobile {
            display: none;
          }
        }
      `}</style>

      {/* The Sticky 3D Spatial Grid Container */}
      <div ref={stuckGridRef} className="constellation-grid">
        {/* 1. Cinematic Liquid Amber & Crystal Flacon Photo */}
        <img
          ref={bgImageRef}
          src="/images/constellation-luxury-bg.jpg"
          alt="Haute Parfumerie Gold Extraction"
          className="constellation-bg-photo"
          loading="lazy"
        />

        {/* 2. Deep Molten Amber & Golden Radial Lighting */}
        <div className="constellation-bg-radial" />

        {/* 3. Static Astrolabe Rings SVG (Vector, Zero GPU cost) */}
        <svg
          className="constellation-astrolabe"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="400" cy="400" r="380" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 8" opacity="0.4" />
          <circle cx="400" cy="400" r="260" stroke="#D4AF37" strokeWidth="1" strokeDasharray="12 16" opacity="0.5" />
          <circle cx="400" cy="400" r="180" stroke="#D4AF37" strokeWidth="0.6" opacity="0.4" />
          <line x1="400" y1="20" x2="400" y2="780" stroke="#D4AF37" strokeWidth="0.5" opacity="0.25" />
          <line x1="20" y1="400" x2="780" y2="400" stroke="#D4AF37" strokeWidth="0.5" opacity="0.25" />
        </svg>

        {/* 4. Top & Bottom Atmospheric Vignettes */}
        <div className="constellation-vignette-top" />
        <div className="constellation-vignette-bottom" />

        {/* HUD Top Bar */}
        <div className="constellation-hud-top">
          <div className="hud-badge">
            <span>✦</span>
            <span>The Olfactory Lexicon</span>
            <span>✦</span>
          </div>

          <div className="hud-metric hud-metric-hide-mobile">
            <span>Traverse</span>
            <span ref={progressTextRef} className="value">0%</span>
            <span>•</span>
            <span>Extraction</span>
            <span className="value">35% Extrait</span>
          </div>
        </div>

        {/* HUD Bottom Bar */}
        <div className="constellation-hud-bottom">
          <div className="hud-scroll-cue">
            <span>Scroll to traverse accords</span>
            <div className="hud-progress-bar">
              <div ref={progressFillRef} className="hud-progress-fill" style={{ width: '0%' }} />
            </div>
          </div>

          <div className="hud-metric">
            <span>Active:</span>
            <span ref={activeCountRef} className="value">0 / 50</span>
          </div>
        </div>

        {/* 50 Spatial Items Placed on the 4x4 Perspective Grid */}
        {ITEMS.map((item, index) => {
          const gridArea = GRID_AREAS[index] || '1/1';
          const isSpecial = Boolean(item.isSpecial);

          return (
            <div
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              className={`c-item ${isSpecial ? 'c-item-special' : ''}`}
              style={{
                gridArea: isSpecial ? undefined : gridArea,
              }}
            >
              {isSpecial ? (
                <>
                  <b className="c-special-brand">EDIOT</b>
                  <span className="c-special-sub">{item.subtitle}</span>
                  <div className="c-special-badge">
                    <span>✦</span>
                    <span>Grand Cru Olfactory Sanctuary</span>
                    <span>✦</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="c-item-tag">{item.category}</span>
                  <span>{item.text}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default IngredientConstellationScroll;
