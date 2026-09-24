import React from 'react';

const PRESS_QUOTES = [
  { quote: '“A masterclass in modern niche perfumery.”', publication: 'VOGUE' },
  { quote: '“Longevity that defies commercial boundaries.”', publication: 'GQ MAGAZINE' },
  { quote: '“The most captivating amber opening of the decade.”', publication: 'HARPER’S BAZAAR' },
  { quote: '“Pure French craftsmanship at its absolute zenith.”', publication: 'FORBES LUXURY' },
  { quote: '“An intimate scent that lingers like fine silk.”', publication: 'ELLE' },
  { quote: '“The gold standard of extrait concentration.”', publication: 'ROBB REPORT' },
];

const PressBanner = () => {
  return (
    <div style={{
      background: 'var(--color-black)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '36px 0',
      overflow: 'hidden',
      position: 'relative',
      color: 'white',
    }}>
      <div style={{
        display: 'flex',
        width: 'max-content',
        animation: 'marquee 35s linear infinite',
        gap: '64px',
      }}>
        {[...PRESS_QUOTES, ...PRESS_QUOTES].map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{
              fontSize: '17px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
            }}>
              {item.quote}
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
            }}>
              — {item.publication}
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '14px' }}>✦</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default PressBanner;
