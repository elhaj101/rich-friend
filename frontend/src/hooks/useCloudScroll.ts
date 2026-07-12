import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCloudScroll() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cloudLeftRef = useRef<HTMLImageElement>(null);
  const cloudRightRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!heroRef.current || !cloudLeftRef.current || !cloudRightRef.current) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: "(max-width: 640px)",
        isReducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isMobile, isReducedMotion } = context.conditions as {
          isMobile: boolean;
          isReducedMotion: boolean;
        };

        if (isReducedMotion) return;

        // xPercent moves relative to each cloud's own (fluid) width, so the
        // parting distance stays proportional at every screen size.
        const spread = isMobile ? 22 : 38;

        gsap.to(cloudLeftRef.current, {
          xPercent: -spread,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });

        gsap.to(cloudRightRef.current, {
          xPercent: spread,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    );

    return () => mm.revert();
  }, []);

  return {
    heroRef,
    cloudLeftRef,
    cloudRightRef,
  };
}

export function useEditorialCloudScroll() {
  const editorialRef = useRef<HTMLElement>(null);
  const cloudTopLeftRef = useRef<HTMLImageElement>(null);
  const cloudTopRightRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!cloudTopLeftRef.current || !cloudTopRightRef.current) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: "(max-width: 640px)",
        isReducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isMobile, isReducedMotion } = context.conditions as {
          isMobile: boolean;
          isReducedMotion: boolean;
        };

        if (isReducedMotion) return;

        const spread = isMobile ? 14 : 24;
        const trigger = editorialRef.current ?? cloudTopLeftRef.current!.closest("section");

        gsap.to(cloudTopLeftRef.current, {
          xPercent: -spread,
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "center center",
            scrub: 0.5,
          },
        });

        gsap.to(cloudTopRightRef.current, {
          xPercent: spread,
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "center center",
            scrub: 0.5,
          },
        });
      }
    );

    return () => mm.revert();
  }, []);

  return {
    editorialRef,
    cloudTopLeftRef,
    cloudTopRightRef,
  };
}
