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
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          
          {/* Header Section */}
          <AnimatedSection direction="down">
            <header className="flex items-center justify-between pb-8">
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={paletteLogo} 
                    alt="PALETTE" 
                    className="relative h-14 w-14 rounded-[1.5rem] object-cover shadow-2xl border-4 border-background transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">PALETTE</h1>
                  <p className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-[0.2em] opacity-60">Creative Studio</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  size="lg"
                  className="rounded-2xl bg-black hover:bg-black/90 text-white px-6 h-12 text-sm font-black shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
                <AccountNav />
              </div>
            </header>
          </AnimatedSection>

          {/* Focus Board */}
          {focusBoard && (
            <AnimatedSection delay={0.1}>
              <CurrentFocus board={focusBoard} />
            </AnimatedSection>
          )}

          {/* Pinned Boards */}
          {pinnedBoards.length > 0 && (
            <AnimatedSection delay={0.2}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-palette-purple" />
                  <h2 className="text-sm font-semibold">Pinned</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {pinnedBoards.map((board, index) => (
                    <AnimatedSection 
                      key={board.id} 
                      delay={0.05 * (index + 1)}
                      direction="up"
                    >
                      <BoardCardCompact board={board} />
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
                  <h2 className="text-sm font-semibold">Recent</h2>
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {recentBoards.length}
                  </span>
                </div>
              </div>

              {recentBoards.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {recentBoards.map((board, index) => (
                    <AnimatedSection 
                      key={board.id} 
                      delay={0.05 * (index + 1)}
                      direction="up"
                    >
                      <BoardCardCompact board={board} />
                    </AnimatedSection>
                  ))}
                </div>
              ) : activeBoards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/10 rounded-2xl border border-dashed border-border/50 text-center">
                  <div className="w-14 h-14 rounded-2xl gradient-palette flex items-center justify-center shadow-lg mb-4">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold mb-1">Welcome to PALETTE</h2>
                  <p className="text-sm text-muted-foreground max-w-xs mb-4">
                    Create your first board to get started
                  </p>
                  <Button size="sm" onClick={() => setIsCreateOpen(true)}>
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
