import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import {
  FiArrowUp,
  FiArrowDown,
  FiShoppingBag,
  FiCheck,
  FiCompass,
  FiDroplet,
  FiAward,
  FiSun,
  FiShield
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

gsap.registerPlugin(ScrollTrigger, Observer);

const EXHIBITION_SLIDES = [
  {
    id: '1',
    chapter: 'Chapter I',
    title: 'Pre-Dawn Centifolia Harvest',
    subtitle: 'Grasse, French Riviera • 04:45 AM',
    desc: 'Each petal plucked by hand in the first light of dawn while volatile mono-terpenes remain sealed inside living blossom cells.',
    bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&q=85',
    tag: 'Raw Botanical Purity',
    price: 185,
    flaconName: 'Morning Bloom Sovereign',
    concentration: '32% Pure Extrait',
    accentColor: '#B8956A',
  },
  {
    id: '2',
    chapter: 'Chapter II',
    title: 'Fractional Cold Extraction',
    subtitle: 'Atelier de Chimie, Paris • 18°C Vacuum',
    desc: 'Cryogenic zero-heat molecular distillation capturing ethereal high-frequency top note esters untouched by thermal degradation.',
    bgImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1600&q=85',
    tag: 'Molecular Alchemy',
    price: 210,
    flaconName: 'Velvet Midnight Santal',
    concentration: '34% Pure Extrait',
    accentColor: '#2E6F40',
  },
  {
    id: '3',
    chapter: 'Chapter III',
    title: 'Mouth-Blown French Crystal',
    subtitle: 'Normandy Artisan Crystalworks • 480g Mass',
    desc: 'Heavyweight mineral crystal annealed over 72 hours, hand-flame polished, and sealed with an engraved 24-karat gold collar.',
    bgImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&q=85',
    tag: 'Haute Craftsmanship',
    price: 245,
    flaconName: 'Imperial Oud & Ambergris',
    concentration: '36% Pure Extrait',
    accentColor: '#B8956A',
  },
  {
    id: '4',
    chapter: 'Chapter IV',
    title: 'Sovereign 90-Day Maceration',
    subtitle: 'Place Vendôme Dark Vaults • Limousin Oak',
    desc: 'Three months of silent maturation in light-sealed obsidian glass allowing complex resins, aged woods, and floral absolutes to fuse.',
    bgImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600&q=85',
    tag: 'Vault Maturation',
    price: 225,
    flaconName: 'Place Vendôme No. 07',
    concentration: '35% Pure Extrait',
    accentColor: '#A47D4C',
  },
  {
    id: '5',
    chapter: 'Chapter V',
    title: 'The Eternal Sillage Signature',
    subtitle: 'Individually Numbered • Private Reserve Batch',
    desc: 'An enduring 16+ hour olfactory projection that adapts dynamically to your unique skin chemistry, leaving an unforgettable trail.',
    bgImage: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1600&q=85',
    tag: 'Olfactory Signature',
    price: 275,
    flaconName: 'Black Ambergris Sovereign',
    concentration: '36% Pure Extrait',
    accentColor: '#B66E7C',
  },
];

const ParallaxObserverExhibition = () => {
  const containerRef = useRef(null);
  const stickyWrapperRef = useRef(null);
  const sectionsRef = useRef([]);
  const outerRefs = useRef([]);
  const innerRefs = useRef([]);
  const bgRefs = useRef([]);
  const headingRefs = useRef([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [addedItem, setAddedItem] = useState(null);
  const dispatch = useDispatch();

  const animatingRef = useRef(false);
  const currentIndexRef = useRef(0);

  const total = EXHIBITION_SLIDES.length;

  useEffect(() => {
    const sections = sectionsRef.current;
    const outerWrappers = outerRefs.current;
    const innerWrappers = innerRefs.current;
    const images = bgRefs.current;
    const headings = headingRefs.current;
    const container = containerRef.current;
    const stickyWrapper = stickyWrapperRef.current;

    if (!container || !sections.length || !stickyWrapper) return;

    // Initial state: hide all except the first slide
    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });
    gsap.set(sections, { autoAlpha: 0, zIndex: 0 });

    const gotoSection = (index, direction) => {
      const wrapIndex = gsap.utils.wrap(0, total, index);
      if (animatingRef.current) return;
      animatingRef.current = true;

      const fromTop = direction === -1;
      const dFactor = fromTop ? -1 : 1;
      const prevIndex = currentIndexRef.current;

      const tl = gsap.timeline({
        defaults: { duration: 1.1, ease: 'power2.inOut' },
        onComplete: () => {
          animatingRef.current = false;
        },
      });

      // Animate previous section out
      if (prevIndex >= 0 && prevIndex !== wrapIndex) {
        gsap.set(sections[prevIndex], { zIndex: 0 });
        tl.to(images[prevIndex], { yPercent: -15 * dFactor, duration: 1.1 }, 0)
          .set(sections[prevIndex], { autoAlpha: 0 });
      }

      // Animate new section in with dual counter-translation
      gsap.set(sections[wrapIndex], { autoAlpha: 1, zIndex: 1 });

      tl.fromTo(
        [outerWrappers[wrapIndex], innerWrappers[wrapIndex]],
        {
          yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor),
        },
        {
          yPercent: 0,
          duration: 1.1,
        },
        0
      )
        .fromTo(
          images[wrapIndex],
          { yPercent: 15 * dFactor },
          { yPercent: 0, duration: 1.1 },
          0
        );

      // Staggered letters animation in heading
      const headingEl = headings[wrapIndex];
      if (headingEl) {
        const letters = headingEl.querySelectorAll('.char-span');
        if (letters.length > 0) {
          tl.fromTo(
            letters,
            {
              autoAlpha: 0,
              yPercent: 120 * dFactor,
              rotateZ: dFactor * 6,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              rotateZ: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: {
                each: 0.018,
                from: 'random',
              },
            },
            0.2
          );
        }
      }

      currentIndexRef.current = wrapIndex;
      setCurrentIndex(wrapIndex);
    };

    // Show initial slide 0
    gotoSection(0, 1);

    // GSAP ScrollTrigger to PIN / STICK this entire section on scroll
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=350%',
        pin: stickyWrapper,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const targetSlide = Math.min(
            total - 1,
            Math.floor(progress * total)
          );

          if (targetSlide !== currentIndexRef.current && !animatingRef.current) {
            const dir = targetSlide > currentIndexRef.current ? 1 : -1;
            gotoSection(targetSlide, dir);
          }
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [total]);

  const handleNext = () => {
    if (!animatingRef.current) {
      const nextIdx = (currentIndex + 1) % total;
      triggerGoto(nextIdx, 1);
    }
  };

  const handlePrev = () => {
    if (!animatingRef.current) {
      const prevIdx = (currentIndex - 1 + total) % total;
      triggerGoto(prevIdx, -1);
    }
  };

  const triggerGoto = (targetIdx, direction) => {
    if (animatingRef.current || targetIdx === currentIndex) return;
    animatingRef.current = true;

    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;
    const prevIdx = currentIndexRef.current;

    const sections = sectionsRef.current;
    const outerWrappers = outerRefs.current;
    const innerWrappers = innerRefs.current;
    const images = bgRefs.current;
    const headings = headingRefs.current;

    const tl = gsap.timeline({
      defaults: { duration: 1.1, ease: 'power2.inOut' },
      onComplete: () => {
        animatingRef.current = false;
      },
    });

    if (prevIdx >= 0) {
      gsap.set(sections[prevIdx], { zIndex: 0 });
      tl.to(images[prevIdx], { yPercent: -15 * dFactor, duration: 1.1 }, 0)
        .set(sections[prevIdx], { autoAlpha: 0 });
    }

    gsap.set(sections[targetIdx], { autoAlpha: 1, zIndex: 1 });

    tl.fromTo(
      [outerWrappers[targetIdx], innerWrappers[targetIdx]],
      {
        yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor),
      },
      {
        yPercent: 0,
        duration: 1.1,
      },
      0
    )
      .fromTo(
        images[targetIdx],
        { yPercent: 15 * dFactor },
        { yPercent: 0, duration: 1.1 },
        0
      );

    const headingEl = headings[targetIdx];
    if (headingEl) {
      const letters = headingEl.querySelectorAll('.char-span');
      if (letters.length > 0) {
        tl.fromTo(
          letters,
          {
            autoAlpha: 0,
            yPercent: 120 * dFactor,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.015,
          },
          0.2
        );
      }
    }

    currentIndexRef.current = targetIdx;
    setCurrentIndex(targetIdx);
  };

  const handleAddToCart = (slide) => {
    dispatch(
      addToCart({
        _id: `exhibition-${slide.id}`,
        name: `Ediot Breeze - ${slide.flaconName} (50ML)`,
        image: slide.bgImage,
        price: slide.price,
        countInStock: 8,
        qty: 1,
      })
    );
    setAddedItem(slide.id);
    setTimeout(() => setAddedItem(null), 2500);
  };

  // Helper to split text into animated character spans
  const renderSplitText = (text) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="char-span"
        style={{
          display: 'inline-block',
          whiteSpace: char === ' ' ? 'pre' : 'normal',
          willChange: 'transform, opacity',
        }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      id="exhibition"
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--color-cream, #FDFCFA)',
      }}
    >
      {/* Sticky Pinned Viewport Container */}
      <div
        ref={stickyWrapperRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: '680px',
          overflow: 'hidden',
          borderTop: '1px solid rgba(184, 149, 106, 0.25)',
          borderBottom: '1px solid rgba(184, 149, 106, 0.25)',
        }}
      >
        {/* Top Floating Exhibition Header Bar */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '0',
            right: '0',
            padding: '0 5%',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(184, 149, 106, 0.35)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#1D1D1F',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              }}
            >
              <span style={{ color: '#B8956A' }}>✦</span>
              <span>Parfumerie Exhibition • Sticky Parallax Story</span>
            </div>
          </div>

          {/* Slide Counter */}
          <div
            style={{
              pointerEvents: 'auto',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(184, 149, 106, 0.35)',
              borderRadius: '999px',
              padding: '6px 18px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: '#1D1D1F',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            }}
          >
            0{currentIndex + 1} <span style={{ color: '#8E8E93' }}>/</span> 0{total}
          </div>
        </div>

        {/* Dual Counter-Translating Full-Bleed Slides */}
        {EXHIBITION_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            ref={(el) => (sectionsRef.current[idx] = el)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              visibility: 'hidden',
            }}
          >
            {/* Outer Wrapper: Translates Up/Down */}
            <div
              ref={(el) => (outerRefs.current[idx] = el)}
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              {/* Inner Wrapper: Counter-Translates Opposite */}
              <div
                ref={(el) => (innerRefs.current[idx] = el)}
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Background Image Layer with Parallax Glide */}
                <div
                  ref={(el) => (bgRefs.current[idx] = el)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `
                      linear-gradient(180deg, rgba(20, 20, 20, 0.65) 0%, rgba(10, 15, 12, 0.45) 50%, rgba(10, 10, 10, 0.8) 100%),
                      url("${slide.bgImage}")
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Center Dramatic Typography & Narrative Content */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 5,
                      textAlign: 'center',
                      maxWidth: '960px',
                      padding: '0 24px',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase',
                        color: '#F4D06F',
                        fontWeight: 700,
                        marginBottom: '16px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                      }}
                    >
                      <span>{slide.chapter}</span>
                      <span>•</span>
                      <span>{slide.tag}</span>
                    </div>

                    {/* Split Text Heading Animated with GSAP */}
                    <h2
                      ref={(el) => (headingRefs.current[idx] = el)}
                      style={{
                        fontSize: 'clamp(32px, 5vw, 68px)',
                        fontWeight: 700,
                        lineHeight: 1.12,
                        letterSpacing: '-0.02em',
                        marginBottom: '18px',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-display)',
                        textShadow: '0 4px 24px rgba(0,0,0,0.6)',
                      }}
                    >
                      {renderSplitText(slide.title)}
                    </h2>

                    <div
                      style={{
                        fontSize: '15px',
                        color: '#F9F6F0',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        marginBottom: '20px',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      {slide.subtitle}
                    </div>

                    <p
                      style={{
                        fontSize: '16.5px',
                        lineHeight: 1.7,
                        color: 'rgba(255, 255, 255, 0.9)',
                        maxWidth: '680px',
                        margin: '0 auto 36px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                      }}
                    >
                      {slide.desc}
                    </p>

                    {/* Floating Action Glass Capsule */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '20px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1.5px solid rgba(184, 149, 106, 0.35)',
                        padding: '12px 24px',
                        borderRadius: '999px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                      }}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', color: '#B8956A', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                          {slide.flaconName}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1D1D1F' }}>
                          ${slide.price}{' '}
                          <span style={{ fontSize: '12px', color: '#8E8E93', fontWeight: 400 }}>USD</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(slide)}
                        style={{
                          padding: '12px 26px',
                          borderRadius: '999px',
                          background: addedItem === slide.id
                            ? 'linear-gradient(135deg, #2E6F40 0%, #1E4E2C 100%)'
                            : 'linear-gradient(135deg, #1D1D1F 0%, #000000 100%)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {addedItem === slide.id ? (
                          <>
                            <FiCheck style={{ fontSize: '16px' }} />
                            <span>Reserved</span>
                          </>
                        ) : (
                          <>
                            <FiShoppingBag style={{ fontSize: '15px' }} />
                            <span>Reserve Flacon</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Vertical Navigation Indicator Pills on Right Side */}
        <div
          style={{
            position: 'absolute',
            right: '36px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {EXHIBITION_SLIDES.map((s, i) => {
            const isActive = currentIndex === i;
            return (
              <button
                key={s.id}
                onClick={() => triggerGoto(i, i > currentIndex ? 1 : -1)}
                style={{
                  width: isActive ? '32px' : '10px',
                  height: '10px',
                  borderRadius: '999px',
                  background: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  padding: 0,
                  boxShadow: isActive ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
                }}
                title={s.title}
              />
            );
          })}
        </div>

        {/* Bottom Up/Down Step Controls & Sticky Scroll Progress Tip */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '6%',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={handlePrev}
            aria-label="Previous Chapter"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(184, 149, 106, 0.35)',
              color: '#1D1D1F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1D1D1F';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = '#1D1D1F';
            }}
          >
            <FiArrowUp />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Chapter"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(184, 149, 106, 0.35)',
              color: '#1D1D1F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1D1D1F';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = '#1D1D1F';
            }}
          >
            <FiArrowDown />
          </button>

          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.85)',
              marginLeft: '8px',
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}
          >
            Scroll naturally to scrub through chapters
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParallaxObserverExhibition;
