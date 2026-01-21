import { Column, Task } from '@/types/palette';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePalette } from '@/contexts/PaletteContext';
import { ColumnTypeRenderer } from './ColumnTypeRenderer';

interface TableViewProps {
  columns: Column[];
  getColumnTasks: (columnId: string) => Task[];
}

export function TableView({ columns, getColumnTasks }: TableViewProps) {
  const context = usePalette();
  const { deleteTask, deleteColumn, updateTask } = context;
  const createColumn = (context as any).createColumn;
  const allTasks = columns.flatMap(c => getColumnTasks(c.id));

  return (
    <div className="flex-1 overflow-auto bg-background/50">
      <div className="min-w-full inline-block align-middle">
        <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-12 px-4 py-3">
                  <Checkbox className="rounded-sm" />
                </TableHead>
                <TableHead className="px-4 py-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-r last:border-r-0 min-w-[200px]">
                  Task
                </TableHead>
                {columns.map((column) => (
                  <TableHead 
                    key={column.id} 
                    className="px-4 py-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-r last:border-r-0 group relative min-w-[150px]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{column.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteColumn(column.id)}
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-12 px-4 py-3 bg-muted/10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const name = prompt('Column name:');
                      if (name) createColumn(columns[0].boardId, name, 'text');
                    }}
                    className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTasks.length > 0 ? (
                allTasks.map((task) => (
                  <TableRow key={task.id} className="group hover:bg-muted/20 border-b last:border-b-0">
                    <TableCell className="px-4 py-2 border-r last:border-r-0">
                      <Checkbox className="rounded-sm" />
                    </TableCell>
                    <TableCell className="px-4 py-2 font-bold text-sm border-r last:border-r-0">
                      {task.title}
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id} className="px-4 py-2 border-r last:border-r-0">
                        <ColumnTypeRenderer
                          type={column.type}
                          value={task.data?.[column.id] || ''}
                          onChange={(val) => {
                            const newData = { ...(task.data || {}), [column.id]: val };
                            updateTask(task.id, { data: newData });
                          }}
                          isEditing={true}
                          settings={column.settings}
                        />
                      </TableCell>
                    ))}
                    <TableCell className="px-4 py-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 3} className="h-32 text-center text-muted-foreground italic">
                    Start by adding a task to your board
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
