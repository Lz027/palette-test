import { useState } from 'react';
import { usePalette } from '@/contexts/PaletteContext';
import { BoardCard } from '@/components/BoardCard';
import { CurrentFocus } from '@/components/CurrentFocus';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Clock, Star, Sparkles, Layout, Zap, ChevronRight } from 'lucide-react';
import { CreateBoardDialog } from '@/components/CreateBoardDialog';
import { BottomNav } from '@/components/BottomNav';
import { AnimatedSection } from '@/components/AnimatedSection';
import { AccountNav } from '@/components/AccountNav';
import { PalAssistant } from '@/components/PalAssistant';
import paletteLogo from '@/assets/palette-logo.jpg';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { getActiveBoards, getCurrentFocusBoard, hasAiKeys } = usePalette();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const activeBoards = getActiveBoards();
  const focusBoard = getCurrentFocusBoard();



  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Header Section */}
        <AnimatedSection direction="down">
          <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
            <div className="relative flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 gradient-palette rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                <img 
                  src={paletteLogo} 
                  alt="PALETTE" 
                  className="relative h-12 w-12 rounded-2xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient tracking-tight">PALETTE</h1>
                <p className="text-xs text-muted-foreground font-medium">Beautifully organized</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Board
              </Button>
              <AccountNav />
            </div>
          </header>
        </AnimatedSection>

        {/* Focus Board */}
        {focusBoard && (
          <AnimatedSection delay={0.2}>
            <CurrentFocus board={focusBoard} />
          </AnimatedSection>
        )}

        {/* Boards Grid */}
        <div className="space-y-6">
          <AnimatedSection delay={0.3} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Your Boards</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {activeBoards.length}
              </span>
            </div>
          </AnimatedSection>

          {activeBoards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBoards.map((board, index) => (
                <AnimatedSection 
                  key={board.id} 
                  delay={0.1 * (index + 1)}
                  direction="up"
                >
                  <BoardCard board={board} />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection delay={0.4}>
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-3xl gradient-palette flex items-center justify-center shadow-lg animate-bounce-slow">
                    <Plus className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to PALETTE</h2>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                  Create your first board to start organizing your projects with style
                </p>
                <Button variant="outline" onClick={() => setIsCreateOpen(true)} size="lg">
                  Create Your First Board
                </Button>
              </div>
            </AnimatedSection>
          )}
        </div>


      </div>

      <CreateBoardDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />
      
      <BottomNav />
      <PalAssistant />
    </div>
  );
};

export default Dashboard;
