import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Zap, Layout, ChevronRight } from 'lucide-react';
import { BoardCard } from '@/components/BoardCard';
import { CurrentFocus } from '@/components/CurrentFocus';
import { CreateBoardDialog } from '@/components/CreateBoardDialog';
import { BottomNav } from '@/components/BottomNav';
import { usePalette } from '@/contexts/PaletteContext';
import paletteLogo from '@/assets/palette-logo.jpg';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { getActiveBoards, getCurrentFocusBoard, hasAiKeys } = usePalette();
  
  const boards = getActiveBoards();
  const focusBoard = getCurrentFocusBoard();

  const features = [
    {
      icon: Layout,
      title: "Table & Board Views",
      description: "Organize tasks your way",
      color: "from-palette-purple to-palette-purple-light"
    },
    {
      icon: Zap,
      title: "Drag & Drop",
      description: "Effortless task management",
      color: "from-palette-red to-orange-400"
    },
    {
      icon: Sparkles,
      title: "AI Assistant",
      description: "Meet Pal, your helper",
      color: "from-blue-500 to-cyan-400"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Animated Header */}
      <header className="relative px-4 py-6 border-b border-border/50 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-palette-red/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-palette-purple/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative flex items-center gap-4 animate-fade-in">
          <div className="relative group">
            <div className="absolute inset-0 gradient-palette rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <img 
              src={paletteLogo} 
              alt="PALETTE" 
              className="relative h-14 w-14 rounded-2xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient tracking-tight">PALETTE</h1>
            <p className="text-sm text-muted-foreground">Your projects, beautifully organized</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* Welcome Section (shown when no boards) */}
        {boards.length === 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-center py-8">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-3xl gradient-palette flex items-center justify-center shadow-lg animate-bounce-slow">
                  <Plus className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-4 gradient-palette rounded-[2rem] blur-2xl opacity-30" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to PALETTE</h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                Create your first board to start organizing your projects with style
              </p>
              <Button 
                onClick={() => setIsCreateOpen(true)}
                size="lg"
                className="gradient-palette hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Board
              </Button>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in cursor-default"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                    feature.color
                  )}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Current Focus */}
        {focusBoard && (
          <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CurrentFocus board={focusBoard} />
          </section>
        )}

        {/* Boards Grid */}
        {boards.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Your Boards</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {boards.length}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground group"
              >
                View all
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map((board, index) => (
                <div 
                  key={board.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <BoardCard board={board} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        {boards.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">
                      {hasAiKeys ? "Pal is ready to help!" : "Unlock AI Features"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {hasAiKeys ? "Ask Pal to generate tasks or summarize boards" : "Add your API key in settings"}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="shrink-0 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                >
                  {hasAiKeys ? "Ask Pal" : "Set up"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FAB */}
      <Button
        onClick={() => setIsCreateOpen(true)}
        size="icon"
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-xl gradient-palette hover:opacity-90 z-40 transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-fade-in"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <CreateBoardDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;