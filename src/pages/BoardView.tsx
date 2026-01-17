import { useParams, useNavigate } from 'react-router-dom';
import { usePalette } from '@/contexts/PaletteContext';
import { BoardViewHeader } from '@/components/BoardViewHeader';
import { KanbanView } from '@/components/KanbanView';
import { TableView } from '@/components/TableView';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BoardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, getBoardColumns, getColumnTasks, openBoard } = usePalette();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');

  const board = boards.find(b => b.id === id);

  useEffect(() => {
    if (id) {
      openBoard(id);
    }
  }, [id, openBoard]);

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <h2 className="text-2xl font-bold mb-4">Board not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-primary hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const columns = getBoardColumns(board.id);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-screen flex flex-col bg-background overflow-hidden"
    >
      <BoardViewHeader board={board} />
      
      <main className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto h-full flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <Tabs value={view} onValueChange={(v) => setView(v as 'kanban' | 'table')} className="w-fit">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="kanban" className="data-[state=active]:bg-background">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Board
                </TabsTrigger>
                <TabsTrigger value="table" className="data-[state=active]:bg-background">
                  <List className="w-4 h-4 mr-2" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-hidden"
            >
              {view === 'kanban' ? (
                <KanbanView columns={columns} getColumnTasks={getColumnTasks} />
              ) : (
                <TableView columns={columns} getColumnTasks={getColumnTasks} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
};

export default BoardView;
