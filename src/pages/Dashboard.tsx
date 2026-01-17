import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BoardCard } from '@/components/BoardCard';
import { CurrentFocus } from '@/components/CurrentFocus';
import { CreateBoardDialog } from '@/components/CreateBoardDialog';
import { BottomNav } from '@/components/BottomNav';
import { usePalette } from '@/contexts/PaletteContext';
import paletteLogo from '@/assets/palette-logo.jpg';

const Dashboard = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { getActiveBoards, getCurrentFocusBoard } = usePalette();
  
  const boards = getActiveBoards();
  const focusBoard = getCurrentFocusBoard();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 py-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <img 
            src={paletteLogo} 
            alt="PALETTE" 
            className="h-10 w-10 rounded-xl object-cover"
          />
          <div>
            <h1 className="text-xl font-bold text-gradient">PALETTE</h1>
            <p className="text-xs text-muted-foreground">Your projects, beautifully organized</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-5 space-y-6">
        {/* Current Focus */}
        {focusBoard && (
          <section>
            <CurrentFocus board={focusBoard} />
          </section>
        )}

        {/* Boards Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Boards</h2>
            <span className="text-sm text-muted-foreground">{boards.length} boards</span>
          </div>
          
          {boards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-palette flex items-center justify-center">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No boards yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create your first board to start organizing your projects
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                Create Board
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* FAB */}
      <Button
        onClick={() => setIsCreateOpen(true)}
        size="icon"
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg gradient-palette hover:opacity-90 z-40"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <CreateBoardDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
