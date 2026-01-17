import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Sparkles } from 'lucide-react';
import { Column } from '@/components/Column';
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

const BoardView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, getBoardColumns, getColumnTasks, createColumn, moveTask, tasks, hasAiKeys } = usePalette();
  
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
      <div className="min-h-screen flex items-center justify-center">
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
      <header className="px-4 py-4 border-b border-border/50 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold truncate flex-1">{board.name}</h1>
        {hasAiKeys && (
          <Button variant="outline" size="sm" className="text-primary border-primary/30">
            <Sparkles className="h-4 w-4 mr-1" />
            Ask Pal
          </Button>
        )}
      </header>

      {/* Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4 h-full pb-4">
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
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
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
                  className="w-full h-12 border-dashed border-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsAddingColumn(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Column
                </Button>
              )}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default BoardView;
