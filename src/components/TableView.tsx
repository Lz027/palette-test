import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { Column as ColumnType, Task } from '@/types/palette';
import { TableRow } from './TableRow';
import { usePalette } from '@/contexts/PaletteContext';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow as UITableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

// Column colors for status badges
const COLUMN_COLORS = [
  'hsl(280, 80%, 55%)', // Purple
  'hsl(220, 80%, 55%)', // Blue  
  'hsl(150, 70%, 45%)', // Green
  'hsl(35, 90%, 55%)',  // Orange
  'hsl(0, 80%, 60%)',   // Red
  'hsl(180, 70%, 45%)', // Teal
];

interface TableViewProps {
  columns: ColumnType[];
  getColumnTasks: (columnId: string) => Task[];
}

export const TableView = ({ columns, getColumnTasks }: TableViewProps) => {
  const { createTask, updateColumn, deleteColumn, createColumn } = usePalette();
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim()) {
      createTask(columnId, newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAddingTask(null);
    }
  };

  const handleAddColumn = () => {
    if (newColumnName.trim() && columns.length > 0) {
      const boardId = columns[0].boardId;
      createColumn(boardId, newColumnName.trim());
      setNewColumnName('');
      setIsAddingColumn(false);
    }
  };

  // Get all tasks from all columns, grouped
  const allTasksGrouped = columns.map((column, index) => ({
    column,
    tasks: getColumnTasks(column.id),
    color: COLUMN_COLORS[index % COLUMN_COLORS.length],
  }));

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm animate-scale-in">
      {/* Column Headers (Tabs) */}
      <div className="flex items-center gap-1 px-4 py-3 bg-muted/30 border-b border-border/50 overflow-x-auto scrollbar-hide">
        {columns.map((column, index) => (
          <div
            key={column.id}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border/50 group hover:border-primary/30 transition-all duration-200"
          >
            <div
              className="w-3 h-3 rounded-full transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: COLUMN_COLORS[index % COLUMN_COLORS.length] }}
            />
            <span className="text-sm font-medium whitespace-nowrap">{column.name}</span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {getColumnTasks(column.id).length}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
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
        ))}
        
        {/* Add Column Button */}
        {isAddingColumn ? (
          <div className="flex items-center gap-2 px-2">
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
              className="h-8 w-32 text-sm"
              autoFocus
            />
            <Button size="sm" onClick={handleAddColumn} className="h-8">Add</Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                setNewColumnName('');
                setIsAddingColumn(false);
              }}
              className="h-8"
            >
              ✕
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingColumn(true)}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Column
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <UITableRow className="bg-muted/20 hover:bg-muted/20">
              <TableHead className="w-10"></TableHead>
              <TableHead className="w-8"></TableHead>
              <TableHead className="min-w-[200px] font-semibold">Task</TableHead>
              <TableHead className="w-32 font-semibold">Status</TableHead>
              <TableHead className="w-32 font-semibold">Due Date</TableHead>
              <TableHead className="w-40 font-semibold">Tags</TableHead>
              <TableHead className="w-12"></TableHead>
            </UITableRow>
          </TableHeader>
          <TableBody>
            {allTasksGrouped.map(({ column, tasks, color }) => (
              <SortableContext 
                key={column.id} 
                items={tasks.map(t => t.id)} 
                strategy={verticalListSortingStrategy}
              >
                {tasks.map(task => (
                  <TableRow 
                    key={task.id} 
                    task={task} 
                    columnName={column.name}
                    columnColor={color}
                  />
                ))}
                {/* Add Task Row for this column */}
                {isAddingTask === column.id ? (
                  <tr className="border-b border-border/30 bg-primary/5">
                    <td colSpan={2}></td>
                    <td colSpan={5} className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTask(column.id);
                            if (e.key === 'Escape') {
                              setNewTaskTitle('');
                              setIsAddingTask(null);
                            }
                          }}
                          placeholder={`Add task to ${column.name}...`}
                          className="h-8 text-sm flex-1 max-w-md"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => handleAddTask(column.id)} className="h-8">
                          Add
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            setNewTaskTitle('');
                            setIsAddingTask(null);
                          }}
                          className="h-8"
                        >
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr className="border-b border-border/30 hover:bg-muted/20">
                    <td colSpan={2}></td>
                    <td colSpan={5} className="px-3 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingTask(column.id)}
                        className="text-muted-foreground hover:text-foreground h-8 px-2"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add task to {column.name}
                      </Button>
                    </td>
                  </tr>
                )}
              </SortableContext>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};