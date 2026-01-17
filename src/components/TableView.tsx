import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Settings2, Trash2, Type, Hash, Calendar, CheckSquare, Link as LinkIcon, List, Tag, Sparkles } from 'lucide-react';
import { Column as ColumnType, Task } from '@/types/palette';
import { TableRow } from './TableRow';
import { usePalette } from '@/contexts/PaletteContext';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow as UITableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ColumnEditor } from './ColumnEditor';
import { parseFormula } from '@/utils/columnFormulas';

const TYPE_ICONS: Record<string, any> = {
  text: Type,
  number: Hash,
  date: Calendar,
  checkbox: CheckSquare,
  link: LinkIcon,
  select: List,
  status: Sparkles,
  tags: Tag,
};

interface TableViewProps {
  columns: ColumnType[];
  getColumnTasks: (columnId: string) => Task[];
}

export const TableView = ({ columns, getColumnTasks }: TableViewProps) => {
  const { createTask, updateColumn, deleteColumn, createColumn, tasks } = usePalette();
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null);

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

  const boardTasks = columns.length > 0 ? columns.flatMap(c => getColumnTasks(c.id)) : [];

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <UITableRow className="bg-muted/20 hover:bg-muted/20">
              <TableHead className="w-10"></TableHead>
              <TableHead className="min-w-[200px] font-semibold">Task Name</TableHead>
              {columns.map((column) => {
                const Icon = TYPE_ICONS[column.type] || Type;
                return (
                  <TableHead key={column.id} className="min-w-[120px]">
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-semibold">{column.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setEditingColumn(column)}
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableHead>
                );
              })}
              <TableHead className="w-12"></TableHead>
            </UITableRow>
          </TableHeader>
          <TableBody>
            {columns.map((column) => {
              const columnTasks = getColumnTasks(column.id);
              return (
                <SortableContext 
                  key={column.id} 
                  items={columnTasks.map(t => t.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  <UITableRow className="bg-muted/5 font-medium border-l-2 border-l-primary/50">
                    <td colSpan={columns.length + 3} className="px-3 py-1.5 text-xs text-muted-foreground uppercase tracking-wider">
                      {column.name} ({columnTasks.length})
                    </td>
                  </UITableRow>
                  {columnTasks.map(task => (
                    <TableRow 
                      key={task.id} 
                      task={task} 
                      columns={columns}
                      columnColors={{}}
                    />
                  ))}
                  {/* Add Task Row */}
                  <UITableRow className="hover:bg-muted/20">
                    <td colSpan={2} className="px-3 py-2">
                      {isAddingTask === column.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddTask(column.id);
                              if (e.key === 'Escape') setIsAddingTask(null);
                            }}
                            placeholder="Task title..."
                            className="h-8 text-sm max-w-sm"
                            autoFocus
                          />
                          <Button size="sm" onClick={() => handleAddTask(column.id)} className="h-8">Add</Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAddingTask(column.id)}
                          className="text-muted-foreground hover:text-foreground h-8 px-2"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Task
                        </Button>
                      )}
                    </td>
                    <td colSpan={columns.length + 1}></td>
                  </UITableRow>
                </SortableContext>
              );
            })}
            
            {/* Formula / Aggregation Row */}
            <UITableRow className="bg-muted/30 font-medium">
              <td colSpan={2} className="px-3 py-3 text-sm">Totals / Aggregations</td>
              {columns.map((column) => (
                <td key={column.id} className="px-3 py-3 text-sm font-mono text-primary">
                  {column.formula ? (
                    parseFormula(column.formula, columns, boardTasks)
                  ) : column.type === 'number' ? (
                    boardTasks.reduce((acc, t) => acc + (Number(t.data?.[column.id]) || 0), 0)
                  ) : null}
                </td>
              ))}
              <td></td>
            </UITableRow>
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-border/50 bg-muted/20">
        {isAddingColumn ? (
          <div className="flex items-center gap-2">
            <Input
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="New column name..."
              className="h-9 w-48"
              autoFocus
            />
            <Button onClick={handleAddColumn}>Create Column</Button>
            <Button variant="ghost" onClick={() => setIsAddingColumn(false)}>Cancel</Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setIsAddingColumn(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Column
          </Button>
        )}
      </div>

      {editingColumn && (
        <ColumnEditor
          column={editingColumn}
          open={!!editingColumn}
          onOpenChange={(open) => !open && setEditingColumn(null)}
          onUpdate={(updates) => updateColumn(editingColumn.id, updates)}
          onDelete={() => {
            deleteColumn(editingColumn.id);
            setEditingColumn(null);
          }}
        />
      )}
    </div>
  );
};