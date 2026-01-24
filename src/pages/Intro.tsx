import { useEffect, useState } from "react";
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
    // Force a small delay or direct navigation to bypass any stuck states
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
  };

  const features = [
    { icon: Layout, text: "Visual Boards", color: "text-palette-purple" },
    { icon: Zap, text: "Fast Workflow", color: "text-palette-red" },
    { icon: Sparkles, text: "AI Powered", color: "text-blue-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {step === 0 && (
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <img 
                src={paletteLogo} 
                alt="Palette" 
                className="relative w-32 h-32 rounded-[2.5rem] shadow-2xl border-4 border-background object-cover"
              />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">PALETTE</h1>
          </div>
        )}

        {step >= 1 && (
          <div className="flex flex-col items-center text-center w-full">
            <div className="mb-8">
              <img 
                src={paletteLogo} 
                alt="Palette" 
                className="w-16 h-16 rounded-2xl shadow-lg border-2 border-background object-cover"
              />
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Your projects, <br />
              <span className="text-palette-purple">
                beautifully organized
              </span>
            </h2>

            <div className="grid grid-cols-1 gap-4 w-full mb-12">
              {features.map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm"
                >
                  <div className={`p-2 rounded-xl bg-muted ${f.color}`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">{f.text}</span>
                </div>
              ))}
            </div>

            <div className="w-full">
              <Button 
                onClick={handleComplete}
                size="lg"
                className="w-full rounded-2xl py-7 text-lg font-bold shadow-xl bg-palette-purple hover:bg-palette-purple/90"
              >
                Get Started
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="mt-4 text-xs text-muted-foreground font-medium">
                No credit card required • Free forever
              </p>
            </div>
          </div>
        )}
      </div>

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
