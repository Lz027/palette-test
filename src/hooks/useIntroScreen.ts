import { useState, useEffect } from "react";

export const useIntroScreen = () => {
  const [shouldShowIntro, setShouldShowIntro] = useState(false); // Default to false to bypass for now

  useEffect(() => {
    setShouldShowIntro(false);
  }, []);

  const markIntroSeen = () => {
    localStorage.setItem("palette_intro_seen", "true");
    setShouldShowIntro(false);
  };

  return { shouldShowIntro: false, markIntroSeen };
};
