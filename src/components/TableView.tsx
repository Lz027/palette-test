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
    <div className="flex-1 overflow-auto bg-background/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.15)]">
          <Table>
            <TableHeader className="bg-muted/10 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent border-b border-border/40">
                <TableHead className="w-16 px-8 py-6">
                  <Checkbox className="h-5 w-5 rounded-lg border-2 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all" />
                </TableHead>
                <TableHead className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 border-r border-border/40 min-w-[300px]">
                  Task Details
                </TableHead>
                {columns.map((column) => (
                  <TableHead 
                    key={column.id} 
                    className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 border-r border-border/40 group relative min-w-[200px]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Input
                        value={column.name}
                        onChange={(e) => updateColumn(column.id, { name: e.target.value })}
                        className="h-8 bg-transparent border-none focus-visible:ring-0 px-0 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 transition-colors hover:text-foreground"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteColumn(column.id)}
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-20 px-8 py-6 bg-muted/5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const name = prompt('Enter column name:');
                      if (name) createColumn(columns[0].boardId, name, 'text');
                    }}
                    className="h-10 w-10 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90 shadow-lg shadow-primary/10"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTasks.length > 0 ? (
                allTasks.map((task) => (
                  <TableRow key={task.id} className="group hover:bg-muted/5 border-b border-border/20 last:border-b-0 transition-all duration-300">
                    <TableCell className="px-8 py-5 border-r border-border/20">
                      <Checkbox className="h-5 w-5 rounded-lg border-2 border-border/50" />
                    </TableCell>
                    <TableCell className="px-8 py-5 border-r border-border/20">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-base tracking-tight text-foreground/90 group-hover:text-primary transition-colors">{task.title}</span>
                        {task.description && (
                          <span className="text-xs text-muted-foreground font-medium line-clamp-1 opacity-70">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id} className="px-8 py-5 border-r border-border/20">
                        <div className="scale-[1.02] origin-left transition-transform group-hover:scale-[1.05]">
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
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="px-8 py-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="h-10 w-10 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all rounded-xl active:scale-90"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 3} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 opacity-30 group">
                      <div className="w-20 h-20 rounded-[2rem] bg-muted flex items-center justify-center mb-2 transition-transform group-hover:scale-110 group-hover:rotate-12">
                        <Plus className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black uppercase tracking-[0.4em]">Empty Board</p>
                        <p className="text-sm font-medium">Add your first task to see the magic happen.</p>
                      </div>
                    </div>
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
