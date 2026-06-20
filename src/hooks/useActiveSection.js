import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Tracks the currently active section in the viewport using IntersectionObserver.
 * Falls back to matching the active sub-route path if elements are not rendered.
 * 
 * @param {string[]} sectionIds - List of HTML element IDs to observe
 * @param {IntersectionObserverInit} options - IntersectionObserver configuration
 * @returns {string} The active section ID (default: "home")
 */
export function useActiveSection(sectionIds, options = { threshold: 0.2, rootMargin: "-10% 0px -40% 0px" }) {
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  const serializedSectionIds = sectionIds.join(",");

  useEffect(() => {
    // 1. Sub-route path fallback (e.g. /projects -> "projects")
    const path = location.pathname.replace("/", "").toLowerCase();
    if (path && sectionIds.includes(path)) {
      setActiveSection(path);
      return;
    }

    // 2. Intersection Observer for scroll tracking
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedSectionIds, location.pathname, options.threshold, options.rootMargin]);

  return activeSection;
}
