import { Board, Group, Task } from '@/types/palette';
import { usePalette } from '@/contexts/PaletteContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PaletteGridViewProps {
  board: Board;
}

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Done', 'Stuck'];

const STATUS_COLORS: Record<string, string> = {
  'Pending': '#FF9AA2',
  'In Progress': '#FFD1DC',
  'Done': '#B5EAD7',
  'Stuck': '#C7CEEA',
};

export function PaletteGridView({ board }: PaletteGridViewProps) {
  const { getBoardGroups, getGroupTasks, createTask, updateTask, createGroup, deleteGroup, deleteTask } = usePalette();
  const groups = getBoardGroups(board.id);
  
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    groups.reduce((acc, g) => ({ ...acc, [g.id]: true }), {})
  );
  const [addingToGroup, setAddingToGroup] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleAddItem = (groupId: string) => {
    if (newItemTitle.trim()) {
      createTask('', newItemTitle.trim(), groupId);
      setNewItemTitle('');
      setAddingToGroup(null);
    }
  };

  return (
    <div className="flex flex-col space-y-6 pb-20 overflow-y-auto h-full">
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col">
          {/* Group Header - Minimalist */}
          <div className="flex items-center mb-3 group/header">
            <button 
              onClick={() => toggleGroup(group.id)}
              className="p-1 hover:bg-muted/50 rounded transition-colors mr-1"
            >
              {expandedGroups[group.id] ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </button>
            <h3 className="text-sm font-medium text-foreground">{group.name}</h3>
            <button 
              onClick={() => deleteGroup(group.id)}
              className="ml-2 p-1 opacity-0 group-hover/header:opacity-100 hover:bg-destructive/10 rounded transition-all"
            >
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>

          {/* Table Content - Notion-style */}
          {expandedGroups[group.id] && (
            <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left p-2.5 font-normal text-xs text-muted-foreground min-w-[400px]">Task</th>
                    <th className="w-32 text-left p-2.5 font-normal text-xs text-muted-foreground">Status</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {getGroupTasks(group.id).map((task, index) => (
                    <tr key={task.id} className={cn(
                      "border-b border-border/20 hover:bg-muted/30 transition-colors group/row",
                      index === getGroupTasks(group.id).length - 1 && "border-b-0"
                    )}>
                      <td className="p-2.5">
                        <input 
                          className="bg-transparent border-none focus:outline-none w-full text-sm text-foreground placeholder:text-muted-foreground"
                          defaultValue={task.title}
                          onBlur={(e) => updateTask(task.id, { title: e.target.value })}
                          placeholder="Task name"
                        />
                      </td>
                      <td className="p-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-full h-full p-2.5 text-left text-xs font-medium transition-colors hover:bg-muted/50 flex items-center gap-2">
                              <div 
                                className="w-2.5 h-2.5 rounded-full" 
                                style={{ backgroundColor: STATUS_COLORS[task.status || 'Pending'] }}
                              />
                              {task.status || 'Pending'}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-40">
                            {STATUS_OPTIONS.map(status => (
                              <DropdownMenuItem 
                                key={status} 
                                onClick={() => updateTask(task.id, { status })}
                                className="cursor-pointer text-xs"
                              >
                                <div 
                                  className="w-2.5 h-2.5 rounded-full mr-2" 
                                  style={{ backgroundColor: STATUS_COLORS[status] }}
                                />
                                {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="p-2">
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover/row:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Add Item Row */}
                  <tr>
                    <td colSpan={3} className="p-0">
                      {addingToGroup === group.id ? (
                        <div className="flex items-center p-2 gap-2 border-t border-border/20">
                          <Input 
                            autoFocus
                            placeholder="Task name"
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddItem(group.id);
                              if (e.key === 'Escape') setAddingToGroup(null);
                            }}
                            className="h-8 text-sm border-none focus-visible:ring-0 shadow-none"
                          />
                          <Button size="sm" variant="ghost" onClick={() => setAddingToGroup(null)} className="h-7 text-xs">
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setAddingToGroup(group.id)}
                          className="w-full text-left p-2.5 text-xs text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors flex items-center gap-2"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          New task
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* Add Group Button - Minimalist */}
      <Button 
        variant="ghost" 
        className="w-fit text-xs text-muted-foreground hover:text-foreground justify-start px-2 h-8"
        onClick={() => createGroup(board.id, 'New Group')}
      >
        <Plus className="h-3.5 w-3.5 mr-2" />
        New group
      </Button>
    </div>
  );
}
