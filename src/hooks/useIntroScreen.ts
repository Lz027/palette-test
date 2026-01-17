import { useState, useEffect } from "react";

export const useIntroScreen = () => {
  const [shouldShowIntro, setShouldShowIntro] = useState(true); // Default to true to ensure it shows

  useEffect(() => {
    const introSeen = localStorage.getItem("palette_intro_seen");
    console.log("Intro seen status:", introSeen);
    if (introSeen === "true") {
      setShouldShowIntro(false);
    } else {
      setShouldShowIntro(true);
    }
  }, []);

  const markIntroSeen = () => {
    console.log("Marking intro as seen");
    localStorage.setItem("palette_intro_seen", "true");
    setShouldShowIntro(false);
  };

  return { shouldShowIntro, markIntroSeen };
};
