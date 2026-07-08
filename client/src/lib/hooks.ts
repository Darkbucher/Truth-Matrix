import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Reveals `.reveal` child elements as they scroll into view.
 * Observes the given section ref for scroll events.
 */
export const useScrollReveal = (sectionRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const revealElements = section.querySelectorAll<Element>('.reveal');

    const checkReveal = () => {
      revealElements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 120) {
          el.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', checkReveal, { passive: true });
    checkReveal(); // run once on mount

    return () => {
      window.removeEventListener('scroll', checkReveal);
    };
  }, [sectionRef]);
};
