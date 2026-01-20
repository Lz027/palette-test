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

  const columns = getBoardColumns(board.id);

  return (
    <AppLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <BoardViewHeader board={board} />
        
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Sub-header with View Switcher and Search */}
          <div className="px-4 py-3 border-b bg-muted/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-fit">
                <TabsList className="bg-muted/50 p-0.5 h-8">
                  <TabsTrigger value="palette" className="data-[state=active]:bg-background h-7 text-xs px-3">
                    <TableIcon className="w-3.5 h-3.5 mr-1.5" />
                    Table
                  </TabsTrigger>
                  <TabsTrigger value="kanban" className="data-[state=active]:bg-background h-7 text-xs px-3">
                    <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
                    Kanban
                  </TabsTrigger>
                  <TabsTrigger value="table" className="data-[state=active]:bg-background h-7 text-xs px-3">
                    <List className="w-3.5 h-3.5 mr-1.5" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="h-5 w-px bg-border" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground h-7 text-xs" 
                onClick={() => createGroup(board.id, 'New Group')}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Group
              </Button>
            </div>

            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-7 text-xs bg-background"
              />
            </div>
          </div>

          <div 
            ref={contentRef}
            className="flex-1 overflow-auto p-4 scroll-smooth"
          >
            <div className="max-w-[1400px] mx-auto h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
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
