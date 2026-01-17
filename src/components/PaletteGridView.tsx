import { Board, Group, Task, Column } from '@/types/palette';
import { usePalette } from '@/contexts/PaletteContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MoreHorizontal, ChevronDown, ChevronRight, MessageSquare, Trash2 } from 'lucide-react';
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

const STATUS_COLORS: Record<string, string> = {
  'Ready': 'bg-blue-500 hover:bg-blue-600',
  'Pending': 'bg-pink-500 hover:bg-pink-600',
  'Done': 'bg-green-500 hover:bg-green-600',
  'Stuck': 'bg-red-500 hover:bg-red-600',
  'Working': 'bg-orange-400 hover:bg-orange-500',
};

export function PaletteGridView({ board }: PaletteGridViewProps) {
  const { getBoardGroups, getGroupTasks, getBoardColumns, createTask, updateTask, createGroup, deleteGroup, deleteTask } = usePalette();
  const groups = getBoardGroups(board.id);
  const columns = getBoardColumns(board.id);
  
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
    <div className="flex flex-col space-y-8 pb-20 overflow-y-auto h-full custom-scrollbar">
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col">
          {/* Group Header */}
          <div className="flex items-center group/header mb-2">
            <button 
              onClick={() => toggleGroup(group.id)}
              className="p-1 hover:bg-muted rounded mr-2"
            >
              {expandedGroups[group.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <h3 
              className="font-bold text-lg" 
              style={{ color: group.color }}
            >
              {group.name}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 opacity-0 group-hover/header:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => deleteGroup(group.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table Content */}
          {expandedGroups[group.id] && (
            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="w-10 border-r"></th>
                    <th className="text-left p-3 font-medium text-muted-foreground border-r min-w-[300px]">Tasks</th>
                    <th className="w-12 border-r"></th>
                    <th className="w-24 border-r text-center font-medium text-muted-foreground">Subitems</th>
                    <th className="w-32 text-center font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getGroupTasks(group.id).map((task) => (
                    <tr key={task.id} className="border-b hover:bg-muted/20 group/row">
                      <td className="border-r text-center">
                        <div className="w-1 h-full absolute left-0" style={{ backgroundColor: group.color }} />
                      </td>
                      <td className="p-3 border-r relative">
                        <input 
                          className="bg-transparent border-none focus:ring-0 w-full font-medium"
                          defaultValue={task.title}
                          onBlur={(e) => updateTask(task.id, { title: e.target.value })}
                        />
                      </td>
                      <td className="border-r text-center">
                        <button className="p-1 text-muted-foreground hover:text-primary">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="border-r text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 border rounded flex items-center justify-center text-[10px] text-muted-foreground">
                            0
                          </div>
                        </div>
                      </td>
                      <td className="p-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={cn(
                              "w-full h-full p-3 text-white font-bold transition-colors",
                              STATUS_COLORS[task.status || 'Pending'] || 'bg-gray-400'
                            )}>
                              {task.status || 'Pending'}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {Object.keys(STATUS_COLORS).map(status => (
                              <DropdownMenuItem 
                                key={status} 
                                onClick={() => updateTask(task.id, { status })}
                                className="cursor-pointer"
                              >
                                <div className={cn("w-3 h-3 rounded-full mr-2", STATUS_COLORS[status])} />
                                {status}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {/* Add Item Row */}
                  <tr className="group/add">
                    <td className="border-r"></td>
                    <td className="p-0 border-r" colSpan={4}>
                      {addingToGroup === group.id ? (
                        <div className="flex items-center p-2 gap-2">
                          <Input 
                            autoFocus
                            placeholder="Item name"
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(group.id)}
                            className="h-8"
                          />
                          <Button size="sm" onClick={() => handleAddItem(group.id)}>Add</Button>
                          <Button size="sm" variant="ghost" onClick={() => setAddingToGroup(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setAddingToGroup(group.id)}
                          className="w-full text-left p-3 text-primary hover:bg-primary/5 transition-colors flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add item
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

      {/* Add Group Button */}
      <Button 
        variant="outline" 
        className="w-fit border-dashed border-2 py-6 px-8 rounded-xl text-lg font-bold text-primary hover:bg-primary/5"
        onClick={() => createGroup(board.id, 'New Group')}
      >
        <Plus className="h-6 w-6 mr-2" />
        Add Group
      </Button>
    </div>
  );
}
