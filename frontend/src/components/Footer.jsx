import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiMail,
  FiArrowUp,
  FiCompass,
  FiShield,
  FiAward,
  FiCheck,
  FiPhoneCall,
  FiMapPin
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const canvasRef = useRef(null);
  const footerRef = useRef(null);
  const butterflyLayerRef = useRef(null);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  // ─── Interactive Slow Gray Detailed Butterfly Cursor Trail on Hover ───────
  useEffect(() => {
    const footer = footerRef.current;
    const butterflyLayer = butterflyLayerRef.current;
    if (!footer || !butterflyLayer) return;

    // Subtle variations of soft grays, silver, slate, and moonstone
    const BUTTERFLY_PALETTES = [
      { c1: '#cfd8dc', c2: '#b0bec5', c3: '#90a4ae' }, // Soft Silver Slate
      { c1: '#eceff1', c2: '#cfd8dc', c3: '#b0bec5' }, // Moonstone White Gray
      { c1: '#b0bec5', c2: '#90a4ae', c3: '#78909c' }, // Slate Gray
      { c1: '#90a4ae', c2: '#78909c', c3: '#546e7a' }, // Deep Platinum Smoke
      { c1: '#e2e8f0', c2: '#cbd5e1', c3: '#94a3b8' }, // Cool Slate
      { c1: '#d8dee9', c2: '#e5e9f0', c3: '#eceff4' }, // Arctic Silver Mist
    ];

    let moveCounter = 0;

    const createButterfly = (x, y) => {
      const butterfly = document.createElement('div');
      butterfly.className = 'detailed-butterfly';

      const size = Math.random() * 12 + 20; // 20px to 32px delicate scale
      butterfly.style.width = `${size}px`;
      butterfly.style.height = `${size * 0.92}px`;
      butterfly.style.left = `${x - size / 2}px`;
      butterfly.style.top = `${y - (size * 0.92) / 2}px`;

      const color = BUTTERFLY_PALETTES[Math.floor(Math.random() * BUTTERFLY_PALETTES.length)];
      const uid = 'bf_' + Math.random().toString(36).substring(2, 9);

      // High-detail anatomical wings, veins, scalloped margins & antennae
      butterfly.innerHTML = `
        <div class="butterfly-3d-wrap">
          <!-- Left Wing (Flaps along Y-axis) -->
          <div class="butterfly-wing-wrap left-wing">
            <svg viewBox="0 0 50 55" class="wing-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g_${uid}_l" x1="100%" y1="50%" x2="0%" y2="0%">
                  <stop offset="0%" stop-color="${color.c1}" stop-opacity="0.95" />
                  <stop offset="55%" stop-color="${color.c2}" stop-opacity="0.88" />
                  <stop offset="100%" stop-color="${color.c3}" stop-opacity="0.75" />
                </linearGradient>
              </defs>
              <!-- Forewing -->
              <path d="M 48 24 C 44 14, 30 2, 10 1 C 1 0.5, 0 6, 2 15 C 4 24, 16 31, 48 26 Z" fill="url(#g_${uid}_l)" />
              <!-- Hindwing -->
              <path d="M 46 25 C 32 30, 12 32, 8 40 C 6 48, 18 54, 28 52 C 38 50, 44 42, 46 28 Z" fill="url(#g_${uid}_l)" />
              <!-- Wing Venation Architecture -->
              <path d="M 48 24 Q 28 16 10 1" stroke="rgba(255,255,255,0.75)" stroke-width="0.8" fill="none" />
              <path d="M 36 20 Q 20 12 4 8" stroke="rgba(255,255,255,0.45)" stroke-width="0.5" fill="none" />
              <path d="M 30 22 Q 15 20 2 16" stroke="rgba(255,255,255,0.45)" stroke-width="0.5" fill="none" />
              <path d="M 46 28 Q 30 38 8 42" stroke="rgba(255,255,255,0.45)" stroke-width="0.5" fill="none" />
              <path d="M 40 33 Q 26 46 20 52" stroke="rgba(255,255,255,0.4)" stroke-width="0.5" fill="none" />
              <!-- Submarginal Pearl Accents -->
              <circle cx="4" cy="11" r="0.75" fill="rgba(255,255,255,0.9)" />
              <circle cx="6" cy="18" r="0.75" fill="rgba(255,255,255,0.85)" />
              <circle cx="10" cy="44" r="0.75" fill="rgba(255,255,255,0.85)" />
              <circle cx="18" cy="50" r="0.75" fill="rgba(255,255,255,0.85)" />
            </svg>
          </div>

          <!-- Right Wing (Flaps along Y-axis) -->
          <div class="butterfly-wing-wrap right-wing">
            <svg viewBox="0 0 50 55" class="wing-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g_${uid}_r" x1="0%" y1="50%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="${color.c1}" stop-opacity="0.95" />
                  <stop offset="55%" stop-color="${color.c2}" stop-opacity="0.88" />
                  <stop offset="100%" stop-color="${color.c3}" stop-opacity="0.75" />
                </linearGradient>
              </defs>
              <!-- Forewing -->
              <path d="M 2 24 C 6 14, 20 2, 40 1 C 49 0.5, 50 6, 48 15 C 46 24, 34 31, 2 26 Z" fill="url(#g_${uid}_r)" />
              <!-- Hindwing -->
              <path d="M 4 25 C 18 30, 38 32, 42 40 C 44 48, 32 54, 22 52 C 12 50, 6 42, 4 28 Z" fill="url(#g_${uid}_r)" />
              <!-- Wing Venation Architecture -->
              <path d="M 2 24 Q 22 16 40 1" stroke="rgba(255,255,255,0.75)" stroke-width="0.8" fill="none" />
              <path d="M 14 20 Q 30 12 46 8" stroke="rgba(255,255,255,0.45)" stroke-width="0.5" fill="none" />
              <path d="M 20 22 Q 35 20 48 16" stroke="rgba(255,255,255,0.45)" stroke-width="0.5" fill="none" />
              <path d="M 4 28 Q 20 38 42 42" stroke="rgba(255,255,255,0.45)" stroke-width="0.5" fill="none" />
              <path d="M 10 33 Q 24 46 30 52" stroke="rgba(255,255,255,0.4)" stroke-width="0.5" fill="none" />
              <!-- Submarginal Pearl Accents -->
              <circle cx="46" cy="11" r="0.75" fill="rgba(255,255,255,0.9)" />
              <circle cx="44" cy="18" r="0.75" fill="rgba(255,255,255,0.85)" />
              <circle cx="40" cy="44" r="0.75" fill="rgba(255,255,255,0.85)" />
              <circle cx="32" cy="50" r="0.75" fill="rgba(255,255,255,0.85)" />
            </svg>
          </div>

          <!-- Slender Thorax, Abdomen & Curled Antennae -->
          <svg viewBox="0 0 16 55" class="butterfly-body-svg">
            <path d="M 7 14 C 4 9, 1 5, 0 4" stroke="#455a64" stroke-width="0.8" fill="none" stroke-linecap="round" />
            <circle cx="0" cy="4" r="0.75" fill="#37474f" />
            <path d="M 9 14 C 12 9, 15 5, 16 4" stroke="#455a64" stroke-width="0.8" fill="none" stroke-linecap="round" />
            <circle cx="16" cy="4" r="0.75" fill="#37474f" />
            <ellipse cx="8" cy="16" rx="1.6" ry="1.6" fill="#37474f" />
            <ellipse cx="8" cy="23" rx="1.9" ry="3.8" fill="#455a64" />
            <path d="M 8 28 C 6.6 30, 6.6 40, 8 44 C 9.4 40, 9.4 30, 8 28 Z" fill="#263238" />
            <line x1="7" y1="32" x2="9" y2="32" stroke="rgba(255,255,255,0.25)" stroke-width="0.5" />
            <line x1="7" y1="36" x2="9" y2="36" stroke="rgba(255,255,255,0.25)" stroke-width="0.5" />
            <line x1="7.2" y1="40" x2="8.8" y2="40" stroke="rgba(255,255,255,0.25)" stroke-width="0.5" />
          </svg>
        </div>
      `;

      butterflyLayer.appendChild(butterfly);

      // RANDOM 360-DEGREE DIRECTIONS & SLOW FLOATING VELOCITY
      const speed = Math.random() * 0.8 + 0.5; // Slow, calm float (0.5 to 1.3 px/frame)
      const moveAngle = Math.random() * Math.PI * 2; // Full 360-degree direction
      const velocityX = Math.cos(moveAngle) * speed;
      const velocityY = Math.sin(moveAngle) * speed;

      let currentX = 0;
      let currentY = 0;
      let opacity = 0.92;
      let scale = 1;
      let tick = Math.random() * Math.PI * 2;
      const wobbleSpeed = Math.random() * 0.08 + 0.04;

      // Orient butterfly toward flight heading
      const baseAngle = Math.atan2(velocityY, velocityX) * (180 / Math.PI) + 90;

      const animateFlight = () => {
        tick += wobbleSpeed;
        currentX += velocityX + Math.sin(tick) * 0.35;
        currentY += velocityY + Math.cos(tick) * 0.35;
        opacity -= 0.005; // Slow, graceful fade
        scale -= 0.0016;  // Gradual shrink

        if (opacity <= 0 || scale <= 0) {
          butterfly.remove();
        } else {
          const wobbleAngle = Math.sin(tick) * 6;
          butterfly.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${baseAngle + wobbleAngle}deg) scale(${scale})`;
          butterfly.style.opacity = opacity;
          requestAnimationFrame(animateFlight);
        }
      };

      requestAnimationFrame(animateFlight);
    };

    const handleMouseMove = (e) => {
      moveCounter++;
      // Spawn at serene interval for a calm, luxurious effect
      if (moveCounter % 4 !== 0) return;

      const rect = footer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createButterfly(x, y);
    };

    footer.addEventListener('mousemove', handleMouseMove);

    return () => {
      footer.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Interactive Mouse-Following Gold & Champagne Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 60;
    const particles = [];
    const mouse = { x: -1000, y: -1000, radius: 140, active: false };

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 10;
        this.originX = this.x;
        this.originY = this.y;
        this.size = Math.random() * 2.0 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.35 - 0.1;
        this.alpha = Math.random() * 0.4 + 0.15;
        this.baseAlpha = this.alpha;
        this.pulse = Math.random() * Math.PI;
        this.color = Math.random() > 0.4 ? '#B8956A' : '#D4B895';
      }

      update() {
        this.y += this.vy;
        this.x += this.vx + Math.sin(this.pulse) * 0.2;
        this.pulse += 0.02;

        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 2.0;
            this.y += Math.sin(angle) * force * 2.0;
            this.alpha = Math.min(1, this.baseAlpha + force * 0.4);
          } else {
            this.alpha += (this.baseAlpha - this.alpha) * 0.05;
          }
        }

        if (this.y < -20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(184, 149, 106, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75) {
            const alpha = (1 - dist / 75) * 0.15;
            ctx.strokeStyle = `rgba(184, 149, 106, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouse.active) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        glowGrad.addColorStop(0, 'rgba(184, 149, 106, 0.08)');
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      drawConnections();

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const footerElem = canvas.parentElement;
    if (footerElem) {
      footerElem.addEventListener('mousemove', handleMouseMove);
      footerElem.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (footerElem) {
        footerElem.removeEventListener('mousemove', handleMouseMove);
        footerElem.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer
      ref={footerRef}
      style={{
        background: 'var(--color-warm-white, #FFFBF7)',
        color: '#1D1D1F',
        position: 'relative',
        paddingTop: '80px',
        paddingBottom: '0px',
        borderTop: '1.5px solid rgba(184, 149, 106, 0.2)',
        boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.02)',
        overflow: 'hidden',
      }}
    >
      {/* ─── BUTTERFLY CURSOR TRAIL CONTAINER ────────────────────────── */}
      <div
        ref={butterflyLayerRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 50,
        }}
      />

      {/* Interactive Background Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Top Centered Brand Logo & Crest */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              marginBottom: '18px',
              textDecoration: 'none',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src="/images/logo.png"
              alt="EDIOT Haute Parfumerie"
              style={{
                height: '95px',
                width: 'auto',
                objectFit: 'cover',
                filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.08))',
              }}
            />
          </Link>

          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#FFFFFF',
              border: '1px solid rgba(184, 149, 106, 0.35)',
              padding: '8px 22px',
              borderRadius: '999px',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#B8956A',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              marginBottom: '14px',
            }}>
              <span>✦</span>
              <span>Atelier de Haute Parfumerie • Paris</span>
              <span>✦</span>
            </div>

            <div style={{
              fontSize: '13px',
              color: '#6E6E73',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              Mouth-Blown French Crystal • 32% Pure Extrait de Parfum
            </div>
          </div>
        </div>

        {/* Main 4-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '48px',
          marginBottom: '56px',
        }}>
          {/* Column 1: Brand & Heritage */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B8956A',
              fontWeight: 700,
              marginBottom: '12px',
            }}>
              <FiCompass /> Paris • Grasse • Place Vendôme
            </div>
            <h3 style={{
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '16px',
              color: '#1D1D1F',
              fontFamily: 'var(--font-display)',
            }}>
              EDIOT BREEZE
            </h3>
            <p style={{
              color: '#6E6E73',
              lineHeight: 1.75,
              fontSize: '14.5px',
              marginBottom: '24px',
            }}>
              Mastercrafted extraits de parfum, concentrated at 32% pure botanical density. Each formulation weaves rare Grasse harvests with timeless French alchemical artistry.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: <FiInstagram />, href: 'https://instagram.com', label: 'Instagram' },
                { icon: <FiFacebook />, href: 'https://facebook.com', label: 'Facebook' },
                { icon: <FiTwitter />, href: 'https://twitter.com', label: 'Twitter' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1px solid rgba(184, 149, 106, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1D1D1F',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1D1D1F';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.background = '#1D1D1F';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(184, 149, 106, 0.3)';
                    e.currentTarget.style.color = '#1D1D1F';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Haute Collections */}
          <div>
            <h4 style={{
              fontSize: '13px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#B8956A',
              marginBottom: '20px',
              fontWeight: 700,
            }}>
              Master Collections
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { name: 'Only For You (Signature Extrait)', href: '/product/mock-1' },
                { name: 'Morning Bloom (Solar Neroli)', href: '/#fragrances' },
                { name: 'Velvet Santal (Bourbon Amber)', href: '/#fragrances' },
                { name: 'Grasse Rose Noire (Centifolia Oud)', href: '/#fragrances' },
                { name: 'Imperial Ambergris (Florentine Iris)', href: '/#fragrances' },
                { name: 'Discovery Extrait Set (5 × 10ML)', href: '/#fragrances' },
              ].map((link, i) => (
                <li key={i} style={{ marginBottom: '12px' }}>
                  <a
                    href={link.href}
                    style={{
                      color: '#6E6E73',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#B8956A')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E73')}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: The Maison & Heritage */}
          <div>
            <h4 style={{
              fontSize: '13px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#B8956A',
              marginBottom: '20px',
              fontWeight: 700,
            }}>
              The Maison
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { name: 'The Four Sacred Extraction Stages', href: '/#alchemy' },
                { name: 'Olfactory Note Accord Architecture', href: '/#olfactory' },
                { name: 'Interactive Scent Finder Questionnaire', href: '/#finder' },
                { name: 'Master Ingredients Guild & Heritage', href: '/#notes' },
                { name: 'Boutique Locations: Paris • London • NYC • Tokyo', href: '/#experience' },
                { name: 'Authenticity & Serial Number Verification', href: '/#exhibition' },
              ].map((link, i) => (
                <li key={i} style={{ marginBottom: '12px' }}>
                  <a
                    href={link.href}
                    style={{
                      color: '#6E6E73',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#B8956A')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6E73')}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Private Salon Gazette & Concierge */}
          <div>
            <h4 style={{
              fontSize: '13px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#B8956A',
              marginBottom: '20px',
              fontWeight: 700,
            }}>
              Private Gazette
            </h4>
            <p style={{
              color: '#6E6E73',
              fontSize: '14px',
              lineHeight: 1.6,
              marginBottom: '18px',
            }}>
              Receive private invitations to confidential harvest allocations, bespoke flacon releases, and invitations to masterclass salons.
            </p>

            <form onSubmit={handleSubscribe} style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                background: '#FFFFFF',
                border: '1px solid rgba(184, 149, 106, 0.35)',
                borderRadius: '999px',
                padding: '4px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}>
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '10px 16px',
                    color: '#1D1D1F',
                    fontSize: '13px',
                    flex: 1,
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #1D1D1F 0%, #000000 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '10px 20px',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {subscribed ? <FiCheck /> : 'Join'}
                </button>
              </div>
              {subscribed && (
                <div style={{ color: '#2E6F40', fontSize: '12px', marginTop: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiCheck />
                  <span>Welcome to the Ediot Breeze Private Gazette.</span>
                </div>
              )}
            </form>

            <div style={{
              fontSize: '12px',
              color: '#8E8E93',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <FiShield style={{ color: '#B8956A' }} />
              <span>Discreet delivery & strict client confidentiality</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div style={{
          borderTop: '1px solid rgba(184, 149, 106, 0.18)',
          paddingTop: '28px',
          paddingBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '13px',
          color: '#8E8E93',
          position: 'relative',
          zIndex: 3,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <img
              src="/images/logo.png"
              alt="EDIOT Breeze Logo"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'cover',
                opacity: 0.9,
              }}
            />
            <span>
              © {currentYear} EDIOT BREEZE Haute Parfumerie Paris. All rights reserved.
            </span>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FFFFFF',
              border: '1px solid rgba(184, 149, 106, 0.35)',
              color: '#1D1D1F',
              padding: '8px 20px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1D1D1F';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#1D1D1F';
            }}
          >
            <span>Back to Top</span>
            <FiArrowUp />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SEAMLESS BOTANICAL MEADOW FLOOR (INTEGRATED DIRECTLY IN FOOTER)
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'hidden',
          lineHeight: 0,
          margin: 0,
          padding: 0,
          marginTop: '-10px',
          zIndex: 2,
        }}
      >
        {/* Soft Golden Pollen Sparkles floating over the flowers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          {[
            { left: '15%', bottom: '40%', size: 3, dur: '3.5s', delay: '0s' },
            { left: '28%', bottom: '60%', size: 4, dur: '4.2s', delay: '0.7s' },
            { left: '46%', bottom: '35%', size: 2.5, dur: '2.9s', delay: '1.2s' },
            { left: '64%', bottom: '65%', size: 3.5, dur: '3.8s', delay: '0.4s' },
            { left: '82%', bottom: '45%', size: 3, dur: '4.4s', delay: '1.8s' },
          ].map((spore, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: spore.left,
                bottom: spore.bottom,
                width: `${spore.size}px`,
                height: `${spore.size}px`,
                borderRadius: '50%',
                background: '#D4AF37',
                boxShadow: '0 0 8px 2px rgba(212, 175, 55, 0.7)',
                animation: `floatLightSpore ${spore.dur} ease-in-out infinite alternate`,
                animationDelay: spore.delay,
              }}
            />
          ))}
        </div>

        {/* The Seamless Botanical Garden Meadow */}
        <img
          src="/images/botanical-footer.gif"
          alt="Living Botanical Flora & Sunflowers"
          style={{
            width: '100%',
            minWidth: '1200px',
            maxHeight: '280px',
            objectFit: 'cover',
            objectPosition: 'bottom center',
            display: 'block',
            margin: 0,
            padding: 0,
            filter: 'contrast(1.05) saturate(1.08)',
            transform: 'translateZ(0)',
          }}
        />

        <style>{`
          /* ─── DETAILED 3D SLOW GRAY BUTTERFLY CURSOR TRAIL STYLES ───── */
          .detailed-butterfly {
            position: absolute;
            pointer-events: none;
            transform-style: preserve-3d;
            will-change: transform, opacity;
            z-index: 50;
          }

          .butterfly-3d-wrap {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
          }

          .butterfly-wing-wrap {
            position: absolute;
            top: 0;
            width: 50%;
            height: 100%;
            transform-style: preserve-3d;
          }

          .butterfly-wing-wrap.left-wing {
            left: 0;
            transform-origin: right center;
            animation: flap-left 0.28s infinite alternate ease-in-out;
          }

          .butterfly-wing-wrap.right-wing {
            right: 0;
            transform-origin: left center;
            animation: flap-right 0.28s infinite alternate ease-in-out;
          }

          .wing-svg {
            width: 100%;
            height: 100%;
            display: block;
            filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.22));
          }

          .butterfly-body-svg {
            position: absolute;
            left: 50%;
            top: 0;
            width: 16%;
            height: 100%;
            transform: translateX(-50%);
            z-index: 10;
            pointer-events: none;
            overflow: visible;
          }

          @keyframes flap-left {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(65deg); }
          }

          @keyframes flap-right {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(-65deg); }
          }

          @keyframes floatLightSpore {
            0% {
              transform: translateY(0px) scale(0.8);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-16px) translateX(4px) scale(1.15);
              opacity: 0.85;
            }
            100% {
              transform: translateY(-28px) translateX(-3px) scale(0.9);
              opacity: 0.2;
            }
          }
        `}</style>
      </div>
    </footer>
  );
};

export default Footer;
