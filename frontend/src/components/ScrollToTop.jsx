import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If navigating to an anchor link on the same or target page, let smooth scroll handle it
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    // Instantly scroll window to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // Also reset Lenis smooth scroll if available
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
