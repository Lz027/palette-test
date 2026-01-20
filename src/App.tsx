import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PaletteProvider } from "./contexts/PaletteContext";
import { useAuth } from "./hooks/use-auth";
import { useIntroScreen } from "./hooks/useIntroScreen";
import Dashboard from "./pages/Dashboard";
import BoardView from "./pages/BoardView";
import AiTools from "./pages/AiTools";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Intro from "./pages/Intro";
import { Loader2, AlertCircle, Github, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import paletteLogo from "./assets/palette-logo.jpg";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AuthScreen = () => {
  const { loginWithGithub, loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await loginWithEmail(email);
    // After login, the AuthProvider/useAuth will update the 'user' state,
    // and AppRoutes will redirect to Dashboard or Intro.
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <img 
            src={paletteLogo} 
            alt="PALETTE" 
            className="h-20 w-20 rounded-[2rem] object-cover shadow-2xl border-4 border-background"
          />
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground">PALETTE</h1>
            <p className="text-muted-foreground font-medium">Beautifully organized</p>
          </div>
        </div>

        <div className="bg-card border border-border/50 p-8 rounded-[2.5rem] shadow-xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Welcome Back</h2>
            <p className="text-sm text-muted-foreground">Sign in to access your workspace</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={loginWithGithub}
              variant="outline" 
              className="w-full h-12 rounded-2xl gap-3 font-semibold hover:bg-muted/50 transition-all"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </Button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or use email</span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3">
              <Input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                required
              />
              <Button 
                type="submit"
                className="w-full h-12 rounded-2xl gap-3 font-semibold bg-palette-purple hover:bg-palette-purple/90"
              >
                <Mail className="w-5 h-5" />
                {isEmailSent ? "Check your email" : "Sign in with Email"}
              </Button>
            </form>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { shouldShowIntro } = useIntroScreen();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
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
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PaletteProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PaletteProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
