import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PaletteProvider } from "@/contexts/PaletteContext";
import { useIntroScreen } from "@/hooks/useIntroScreen";
import { useAuth } from "@/hooks/use-auth";
import Dashboard from "./pages/Dashboard";
import BoardView from "./pages/BoardView";
import AiTools from "./pages/AiTools";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Intro from "./pages/Intro";
import { Loader2, AlertTriangle, RefreshCcw, Mail } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { shouldShowIntro } = useIntroScreen();
  const { user, isLoading, error, loginWithGithub, loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="flex flex-col items-center">
            <p className="text-base font-bold tracking-tight">PALETTE</p>
            <p className="text-xs text-muted-foreground">Setting up your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-6 text-center">
        <div className="max-w-sm w-full p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-2xl">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            We couldn't connect to the authentication service.
          </p>
          <div className="bg-muted p-3 rounded-lg mb-6 text-left overflow-auto max-h-32">
            <p className="text-[10px] font-mono text-destructive break-all">
              {error.message || "Unknown authentication error"}
            </p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full rounded-xl py-6 font-bold gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    if (shouldShowIntro) {
      return <Intro />;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 py-12 relative">
        <div className="flex flex-col items-center space-y-8 w-full max-w-[360px] relative z-10">
          <div className="relative h-24 w-24 rounded-3xl bg-card flex items-center justify-center border border-border/50 shadow-2xl overflow-hidden">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-palette-purple to-palette-red shadow-inner flex items-center justify-center">
              <div className="w-6 h-6 bg-white/20 rounded-full blur-sm" />
            </div>
          </div>

          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-black tracking-tighter text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm px-4 font-medium">
              The creative workspace for minimalist project management.
            </p>
          </div>
          
          <div className="flex flex-col w-full gap-4">
            <Button 
              onClick={() => loginWithGithub()}
              variant="outline"
              className="h-14 rounded-2xl border-border/50 bg-card hover:bg-muted/50 font-bold gap-3 shadow-sm transition-all"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Continue with GitHub
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/40"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-background px-3 text-muted-foreground/60 font-bold">Or with Email</span></div>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) return;
                setIsEmailLoading(true);
                try {
                  await loginWithEmail(email);
                  toast.success("Login link sent to your email!");
                } catch (err) {
                  toast.error("Failed to send login link.");
                  console.error(err);
                } finally {
                  setIsEmailLoading(false);
                }
              }} 
              className="space-y-3"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-11 rounded-2xl bg-card border-border/50"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isEmailLoading}
                className="w-full h-14 rounded-2xl font-bold bg-palette-purple hover:bg-palette-purple/90"
              >
                {isEmailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in with Email"}
              </Button>
            </form>
          </div>
          
          <p className="text-[10px] text-muted-foreground/60 mt-4 text-center max-w-[240px] leading-relaxed font-medium">
            By signing in, you agree to our <br />
            <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route 
        path="/intro" 
        element={!shouldShowIntro ? <Navigate to="/" replace /> : <Intro />} 
      />
      <Route 
        path="/" 
        element={shouldShowIntro ? <Navigate to="/intro" replace /> : <Dashboard />} 
      />
      <Route path="/board/:id" element={<BoardView />} />
      <Route path="/ai" element={<AiTools />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PaletteProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PaletteProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
