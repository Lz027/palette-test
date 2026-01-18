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
    <div className="space-y-4">
      <div className="flex items-center justify-between group/header">
        <div className="flex items-center gap-3">
          <div 
            className="w-1.5 h-8 rounded-full" 
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
              className="h-8 font-bold text-lg bg-transparent border-none p-0 focus-visible:ring-0 w-fit"
            />
          ) : (
            <h3 
              className="text-lg font-bold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsEditingName(true)}
            >
              {group.name}
            </h3>
          )}
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover/header:opacity-100 transition-opacity" onClick={() => onDeleteGroup(group.id)}>
          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>

      <div className="bg-card border border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="w-10 p-4"></th>
                <th className="text-left p-4 font-semibold text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Task Name
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-muted-foreground w-40">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Status
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-muted-foreground w-48">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-muted-foreground w-48">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Link
                  </div>
                </th>
                <th className="w-10 p-4"></th>
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
                className="hover:bg-muted/20 cursor-pointer transition-colors group/add"
                onClick={onAddTask}
              >
                <td className="p-4"></td>
                <td colSpan={4} className="p-4 text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Add Item
                  </div>
                </td>
                <td className="p-4"></td>
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
    'Ready': 'bg-blue-500',
    'Working': 'bg-orange-400',
    'Stuck': 'bg-red-500',
    'Done': 'bg-green-500',
    'Pending': 'bg-slate-400',
  };

  return (
    <tr className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors group/row">
      <td className="p-4 text-center">
        <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover/row:text-muted-foreground cursor-grab active:cursor-grabbing" />
      </td>
      <td className="p-4">
        {isEditing ? (
          <Input
            autoFocus
            defaultValue={task.title}
            onBlur={(e) => {
              onUpdate({ title: e.target.value });
              setIsEditing(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="h-8 bg-transparent border-none p-0 focus-visible:ring-0 font-medium"
          />
        ) : (
          <div 
            className="font-medium cursor-text"
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </div>
        )}
      </td>
      <td className="p-4">
        <select
          value={task.status || 'Pending'}
          onChange={(e) => onUpdate({ status: e.target.value })}
          className={cn(
            "w-full h-8 rounded-lg text-white text-[10px] font-black px-2 appearance-none cursor-pointer text-center transition-transform active:scale-95 uppercase tracking-wider",
            statusColors[task.status || 'Pending'] || 'bg-slate-400'
          )}
        >
          <option value="Pending">PENDING</option>
          <option value="Working">WORKING</option>
          <option value="Ready">READY</option>
          <option value="Stuck">STUCK</option>
          <option value="Done">DONE</option>
        </select>
      </td>
      <td className="p-4">
        <Input 
          type="date"
          value={task.dueDate ? task.dueDate.split('T')[0] : ''}
          onChange={(e) => onUpdate({ dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
          className="h-8 bg-transparent border-none p-0 focus-visible:ring-0 text-xs cursor-pointer text-muted-foreground"
        />
      </td>
      <td className="p-4">
        <Input 
          placeholder="Add link..."
          value={task.data?.link || ''}
          onChange={(e) => onUpdate({ data: { ...task.data, link: e.target.value } })}
          className="h-8 bg-transparent border-none p-0 focus-visible:ring-0 text-xs text-blue-500 hover:underline"
        />
      </td>
      <td className="p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 opacity-0 group-hover/row:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Plus className="w-4 h-4 rotate-45" />
        </Button>
      </td>
    </tr>
  );
};
