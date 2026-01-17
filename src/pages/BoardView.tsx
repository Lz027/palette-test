import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Sparkles, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Column } from '@/components/Column';
import { TableView } from '@/components/TableView';
import { usePalette } from '@/contexts/PaletteContext';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { TaskCard } from '@/components/TaskCard';
import { cn } from '@/lib/utils';

type ViewMode = 'table' | 'kanban';

const BoardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, getBoardColumns, getColumnTasks, createColumn, moveTask, tasks, hasAiKeys } = usePalette();
  
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const board = boards.find(b => b.id === id);
  const columns = getBoardColumns(id || '');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeTask = useMemo(() => {
    if (!activeTaskId) return null;
    return tasks.find(t => t.id === activeTaskId) || null;
  }, [activeTaskId, tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const draggedTask = tasks.find(t => t.id === activeId);
    if (!draggedTask) return;

    // Check if dropped on a column
    const targetColumn = columns.find(c => c.id === overId);
    if (targetColumn) {
      const columnTasks = getColumnTasks(targetColumn.id);
      moveTask(activeId, targetColumn.id, columnTasks.length);
      return;
    }

    // Check if dropped on another task
    const targetTask = tasks.find(t => t.id === overId);
    if (targetTask && targetTask.columnId !== draggedTask.columnId) {
      moveTask(activeId, targetTask.columnId, targetTask.position);
    }
  };

  const handleAddColumn = () => {
    if (newColumnName.trim() && id) {
      createColumn(id, newColumnName.trim());
      setNewColumnName('');
      setIsAddingColumn(false);
    }
  };

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Board not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 border-b border-border/50 flex items-center gap-3 animate-fade-in">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="shrink-0 hover:scale-105 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold truncate flex-1">{board.name}</h1>
        
        {/* View Mode Toggle */}
        <div className="flex items-center bg-muted/50 rounded-lg p-1">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className={cn(
              "h-8 px-3 transition-all duration-200",
              viewMode === 'table' && "shadow-sm"
            )}
          >
            <TableIcon className="h-4 w-4 mr-1.5" />
            Table
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
            className={cn(
              "h-8 px-3 transition-all duration-200",
              viewMode === 'kanban' && "shadow-sm"
            )}
          >
            <LayoutGrid className="h-4 w-4 mr-1.5" />
            Board
          </Button>
        </div>

        {hasAiKeys && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-primary border-primary/30 hover:bg-primary/10 transition-all duration-200 hover:scale-105"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Ask Pal
          </Button>
        )}
      </header>

      {/* Content */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'table' ? (
            <TableView 
              columns={columns} 
              getColumnTasks={getColumnTasks}
            />
          ) : (
            /* Kanban View */
            <div className="flex gap-4 h-full pb-4 animate-fade-in">
              {columns.map(column => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={getColumnTasks(column.id)}
                />
              ))}
              
              {/* Add Column */}
              <div className="flex-shrink-0 w-72">
                {isAddingColumn ? (
                  <div className="bg-muted/30 rounded-lg p-3 space-y-2 animate-scale-in">
                    <Input
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddColumn();
                        if (e.key === 'Escape') {
                          setNewColumnName('');
                          setIsAddingColumn(false);
                        }
                      }}
                      placeholder="Column name..."
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddColumn} className="flex-1">
                        Add
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setNewColumnName('');
                          setIsAddingColumn(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-12 border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200"
                    onClick={() => setIsAddingColumn(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default BoardView;