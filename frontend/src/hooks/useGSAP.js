import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAP = () => {
  const gsapRef = useRef(gsap);

  useEffect(() => {
    // Refresh ScrollTrigger on mount
    ScrollTrigger.refresh();

    return () => {
      // Kill all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return gsapRef.current;
};

// Fade in animation
export const fadeIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
};

// Stagger animation for multiple elements
export const staggerFadeIn = (elements, staggerAmount = 0.2) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: staggerAmount,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
};

// Scale animation
export const scaleIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
};

// Parallax effect
export const parallax = (element, speed = 0.5) => {
  gsap.to(element, {
    yPercent: 50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// Reveal text animation
export const revealText = (element) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 100, skewY: 7 },
    {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    }
  );
};
