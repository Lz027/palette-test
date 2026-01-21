import { useState } from 'react';
import { usePalette } from '@/contexts/PaletteContext';
import { BoardCardCompact } from '@/components/BoardCardCompact';
import { CurrentFocus } from '@/components/CurrentFocus';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Clock, Sparkles } from 'lucide-react';
import { CreateBoardDialog } from '@/components/CreateBoardDialog';
import { AppLayout } from '@/components/AppLayout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { AccountNav } from '@/components/AccountNav';
import paletteLogo from '@/assets/palette-logo.jpg';

const Dashboard = () => {
  const { getActiveBoards, getCurrentFocusBoard } = usePalette();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const activeBoards = getActiveBoards();
  const focusBoard = getCurrentFocusBoard();

  // Separate pinned and recent boards
  const pinnedBoards = activeBoards.filter(b => b.pinned);
  const recentBoards = activeBoards.filter(b => !b.pinned).slice(0, 6);

  return (
    <AppLayout>
      <div className="min-h-screen bg-background selection:bg-primary/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
          
          {/* Header Section */}
          <AnimatedSection direction="down">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 sm:pb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative group shrink-0">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={paletteLogo} 
                    alt="PALETTE" 
                    className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl object-cover shadow-lg sm:shadow-xl border-2 border-background transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-gradient leading-none">PALETTE</h1>
                  <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-[0.2em] opacity-60">Creative Studio</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-2xl bg-muted/30 border border-border/40 w-full sm:w-auto">
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  size="sm"
                  className="flex-1 sm:flex-none rounded-xl bg-black hover:bg-black/90 text-white px-3 sm:px-4 h-8 sm:h-9 text-[10px] sm:text-xs font-black shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                  New Project
                </Button>
                <div className="shrink-0 scale-90 sm:scale-100">
                  <AccountNav />
                </div>
              </div>
            </header>
          </AnimatedSection>

          {/* Focus Board */}
          {focusBoard && (
            <AnimatedSection delay={0.1}>
              <div className="scale-[0.9] sm:scale-100 origin-top">
                <CurrentFocus board={focusBoard} />
              </div>
            </AnimatedSection>
          )}

          {/* Pinned Boards */}
          {pinnedBoards.length > 0 && (
            <AnimatedSection delay={0.2}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-palette-purple" />
                  <h2 className="text-sm font-bold uppercase tracking-widest opacity-60">Pinned</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {pinnedBoards.map((board, index) => (
                    <AnimatedSection 
                      key={board.id} 
                      delay={0.05 * (index + 1)}
                      direction="up"
                    >
                      <div className="scale-[0.95] sm:scale-100">
                        <BoardCardCompact board={board} />
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Recent Boards */}
          <AnimatedSection delay={0.3}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-bold uppercase tracking-widest opacity-60">Recent</h2>
                  <span className="text-[10px] font-black text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                    {recentBoards.length}
                  </span>
                </div>
              </div>

              {recentBoards.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {recentBoards.map((board, index) => (
                    <AnimatedSection 
                      key={board.id} 
                      delay={0.05 * (index + 1)}
                      direction="up"
                    >
                      <div className="scale-[0.95] sm:scale-100">
                        <BoardCardCompact board={board} />
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              ) : activeBoards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 bg-muted/10 rounded-[2rem] border border-dashed border-border/50 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl gradient-palette flex items-center justify-center shadow-lg mb-4">
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold mb-1">Welcome to PALETTE</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mb-4">
                    Create your first board to get started
                  </p>
                  <Button size="sm" onClick={() => setIsCreateOpen(true)} className="rounded-xl px-6">
                    Create Board
                  </Button>
                </div>
              ) : null}
            </div>
          </AnimatedSection>

          {/* All Boards Grid */}
          {activeBoards.length > 6 && (
            <AnimatedSection delay={0.4}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">All Boards</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {activeBoards.slice(6).map((board, index) => (
                    <AnimatedSection 
                      key={board.id} 
                      delay={0.03 * (index + 1)}
                      direction="up"
                    >
                      <BoardCardCompact board={board} />
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>

        <CreateBoardDialog 
          open={isCreateOpen} 
          onOpenChange={setIsCreateOpen} 
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
