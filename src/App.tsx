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
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { shouldShowIntro } = useIntroScreen();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-8 bg-background px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gradient">PALETTE</h1>
          <p className="text-muted-foreground">Sign in to start organizing your projects beautifully.</p>
        </div>
        <a 
          href="/api/login"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          Login with Replit
        </a>
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
