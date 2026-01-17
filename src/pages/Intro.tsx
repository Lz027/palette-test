import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useIntroScreen } from "@/hooks/useIntroScreen";
import paletteLogo from "@/assets/palette-logo.jpg";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Layout, Zap } from "lucide-react";

const Intro = () => {
  const navigate = useNavigate();
  const { markIntroSeen } = useIntroScreen();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1500),
      setTimeout(() => setStep(2), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleComplete = () => {
    markIntroSeen();
    navigate("/", { replace: true });
  };

  const features = [
    { icon: Layout, text: "Visual Boards", color: "text-palette-purple" },
    { icon: Zap, text: "Fast Workflow", color: "text-palette-red" },
    { icon: Sparkles, text: "AI Powered", color: "text-blue-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-palette-red/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-palette-purple/5 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="logo-step"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-gradient-to-tr from-palette-red to-palette-purple opacity-20 blur-2xl rounded-full animate-pulse" />
                <img 
                  src={paletteLogo} 
                  alt="Palette" 
                  className="relative w-32 h-32 rounded-[2.5rem] shadow-2xl border-4 border-background object-cover"
                />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-foreground">PALETTE</h1>
            </motion.div>
          )}

          {step >= 1 && (
            <motion.div
              key="content-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center w-full"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="mb-8"
              >
                <img 
                  src={paletteLogo} 
                  alt="Palette" 
                  className="w-16 h-16 rounded-2xl shadow-lg border-2 border-background object-cover"
                />
              </motion.div>

              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Your projects, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-palette-red to-palette-purple">
                  beautifully organized
                </span>
              </h2>

              <div className="grid grid-cols-1 gap-4 w-full mb-12">
                {features.map((f, i) => (
                  <motion.div
                    key={f.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm"
                  >
                    <div className={`p-2 rounded-xl bg-muted ${f.color}`}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">{f.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="w-full"
              >
                <Button 
                  onClick={handleComplete}
                  size="lg"
                  className="w-full rounded-2xl py-7 text-lg font-bold shadow-xl hover:shadow-primary/20 transition-all group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-palette-red to-palette-purple opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  />
                </Button>
                <p className="mt-4 text-xs text-muted-foreground font-medium">
                  No credit card required • Free forever
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-10 flex gap-2">
        {[0, 1].map((i) => (
          <div 
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              (step === 0 && i === 0) || (step >= 1 && i === 1) 
                ? "w-8 bg-primary" 
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Intro;
