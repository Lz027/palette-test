import { useState, useEffect } from "react";

export const useIntroScreen = () => {
  const [shouldShowIntro, setShouldShowIntro] = useState(false);

  useEffect(() => {
    const introSeen = localStorage.getItem("palette_intro_seen");
    if (!introSeen) {
      setShouldShowIntro(true);
    }
  }, []);

  const markIntroSeen = () => {
    localStorage.setItem("palette_intro_seen", "true");
    setShouldShowIntro(false);
  };

  return { shouldShowIntro, markIntroSeen };
};
