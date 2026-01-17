import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useIntroScreen } from "@/hooks/useIntroScreen";
import paletteLogo from "@/assets/palette-logo.jpg";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Intro = () => {
  const navigate = useNavigate();
  const { markIntroSeen } = useIntroScreen();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isExiting) {
        handleComplete();
      }
    }, 6000); // Slightly longer to appreciate the animation
    return () => clearTimeout(timer);
  }, [isExiting]);

  const handleComplete = () => {
    setIsExiting(true);
    markIntroSeen();
    // Small delay for exit animation if needed, or just navigate
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 300);
  };

  const appName = "PALETTE";

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8 relative"
      >
        <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse" />
        <img 
          src={paletteLogo} 
          alt="Palette Logo" 
          className="relative w-28 h-28 rounded-[2rem] shadow-2xl border-4 border-background"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = "https://placeholder.svg";
          }}
        />
      </motion.div>

      <div className="flex mb-4">
        {appName.split("").map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
            className="text-5xl font-black tracking-tighter text-primary"
          >
            {letter}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="flex flex-col items-center gap-8"
      >
        <p className="text-muted-foreground font-medium text-lg tracking-wide">
          Your projects, beautifully organized
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
        >
          <Button 
            onClick={handleComplete}
            size="lg"
            className="rounded-full px-8 py-6 text-lg font-bold shadow-xl hover:shadow-primary/20 transition-all group"
          >
            Get Started
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-palette-red/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-palette-purple/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  );
};

export default Intro;
