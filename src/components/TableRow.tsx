import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { Task, Column } from '@/types/palette';
import { usePalette } from '@/contexts/PaletteContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isPast, isToday } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ColumnTypeRenderer } from './ColumnTypeRenderer';

interface TableRowProps {
  task: Task;
  columns: Column[];
  columnColors: Record<string, string>;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const TableRow = ({ task, columns, columnColors, isExpanded, onToggleExpand }: TableRowProps) => {
  const { updateTask, deleteTask } = usePalette();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
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

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title.trim() && title !== task.title) {
      updateTask(task.id, { title: title.trim() });
    } else {
      setTitle(task.title);
    }
  };

  const handleDataChange = (columnId: string, value: any) => {
    const newData = { ...(task.data || {}), [columnId]: value };
    updateTask(task.id, { data: newData });
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "group border-b border-border/30 transition-all duration-200 hover:bg-muted/30",
        isDragging && "opacity-50 bg-primary/5 shadow-lg"
      )}
    >
      <td className="w-10 px-2">
        <button
          {...attributes}
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>

      <td className="px-3 py-3 min-w-[200px]">
        {isEditingTitle ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
            autoFocus
            className="h-8 text-sm bg-background"
          />
        ) : (
          <span
            onClick={() => setIsEditingTitle(true)}
            className="text-sm cursor-text hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors inline-block min-w-[100px]"
          >
            {task.title}
          </span>
        )}
      </td>

      {columns.map((column) => (
        <td key={column.id} className="px-3 py-3 min-w-[120px]">
          <ColumnTypeRenderer
            type={column.type}
            value={task.data?.[column.id] || ''}
            onChange={(val) => handleDataChange(column.id, val)}
            isEditing={true}
            settings={column.settings}
          />
        </td>
      ))}

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