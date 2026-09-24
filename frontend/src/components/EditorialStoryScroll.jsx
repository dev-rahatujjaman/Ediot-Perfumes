import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FIGURES = [
  {
    id: 1,
    name: 'Marina',
    title: 'Centifolia Absolu',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=85',
    tag: 'N° 07 Grasse',
    imgPosition: 'center',
    imgScale: 1.1,
  },
  {
    id: 2,
    name: 'Léonard',
    title: 'Santal de Mysore',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=85',
    tag: '35% Extrait',
    imgPosition: 'center',
    imgScale: 1.05,
  },
  {
    id: 3,
    name: 'Elena',
    title: 'Only For You Signature',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=85',
    tag: 'Pure Flacon',
    imgPosition: 'center',
    imgScale: 1.08,
  },
];

const EditorialStoryScroll = () => {
  const triggerRef = useRef(null);
  const pinRef = useRef(null);
  const figuresRef = useRef([]);

  useEffect(() => {
    const trigger = triggerRef.current;
    const pin = pinRef.current;
    const figs = figuresRef.current.filter(Boolean);

    if (!trigger || !pin || figs.length < 3) return;

    const ctx = gsap.context(() => {
      const vH = window.innerHeight;
      const vW = window.innerWidth;
      const figH = figs[0].offsetHeight || 340;

      const currentTop = vH * 0.7; // figures container positioned at 70% from top
      const targetCenter = vH * 0.5;
      const offset = targetCenter - currentTop - figH / 2;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: '+=250%',
          pin: pin,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        figs[0],
        {
          x: -vW * (vW < 768 ? 0.04 : 0.07),
          y: offset,
          scale: 1.08,
          rotation: 5,
          ease: 'power1.inOut',
          duration: 1,
        },
        0
      )
        .to(
          figs[1],
          {
            x: vW * (vW < 768 ? 0.04 : 0.07),
            y: offset - figH * 0.95,
            scale: 1.14,
            rotation: -7,
            ease: 'power1.inOut',
            duration: 3,
          },
          0
        )
        .to(
          figs[2],
          {
            x: 0,
            y: offset - figH * 1.9,
            scale: 1.05,
            rotation: -2.5,
            ease: 'power1.inOut',
            duration: 5.5,
          },
          0
        );
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={triggerRef}
      className="editorial-scroll-wrapper"
      style={{
        position: 'relative',
        height: '350vh',
        backgroundColor: '#faf5ed',
      }}
    >
      {/* Pinned Viewport Stage */}
      <main
        ref={pinRef}
        className="editorial-story-main"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'grid',
          placeItems: 'center',
          backgroundColor: '#faf5ed',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Subtle Decorative Editorial Subheading */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#B8956A',
            fontWeight: 700,
            zIndex: 15,
            pointerEvents: 'none',
          }}
        >
          <span>✦</span>
          <span>The Alchemical Canvas</span>
          <span>✦</span>
        </div>

        {/* Exclusion Blended Hero Statement */}
        <h1 className="editorial-story-headline">
          every stroke on the screen is a spark of a world only you can bring to life.
        </h1>

        {/* Floating Animated Figures Track */}
        <div className="figures-track">
          {FIGURES.map((item, idx) => (
            <figure
              key={item.id}
              ref={(el) => (figuresRef.current[idx] = el)}
              className={`editorial-figure-card figure-${idx + 1}`}
            >
              <div className="img-container">
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    objectPosition: item.imgPosition,
                    transform: `scale(${item.imgScale})`,
                  }}
                />
              </div>
              <figcaption>
                <span>{item.name}</span>
                <span className="figure-tag">{item.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </main>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500..700&display=swap");

        .editorial-story-headline {
          font-family: "Dancing Script", cursive;
          font-size: clamp(36px, 5.4vw, 84px);
          font-weight: 700;
          text-align: center;
          width: clamp(320px, 75vw, 1100px);
          line-height: 1.45;
          color: #faf5ed;
          z-index: 12;
          mix-blend-mode: exclusion;
          pointer-events: none;
          text-wrap: balance;
          user-select: none;
          padding: 0 16px;
        }

        .figures-track {
          position: absolute;
          top: 70%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: auto;
          z-index: 5;
        }

        .editorial-figure-card {
          display: flex;
          flex-direction: column;
          width: clamp(260px, 26vw, 360px);
          aspect-ratio: 30 / 28;
          padding: 12px 12px 16px 12px;
          background-color: #1a1a1c;
          border-radius: 18px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
          margin-bottom: 24px;
          cursor: pointer;
          transition: box-shadow 0.35s ease, border-color 0.35s ease;
          will-change: transform;
        }

        .editorial-figure-card:hover {
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.45), 0 0 0 1.5px rgba(212, 175, 55, 0.45);
        }

        .editorial-figure-card .img-container {
          overflow: hidden;
          border-radius: 12px;
          width: 100%;
          aspect-ratio: 1;
          background-color: #111;
        }

        .editorial-figure-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .editorial-figure-card:hover img {
          transform: scale(1.12) !important;
        }

        .editorial-figure-card figcaption {
          font-family: "Dancing Script", cursive;
          font-weight: 600;
          font-size: 24px;
          color: #faf5ed;
          margin-top: 12px;
          padding: 0 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .editorial-figure-card .figure-tag {
          font-family: var(--font-text, sans-serif);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #B8956A;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .editorial-figure-card {
            width: clamp(230px, 70vw, 290px);
          }
          .editorial-story-headline {
            font-size: clamp(28px, 7vw, 44px);
            width: 90vw;
          }
        }
      `}</style>
    </div>
  );
};

export default EditorialStoryScroll;
