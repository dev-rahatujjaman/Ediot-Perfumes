import { useState, useEffect, useRef } from 'react';

const VIDEOS = ['/videos/hero-video-1.mp4', '/videos/hero-video-2.mp4'];
const VIDEO_INTERVAL = 7000; // ms each video plays before crossfading
const FADE_DURATION = 1400;  // ms for the cross-dissolve

const HeroSection = () => {
  // Video crossfade state: which slot is "front" and which opacity values
  const [frontSlot, setFrontSlot] = useState(0); // 0 or 1
  const [opacities, setOpacities] = useState([1, 0]);
  const crossfadeTimer = useRef(null);
  const videoRefs = [useRef(null), useRef(null)];
  const slotUrlRef = useRef([VIDEOS[0], VIDEOS[1]]);
  const currentVideoIndexRef = useRef(0);

  // ─── Video Crossfade Engine ──────────────────────────────────────────────
  const startCrossfade = () => {
    const nextVideoIndex = (currentVideoIndexRef.current + 1) % VIDEOS.length;
    const nextUrl = VIDEOS[nextVideoIndex];

    const backSlot = frontSlot === 0 ? 1 : 0;

    slotUrlRef.current[backSlot] = nextUrl;
    const backVideo = videoRefs[backSlot].current;
    if (backVideo) {
      backVideo.src = nextUrl;
      backVideo.load();
      backVideo.play().catch(() => {});
    }

    const startTime = performance.now();
    const fromOpacities = [...opacities];
    const toOpacities = frontSlot === 0 ? [0, 1] : [1, 0];

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / FADE_DURATION, 1);
      // Smooth ease in-out cubic
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const newOps = [
        fromOpacities[0] + (toOpacities[0] - fromOpacities[0]) * ease,
        fromOpacities[1] + (toOpacities[1] - fromOpacities[1]) * ease,
      ];
      setOpacities(newOps);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setFrontSlot(backSlot);
        currentVideoIndexRef.current = nextVideoIndex;
        setOpacities(toOpacities);
      }
    };
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    videoRefs[0].current?.play().catch(() => {});
    videoRefs[1].current?.play().catch(() => {});

    crossfadeTimer.current = setInterval(() => {
      startCrossfade();
    }, VIDEO_INTERVAL);

    return () => clearInterval(crossfadeTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontSlot]);

  return (
    <section className="hero-video-section">
      {/* ─── DUAL VIDEO CROSSFADE BACKGROUND ─────────────────────────── */}
      {[0, 1].map((slot) => (
        <video
          key={slot}
          ref={videoRefs[slot]}
          src={VIDEOS[slot]}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: opacities[slot],
            zIndex: 0,
          }}
        />
      ))}

      {/* ─── OPACITY OVERLAY ──────────────────────────────────────────── */}
      <div className="hero-video-overlay" />

      {/* ─── BOTTOM GRADIENT ──────────────────────────────────────────── */}
      <div className="hero-video-gradient" />
    </section>
  );
};

export default HeroSection;
