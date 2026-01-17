import { Column, Task } from '@/types/palette';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TableViewProps {
  columns: Column[];
  getColumnTasks: (columnId: string) => Task[];
}

export function TableView({ columns, getColumnTasks }: TableViewProps) {
  // Simple table view for now
  const allTasks = columns.flatMap(c => getColumnTasks(c.id));

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>Task Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allTasks.map((task) => {
            const statusCol = columns.find(c => c.id === task.columnId);
            return (
              <TableRow key={task.id} className="group hover:bg-muted/30">
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                    {statusCol?.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-2" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  ) : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map(tag => (
                      <Tag className="h-3 w-3" key={tag} />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
