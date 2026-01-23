import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PaletteProvider } from "./contexts/PaletteContext";
import { useAuth } from "./hooks/use-auth";
import Dashboard from "./pages/Dashboard";
import BoardView from "./pages/BoardView";
import AiTools from "./pages/AiTools";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
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

  // If no user (and not bypassed), we could show a login screen, 
  // but with our bypass in use-auth.ts, user will be MOCK_USER.
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please sign in to continue.</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
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
