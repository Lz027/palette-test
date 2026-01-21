import { useParams, useNavigate } from 'react-router-dom';
import { usePalette } from '@/contexts/PaletteContext';
import { BoardViewHeader } from '@/components/BoardViewHeader';
import { KanbanView } from '@/components/KanbanView';
import { TableView } from '@/components/TableView';
import { PaletteGridView } from '@/components/PaletteGridView';
import { AppLayout } from '@/components/AppLayout';
import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, List, Table as TableIcon, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const BoardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, getBoardColumns, getColumnTasks, openBoard, createGroup } = usePalette();
  const [view, setView] = useState<'kanban' | 'table' | 'palette'>('palette');
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const board = boards.find(b => b.id === id);

  useEffect(() => {
    if (id) {
      openBoard(id);
      // Fast scroll to top when opening a new board
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0 });
      }
      window.scrollTo({ top: 0 });
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

  const columns = getBoardColumns(board.id);

  // Default to list view for SMART goals to feel more like a memo
  useEffect(() => {
    if (board.templateType === 'smart' && view !== 'table') {
      setView('table');
    }
  }, [board.templateType]);

  return (
    <AppLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <BoardViewHeader board={board} />
        
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Compact Sub-header */}
          <div className="px-4 py-2 border-b bg-muted/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-fit">
                <TabsList className="bg-muted/50 p-0.5 h-7">
                  <TabsTrigger value="palette" className="data-[state=active]:bg-background h-6 text-[10px] px-2">
                    <TableIcon className="w-3 h-3 mr-1" />
                    Board
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="h-4 w-px bg-border mx-1" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground h-7 text-[10px] px-2" 
                onClick={() => createGroup(board.id, 'New Group')}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Group
              </Button>
            </div>

            <div className="relative w-40">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input 
                placeholder="Find..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-7 text-[10px] bg-background border-muted"
              />
            </div>
          </div>

          <div 
            ref={contentRef}
            className="flex-1 overflow-auto p-2 md:p-4 scroll-smooth"
          >
            <div className="max-w-[1600px] mx-auto h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.1 }}
                  className="h-full"
                >
                  {view === 'palette' ? (
                    <PaletteGridView board={board} />
                  ) : view === 'kanban' ? (
                    <KanbanView columns={columns} getColumnTasks={getColumnTasks} />
                  ) : (
                    <TableView columns={columns} getColumnTasks={getColumnTasks} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default BoardView;
