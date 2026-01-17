import { useState, useEffect } from "react";

export const useIntroScreen = () => {
  // Initialize from localStorage immediately to avoid flash or missing intro
  const [shouldShowIntro, setShouldShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem("palette_intro_seen");
    }
    return false;
  });

  useEffect(() => {
    const introSeen = localStorage.getItem("palette_intro_seen");
    if (!introSeen) {
      setShouldShowIntro(true);
    } else {
      setShouldShowIntro(false);
    }
  }, []);

  const markIntroSeen = () => {
    localStorage.setItem("palette_intro_seen", "true");
    setShouldShowIntro(false);
  };

  return { shouldShowIntro, markIntroSeen };
};
