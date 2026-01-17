import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PaletteProvider } from "@/contexts/PaletteContext";
import { useIntroScreen } from "@/hooks/useIntroScreen";
import Dashboard from "./pages/Dashboard";
import BoardView from "./pages/BoardView";
import AiTools from "./pages/AiTools";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Intro from "./pages/Intro";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { shouldShowIntro } = useIntroScreen();
  
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
