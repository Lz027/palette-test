import { useParams, useNavigate } from 'react-router-dom';
import { usePalette } from '@/contexts/PaletteContext';
import { BoardViewHeader } from '@/components/BoardViewHeader';
import { KanbanView } from '@/components/KanbanView';
import { TableView } from '@/components/TableView';
import { PaletteGridView } from '@/components/PaletteGridView';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, List, Table as TableIcon, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PalAssistant } from '@/components/PalAssistant';

const BoardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, getBoardColumns, getColumnTasks, openBoard } = usePalette();
  const [view, setView] = useState<'kanban' | 'table' | 'palette'>('palette');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <BoardViewHeader board={board} />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Sub-header with View Switcher and Search */}
        <div className="px-6 py-4 border-b bg-muted/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-fit">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="palette" className="data-[state=active]:bg-background">
                  <TableIcon className="w-4 h-4 mr-2" />
                  Main Table
                </TabsTrigger>
                <TabsTrigger value="kanban" className="data-[state=active]:bg-background">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="table" className="data-[state=active]:bg-background">
                  <List className="w-4 h-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="h-6 w-[1px] bg-border mx-2" />
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => createGroup(board.id, 'New Group')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </Button>

          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-background"
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-6">
          <div className="max-w-[1600px] mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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

      {/* Quick Find Bar (Bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-background/80 backdrop-blur-xl border shadow-2xl rounded-2xl p-2 flex items-center gap-2 min-w-[400px]">
          <div className="bg-primary p-2 rounded-xl text-white">
            <Search className="h-5 w-5" />
          </div>
          <Input 
            placeholder="Quick find..." 
            className="border-none bg-transparent focus-visible:ring-0 text-lg h-12"
          />
          <div className="h-8 w-[1px] bg-border mx-2" />

        </div>
      </div>
      <PalAssistant />
    </div>
  );
};

export default BoardView;
