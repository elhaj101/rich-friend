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

    // Create scroll-driven animations for bottom clouds
    gsap.to(cloudLeftRef.current, {
      x: -150, // Move left 150px
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top", // End when hero bottom reaches viewport top
        scrub: 0.5, // Smooth scrub
        markers: false,
      },
    });

    gsap.to(cloudRightRef.current, {
      x: 150, // Move right 150px
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        markers: false,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return {
    heroRef,
    cloudLeftRef,
    cloudRightRef,
  };
}

export function useEditorialCloudScroll() {
  const cloudTopLeftRef = useRef<HTMLImageElement>(null);
  const cloudTopRightRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!cloudTopLeftRef.current || !cloudTopRightRef.current) {
      return;
    }

    // Top clouds animate as they come into view
    gsap.to(cloudTopLeftRef.current, {
      x: -100, // Move left slightly
      scrollTrigger: {
        trigger: ".hero-section-end",
        start: "top bottom",
        end: "center center",
        scrub: 0.5,
        markers: false,
      },
    });

    gsap.to(cloudTopRightRef.current, {
      x: 100, // Move right slightly
      scrollTrigger: {
        trigger: ".hero-section-end",
        start: "top bottom",
        end: "center center",
        scrub: 0.5,
        markers: false,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return {
    cloudTopLeftRef,
    cloudTopRightRef,
  };
}
