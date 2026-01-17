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
  const { user, isLoading } = useAuth();

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

  // Auth is bypassed in useAuth, so user will always be present for testing
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
