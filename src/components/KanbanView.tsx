import { Column, Task } from '@/types/palette';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { usePalette } from '@/contexts/PaletteContext';
import { Input } from '@/components/ui/input';

interface KanbanViewProps {
  columns: Column[];
  getColumnTasks: (columnId: string) => Task[];
}

export function KanbanView({ columns, getColumnTasks }: KanbanViewProps) {
  const { createTask, deleteTask } = usePalette();
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim()) {
      createTask(columnId, newTaskTitle.trim());
      setNewTaskTitle('');
      setAddingToColumn(null);
    }
  };

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4 scrollbar-hide">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80 flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              {column.name}
              <span className="ml-2 text-xs opacity-50">{getColumnTasks(column.id).length}</span>
            </h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {getColumnTasks(column.id).map((task) => (
              <div key={task.id} className="group relative">
                <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
                  <h4 className="font-medium text-sm leading-tight mb-2">{task.title}</h4>
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteTask(task.id)}
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {addingToColumn === column.id ? (
              <div className="space-y-2 p-1">
                <Input
                  autoFocus
                  placeholder="Enter task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTask(column.id);
                    if (e.key === 'Escape') setAddingToColumn(null);
                  }}
                  className="bg-card border-primary/30"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAddTask(column.id)}>Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => setAddingToColumn(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => setAddingToColumn(column.id)}
                className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 h-10 border border-dashed border-border/50 rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
