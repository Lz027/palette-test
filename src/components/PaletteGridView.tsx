import { usePalette } from '@/contexts/PaletteContext';
import { Board, Group, Task } from '@/types/palette';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MoreHorizontal, GripVertical, Calendar, Link as LinkIcon, Palette, Type, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PaletteGridViewProps {
  board: Board;
}

export const PaletteGridView = ({ board }: PaletteGridViewProps) => {
  const { getBoardGroups, getGroupTasks, createTask, createGroup, updateTask, deleteTask, updateGroup, deleteGroup } = usePalette();
  const groups = getBoardGroups(board.id);

  const handleAddTask = (groupId: string) => {
    createTask('', 'New Task', groupId);
  };

  return (
    <div className="space-y-12 pb-20 overflow-y-auto h-full custom-scrollbar">
      {groups.map((group) => (
        <GroupSection 
          key={group.id} 
          group={group} 
          tasks={getGroupTasks(group.id)}
          onAddTask={() => handleAddTask(group.id)}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onUpdateGroup={updateGroup}
          onDeleteGroup={deleteGroup}
        />
      ))}
      
      <Button 
        variant="ghost" 
        className="w-full py-8 border-2 border-dashed border-border/50 rounded-[2rem] text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all group"
        onClick={() => createGroup(board.id, 'New Group')}
      >
        <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
        Add New Group
      </Button>
    </div>
  );
};

interface GroupSectionProps {
  group: Group;
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateGroup: (id: string, updates: Partial<Group>) => void;
  onDeleteGroup: (id: string) => void;
}

const GroupSection = ({ group, tasks, onAddTask, onUpdateTask, onDeleteTask, onUpdateGroup, onDeleteGroup }: GroupSectionProps) => {
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <div className="space-y-3" id={`group-${group.id}`}>
      <div className="flex items-center justify-between group/header">
        <div className="flex items-center gap-2">
          <div 
            className="w-1 h-6 rounded-full" 
            style={{ backgroundColor: group.color || '#6A0DAD' }} 
          />
          {isEditingName ? (
            <Input
              autoFocus
              defaultValue={group.name}
              onBlur={(e) => {
                onUpdateGroup(group.id, { name: e.target.value });
                setIsEditingName(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              className="h-7 font-bold text-base bg-transparent border-none p-0 focus-visible:ring-0 w-fit"
            />
          ) : (
            <h3 
              className="text-base font-bold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsEditingName(true)}
            >
              {group.name}
            </h3>
          )}
          <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover/header:opacity-100 transition-opacity" onClick={() => onDeleteGroup(group.id)}>
          <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>

      <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px] min-w-[600px]">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="w-8 p-2"></th>
                <th className="text-left p-2 font-bold text-muted-foreground/60 uppercase tracking-tighter">
                  <div className="flex items-center gap-1.5">
                    <Type className="w-3 h-3" />
                    Task
                  </div>
                </th>
                <th className="text-left p-2 font-bold text-muted-foreground/60 uppercase tracking-tighter w-24 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Palette className="w-3 h-3" />
                    Status
                  </div>
                </th>
                <th className="text-left p-2 font-bold text-muted-foreground/60 uppercase tracking-tighter w-32">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Date
                  </div>
                </th>
                <th className="text-left p-2 font-bold text-muted-foreground/60 uppercase tracking-tighter w-40">
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3" />
                    Link
                  </div>
                </th>
                <th className="w-20 p-2 font-bold text-muted-foreground/60 uppercase tracking-tighter text-center border-l border-border/20 group/new-col cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" />
                    Column
                  </div>
                </th>
                <th className="w-8 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <TaskRow 
                  key={task.id} 
                  task={task} 
                  onUpdate={(updates) => onUpdateTask(task.id, updates)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))}
              <tr 
                className="hover:bg-muted/10 cursor-pointer transition-colors group/add"
                onClick={onAddTask}
              >
                <td className="p-2"></td>
                <td colSpan={5} className="p-2 text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    New Item
                  </div>
                </td>
                <td className="p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TaskRow = ({ task, onUpdate, onDelete }: { task: Task, onUpdate: (updates: Partial<Task>) => void, onDelete: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);

  const statusColors: Record<string, string> = {
    'Ready': 'bg-blue-500 shadow-blue-500/20',
    'Working': 'bg-orange-400 shadow-orange-400/20',
    'Stuck': 'bg-red-500 shadow-red-500/20',
    'Done': 'bg-green-500 shadow-green-500/20',
    'Pending': 'bg-slate-400 shadow-slate-400/20',
  };

  return (
    <tr className="border-b border-border/40 last:border-0 hover:bg-muted/5 transition-colors group/row">
      <td className="p-2 text-center">
        <GripVertical className="w-3 h-3 text-muted-foreground/20 group-hover/row:text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
      </td>
      <td className="p-2">
        {isEditing ? (
          <Input
            autoFocus
            defaultValue={task.title}
            onBlur={(e) => {
              onUpdate({ title: e.target.value });
              setIsEditing(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="h-7 bg-transparent border-none p-0 focus-visible:ring-0 font-medium text-[11px]"
          />
        ) : (
          <div 
            className="font-medium cursor-text truncate max-w-[300px]"
            onClick={() => setIsEditing(true)}
          >
            {task.title || 'Untitled'}
          </div>
        )}
      </td>
      <td className="p-2">
        <div className="flex justify-center">
          <select
            value={task.status || 'Pending'}
            onChange={(e) => onUpdate({ status: e.target.value })}
            className={cn(
              "w-20 h-5 rounded-md text-white text-[9px] font-black appearance-none cursor-pointer text-center transition-all active:scale-95 uppercase tracking-tighter shadow-sm",
              statusColors[task.status || 'Pending'] || 'bg-slate-400 shadow-slate-400/20'
            )}
          >
            <option value="Pending">PENDING</option>
            <option value="Working">WORKING</option>
            <option value="Ready">READY</option>
            <option value="Stuck">STUCK</option>
            <option value="Done">DONE</option>
          </select>
        </div>
      </td>
      <td className="p-2">
        <Input 
          type="date"
          value={task.dueDate ? task.dueDate.split('T')[0] : ''}
          onChange={(e) => onUpdate({ dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
          className="h-6 bg-transparent border-none p-0 focus-visible:ring-0 text-[10px] cursor-pointer text-muted-foreground w-full"
        />
      </td>
      <td className="p-2">
        <Input 
          placeholder="URL..."
          value={task.data?.link || ''}
          onChange={(e) => onUpdate({ data: { ...task.data, link: e.target.value } })}
          className="h-6 bg-transparent border-none p-0 focus-visible:ring-0 text-[10px] text-blue-500 hover:underline w-full"
        />
      </td>
      <td className="p-2 border-l border-border/10 bg-muted/5"></td>
      <td className="p-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-0 group-hover/row:opacity-100 transition-opacity text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Plus className="w-3 h-3 rotate-45" />
        </Button>
      </td>
    </tr>
  );
};
