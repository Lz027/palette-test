import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useIntroScreen } from "@/hooks/useIntroScreen";
import paletteLogo from "@/assets/palette-logo.jpg";

const Intro = () => {
  const navigate = useNavigate();
  const { markIntroSeen } = useIntroScreen();

  useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    markIntroSeen();
    navigate("/", { replace: true });
  };

  const appName = "PALETTE";

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted cursor-pointer"
      onClick={handleComplete}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6"
      >
        <img 
          src={paletteLogo} 
          alt="Palette Logo" 
          className="w-24 h-24 rounded-2xl shadow-xl"
        />
      </motion.div>

      <div className="flex mb-2">
        {appName.split("").map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            className="text-4xl font-bold tracking-tighter"
          >
            {letter}
          </motion.span>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="text-muted-foreground font-medium"
      >
        Your projects, beautifully organized
      </motion.p>
    </div>
  );
};

export default Intro;
