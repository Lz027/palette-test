import { useParams, useNavigate } from 'react-router-dom';
import { usePalette } from '@/contexts/PaletteContext';
import { BoardViewHeader } from '@/components/BoardViewHeader';
import { InteractiveBoard } from '@/components/InteractiveBoard';
import { AppLayout } from '@/components/AppLayout';
import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Target, LayoutGrid, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SmartGoalStudio } from '@/components/SmartGoalStudio';
import { ToolPanel } from '@/components/tools/ToolPanel';

const BoardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, openBoard, createGroup } = usePalette();
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'board' | 'smart'>('board');
  const [toolPanelOpen, setToolPanelOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const board = boards.find(b => b.id === id);

  useEffect(() => {
    if (id) {
      openBoard(id);
      // Scroll to top when opening a new board
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, openBoard]);

  if (!board) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-screen bg-background">
          <h2 className="text-xl font-bold mb-4">Board not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-primary hover:underline text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <BoardViewHeader board={board} />
        
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Sub-header */}
          <div className="px-4 py-3 border-b bg-muted/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant={view === 'board' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="h-8 text-xs rounded-xl gap-1.5" 
                onClick={() => setView('board')}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Board
              </Button>
              <Button 
                variant={view === 'smart' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="h-8 text-xs rounded-xl gap-1.5" 
                onClick={() => setView('smart')}
              >
                <Target className="w-3.5 h-3.5" />
                SMART Goal
              </Button>
              <div className="w-px h-4 bg-border/50 mx-1" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground h-8 text-xs rounded-xl hover:bg-primary/5" 
                onClick={() => createGroup(board.id, 'New Group')}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Group
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={toolPanelOpen ? 'secondary' : 'outline'}
                size="sm"
                className="h-8 text-xs rounded-xl gap-1.5"
                onClick={() => setToolPanelOpen(!toolPanelOpen)}
              >
                <Wrench className="w-3.5 h-3.5" />
                Tools
              </Button>
              <div className="relative w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background rounded-xl"
                />
              </div>
            </div>
          </div>

          <div 
            ref={contentRef}
            className="flex-1 overflow-auto p-4 scroll-smooth"
          >
            <div className="max-w-[1400px] mx-auto h-full">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {view === 'board' ? (
                  <InteractiveBoard board={board} />
                ) : (
                  <SmartGoalStudio boardId={board.id} />
                )}
              </motion.div>
            </div>
          </div>
        </main>

        {/* Tool Panel */}
        <ToolPanel
          templateType={board.templateType}
          boardId={board.id}
          isOpen={toolPanelOpen}
          onToggle={() => setToolPanelOpen(!toolPanelOpen)}
        />
      </div>
    </AppLayout>
  );
};

export default BoardView;
