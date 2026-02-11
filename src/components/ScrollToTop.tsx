// src/components/ScrollToTop.tsx (eller der du har den)
import React, { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollTopHard() {
  // Window
  window.scrollTo(0, 0);

  // Fallbacks
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const root = document.scrollingElement as HTMLElement | null;
  if (root) root.scrollTop = 0;
}

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  // 1) Slå av browser scroll-restore
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // 2) Kjør før paint + etter paint (for å vinne mot layout/focus)
  useLayoutEffect(() => {
    if (hash) return;

    // Scroll nå
    scrollTopHard();

    // Fjern fokus (stopper at browser scroller for å vise fokus-element)
    const active = document.activeElement as HTMLElement | null;
    if (active && typeof active.blur === "function") active.blur();

    // Scroll igjen etter at layout setter seg
    requestAnimationFrame(() => {
      scrollTopHard();
      requestAnimationFrame(scrollTopHard);
    });
  }, [pathname, search, hash]);

  return null;
}
