import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useLenis = () => {
  useEffect(() => {
    let lenis;
    let tickerHandler;

    try {
      lenis = new Lenis({
        lerp: 0.06, // Slower, weighted, velvety luxury scroll interpolation
        duration: 1.6,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.5,
        infinite: false,
      });

      // Expose globally for instant scroll restoration on route changes
      window.__lenis = lenis;

      document.documentElement.classList.add('lenis');

      // Bind Lenis scroll events to GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      // Synchronize GSAP ticker with Lenis requestAnimationFrame
      tickerHandler = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerHandler);
      gsap.ticker.lagSmoothing(0);
    } catch (err) {
      console.warn('Lenis initialization note:', err);
    }

    return () => {
      if (tickerHandler) {
        gsap.ticker.remove(tickerHandler);
      }
      if (lenis) {
        lenis.destroy();
      }
      window.__lenis = null;
      document.documentElement.classList.remove('lenis');
    };
  }, []);
};
