import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { Task } from '@/types/palette';
import { usePalette } from '@/contexts/PaletteContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isPast, isToday } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TableRowProps {
  task: Task;
  columnName: string;
  columnColor: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const TableRow = ({ task, columnName, columnColor, isExpanded, onToggleExpand }: TableRowProps) => {
  const { updateTask, deleteTask } = usePalette();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (title.trim() && title !== task.title) {
      updateTask(task.id, { title: title.trim() });
    } else {
      setTitle(task.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditing(false);
    }
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "group border-b border-border/30 transition-all duration-200 hover:bg-muted/30",
        isDragging && "opacity-50 bg-primary/5 shadow-lg",
        "animate-fade-in"
      )}
    >
      {/* Drag Handle */}
      <td className="w-10 px-2">
        <button
          {...attributes}
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>

      {/* Expand Toggle (optional for subtasks later) */}
      <td className="w-8 px-1">
        {onToggleExpand ? (
          <button onClick={onToggleExpand} className="text-muted-foreground hover:text-foreground">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <div className="w-4" />
        )}
      </td>

      {/* Task Title */}
      <td className="px-3 py-3 min-w-[200px]">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="h-8 text-sm bg-background"
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="text-sm cursor-text hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors inline-block min-w-[100px]"
          >
            {task.title}
          </span>
        )}
      </td>

      {/* Status Column */}
      <td className="px-3 py-3 w-32">
        <Badge 
          className="text-xs font-medium transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: columnColor,
            color: 'white'
          }}
        >
          {columnName}
        </Badge>
      </td>

      {/* Due Date */}
      <td className="px-3 py-3 w-32">
        {task.dueDate ? (
          <div className={cn(
            "flex items-center gap-1 text-xs px-2 py-1 rounded-md w-fit transition-all duration-200",
            isOverdue && "text-destructive bg-destructive/10",
            isDueToday && "text-primary bg-primary/10",
            !isOverdue && !isDueToday && "text-muted-foreground bg-muted"
          )}>
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/50">—</span>
        )}
      </td>

      {/* Tags */}
      <td className="px-3 py-3 w-40">
        <div className="flex gap-1 flex-wrap">
          {task.tags?.slice(0, 2).map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {(task.tags?.length || 0) > 2 && (
            <Badge variant="outline" className="text-xs">
              +{(task.tags?.length || 0) - 2}
            </Badge>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-3 py-3 w-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteTask(task.id)}
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </td>
    </tr>
  );
};