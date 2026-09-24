import React, { useRef, useState } from 'react';
import { FiInstagram, FiArrowUpRight, FiPlay, FiVolume2, FiVolumeX } from 'react-icons/fi';

const LOOKS = [
  {
    id: 1,
    video: '/videos/lookbook-video-1.mp4',
    poster: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80',
    title: 'Golden Hour at Cap d’Antibes',
    scent: 'Santorini Breeze',
    handle: '@claire.voyage',
  },
  {
    id: 2,
    video: '/videos/lookbook-video-2.mp4',
    poster: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    title: 'The Parisian Atelier Chamber',
    scent: 'Only For You',
    handle: '@maison.noir',
  },
  {
    id: 3,
    video: '/videos/lookbook-video-3.mp4',
    poster: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
    title: 'Midnight in Milan',
    scent: 'Velvet Midnight',
    handle: '@gianluigi.m',
  },
  {
    id: 4,
    video: '/videos/lookbook-video-4.mp4',
    poster: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=800&q=80',
    title: 'Dawn Extraction in Grasse',
    scent: 'Pure Ambergris',
    handle: '@botanica.parfum',
  },
];

const LookbookCard = ({ item }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        height: '480px',
        cursor: 'pointer',
        background: '#0a0a0c',
      }}
      className="lookbook-item"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src={item.video}
        poster={item.poster}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      {/* Subtle Overlay Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          color: 'white',
          pointerEvents: 'none',
        }}
      >
        {/* Top bar with audio toggle button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            style={{
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.25s ease',
            }}
          >
            {isMuted ? <FiVolumeX /> : <FiVolume2 />}
          </button>
        </div>

        {/* Bottom Details */}
        <div>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#D4AF37',
            fontWeight: 700,
            marginBottom: '4px',
          }}>
            {item.scent}
          </div>
          <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '6px', fontWeight: 600 }}>
            {item.title}
          </h4>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            {item.handle}
          </div>
        </div>
      </div>
    </div>
  );
};

const LookbookSection = () => {
  return (
    <section style={{
      padding: '160px 0',
      background: 'var(--color-cream)',
      position: 'relative',
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '64px',
          flexWrap: 'wrap',
          gap: '20px',
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
              Editorial Lookbook
            </div>
            <h2>#TheScentOfPresence</h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '14px',
              color: 'var(--color-black)',
            }}
          >
            <FiInstagram style={{ fontSize: '18px' }} /> Follow @EdiotBreeze <FiArrowUpRight />
          </a>
        </div>

        {/* Lookbook 4-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {LOOKS.map((item) => (
            <LookbookCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <style>{`
        .lookbook-item:hover video {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
};

export default LookbookSection;
