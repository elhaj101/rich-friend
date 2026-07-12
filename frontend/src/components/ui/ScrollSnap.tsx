"use client";

import { useEffect } from "react";

/**
 * Forced snap-scroll: ONLY from Hero (view 1) to Editorial (view 2).
 * After reaching Editorial, normal scroll is re-enabled for the rest of the page.
 */
export default function ScrollSnap() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const SECTIONS = ["#hero", "#editorial", "#styling-suite", "#trust"];
    const SNAP_DURATION = 600;
    
    let currentIndex = 0;
    let isSnapping = false;
    let wheelEventAccumulator = 0;
    let wheelEventTimeout: NodeJS.Timeout | null = null;
    let hasReachedEditorial = false;

    const getSectionElement = (idx: number) => {
      const selector = SECTIONS[idx];
      return selector ? document.querySelector(selector) : null;
    };

    const snapToEditorial = (idx: number) => {
      if (idx < 0 || idx >= SECTIONS.length || isSnapping) return;
      if (idx <= 1 && !hasReachedEditorial) {
        // Only force snap for Hero -> Editorial transition
        currentIndex = Math.max(0, Math.min(idx, 1));
        
        if (currentIndex === 1) {
          hasReachedEditorial = true;
          // Re-enable normal scroll after reaching Editorial
          html.style.overflow = "";
          body.style.overflow = "";
          window.removeEventListener("wheel", handleWheel);
          window.removeEventListener("keydown", handleKeyDown);
        }
      }
      
      isSnapping = true;
      const section = getSectionElement(currentIndex);
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        setTimeout(() => {
          isSnapping = false;
        }, SNAP_DURATION + 100);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelEventAccumulator += e.deltaY;

      if (wheelEventTimeout) clearTimeout(wheelEventTimeout);

      wheelEventTimeout = setTimeout(() => {
        if (isSnapping || hasReachedEditorial) return;
        
        const direction = wheelEventAccumulator > 0 ? 1 : -1;
        wheelEventAccumulator = 0;
        snapToEditorial(currentIndex + direction);
      }, 150);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSnapping || hasReachedEditorial) return;

      if (["ArrowDown", "Space", "PageDown"].includes(e.key)) {
        e.preventDefault();
        snapToEditorial(currentIndex + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        snapToEditorial(currentIndex - 1);
      }
    };

    const detectCurrentSection = () => {
      let closestIdx = 0;
      let closestDistance = Infinity;
      
      SECTIONS.forEach((selector, idx) => {
        const el = document.querySelector(selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIdx = idx;
          }
        }
      });
      
      currentIndex = closestIdx;
      if (closestIdx >= 1) {
        hasReachedEditorial = true;
      }
    };

    // Only lock scroll for Hero->Editorial transition
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    detectCurrentSection();

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      if (wheelEventTimeout) clearTimeout(wheelEventTimeout);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
