import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { Column as ColumnType, Task } from '@/types/palette';
import { TaskCard } from './TaskCard';
import { usePalette } from '@/contexts/PaletteContext';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export const Column = ({ column, tasks }: ColumnProps) => {
  const { createTask, updateColumn, deleteColumn } = usePalette();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [columnName, setColumnName] = useState(column.name);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      createTask(column.id, newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleColumnNameBlur = () => {
    setIsEditingName(false);
    if (columnName.trim() && columnName !== column.name) {
      updateColumn(column.id, { name: columnName.trim() });
    } else {
      setColumnName(column.name);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      className={`flex-shrink-0 w-72 bg-muted/30 border-border/30 p-3 flex flex-col max-h-full transition-colors ${
        isOver ? 'bg-primary/5 border-primary/30' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        {isEditingName ? (
          <Input
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            onBlur={handleColumnNameBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleColumnNameBlur()}
            autoFocus
            className="h-8 text-sm font-semibold"
          />
        ) : (
          <h3
            onClick={() => setIsEditingName(true)}
            className="font-semibold text-foreground cursor-text hover:bg-muted rounded px-2 -mx-2 py-1"
          >
            {column.name}
          </h3>
        )}
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => deleteColumn(column.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border/50">
        {isAddingTask ? (
          <div className="space-y-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Task title..."
              autoFocus
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTask} className="flex-1">
                Add
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setNewTaskTitle('');
                  setIsAddingTask(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>
    </Card>
  );
};
