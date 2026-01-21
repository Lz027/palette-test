import { Column, Task } from '@/types/palette';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePalette } from '@/contexts/PaletteContext';
import { ColumnTypeRenderer } from './ColumnTypeRenderer';

interface TableViewProps {
  columns: Column[];
  getColumnTasks: (columnId: string) => Task[];
}

export function TableView({ columns, getColumnTasks }: TableViewProps) {
  const context = usePalette();
  const { deleteTask, deleteColumn, updateTask, updateColumn } = context;
  const createColumn = (context as any).createColumn;
  const allTasks = columns.flatMap(c => getColumnTasks(c.id));

  return (
    <div className="flex-1 overflow-auto bg-background/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-card rounded-[3rem] border border-border/40 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-700 hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in-95 duration-500">
          <Table>
            <TableHeader className="bg-muted/5 backdrop-blur-xl">
              <TableRow className="hover:bg-transparent border-b border-border/40">
                <TableHead className="w-20 px-10 py-8">
                  <Checkbox className="h-6 w-6 rounded-xl border-2 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all hover:scale-110 active:scale-90" />
                </TableHead>
                <TableHead className="px-10 py-8 text-[12px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 border-r border-border/40 min-w-[350px]">
                  Board Content
                </TableHead>
                {columns.map((column) => (
                  <TableHead 
                    key={column.id} 
                    className="px-10 py-8 text-[12px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 border-r border-border/40 group relative min-w-[220px]"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <Input
                        value={column.name}
                        onChange={(e) => updateColumn(column.id, { name: e.target.value })}
                        className="h-10 bg-transparent border-none focus-visible:ring-0 px-0 text-[12px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 transition-all hover:text-foreground hover:translate-x-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteColumn(column.id)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive rounded-2xl hover:rotate-12 active:scale-75"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-24 px-10 py-8 bg-muted/5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const name = prompt('Enter column name:');
                      if (name) createColumn(columns[0].boardId, name, 'text');
                    }}
                    className="h-12 w-12 rounded-[1.5rem] bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-90 shadow-xl shadow-primary/10 hover:shadow-primary/30"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTasks.length > 0 ? (
                allTasks.map((task) => (
                  <TableRow key={task.id} className="group hover:bg-muted/10 border-b border-border/20 last:border-b-0 transition-all duration-500 hover:translate-y-[-2px]">
                    <TableCell className="px-10 py-6 border-r border-border/20">
                      <Checkbox className="h-6 w-6 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-colors" />
                    </TableCell>
                    <TableCell className="px-10 py-6 border-r border-border/20">
                      <div className="flex flex-col gap-2">
                        <span className="font-black text-lg tracking-tight text-foreground/90 group-hover:text-primary transition-all group-hover:translate-x-1">{task.title}</span>
                        {task.description && (
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-50 group-hover:opacity-80 transition-opacity">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id} className="px-10 py-6 border-r border-border/20">
                        <div className="scale-[1.05] origin-left transition-all duration-500 group-hover:scale-[1.1] group-hover:translate-x-1">
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
                    <TableCell className="px-10 py-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="h-12 w-12 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-2xl hover:rotate-6 active:scale-75"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 3} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center gap-6 opacity-20 group transition-all hover:opacity-40">
                      <div className="w-24 h-24 rounded-[3rem] bg-muted flex items-center justify-center mb-2 transition-all duration-700 group-hover:scale-125 group-hover:rotate-[15deg] group-hover:bg-primary/20">
                        <Plus className="w-12 h-12 group-hover:text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-black uppercase tracking-[0.6em] transition-all group-hover:tracking-[0.8em]">Workspace Empty</p>
                        <p className="text-sm font-bold uppercase tracking-widest">Tap the plus to begin your journey</p>
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
