import { useState } from 'react';
import { usePalette } from '@/contexts/PaletteContext';
import { Board, Group, Task, Column, ColumnType } from '@/types/palette';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, MoreHorizontal, GripVertical, Trash2, 
  ChevronDown, ChevronRight, Settings2,
  Type, Calendar, CheckSquare, Link as LinkIcon,
  Hash, Tag, List, Youtube, Code, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolSelector } from './ToolSelector';
import { YouTubeIntegration } from './YouTubeIntegration';
import { ColumnEditor } from './ColumnEditor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InteractiveBoardProps {
  board: Board;
}

const columnTypeIcons: Record<ColumnType, typeof Type> = {
  text: Type,
  number: Hash,
  date: Calendar,
  checkbox: CheckSquare,
  link: LinkIcon,
  tags: Tag,
  select: List,
  status: List,
  file: Type,
  tool: Code,
  youtube: Youtube,
  priority: AlertTriangle,
};

const columnTypeColors: Record<ColumnType, string> = {
  text: 'text-slate-500',
  number: 'text-blue-500',
  date: 'text-amber-500',
  checkbox: 'text-green-500',
  link: 'text-cyan-500',
  tags: 'text-pink-500',
  select: 'text-purple-500',
  status: 'text-indigo-500',
  file: 'text-slate-500',
  tool: 'text-violet-500',
  youtube: 'text-red-500',
  priority: 'text-orange-500',
};

export const InteractiveBoard = ({ board }: InteractiveBoardProps) => {
  const { 
    getBoardGroups, getBoardColumns, getGroupTasks, 
    createTask, createGroup, updateTask, deleteTask, 
    updateGroup, deleteGroup, updateColumn, deleteColumn 
  } = usePalette();
  
  const groups = getBoardGroups(board.id);
  const columns = getBoardColumns(board.id);

  const handleAddTask = (groupId: string) => {
    createTask('', 'New Task', groupId);
  };

  return (
    <div className="space-y-8 pb-20 overflow-y-auto h-full custom-scrollbar">
      <AnimatePresence>
        {groups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
          >
            <GroupSection 
              group={group} 
              columns={columns}
              tasks={getGroupTasks(group.id)}
              onAddTask={() => handleAddTask(group.id)}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onUpdateGroup={updateGroup}
              onDeleteGroup={deleteGroup}
              onUpdateColumn={updateColumn}
              onDeleteColumn={deleteColumn}
              boardId={board.id}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Button 
          variant="ghost" 
          className="w-full py-8 border-2 border-dashed border-border/50 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all group"
          onClick={() => createGroup(board.id, 'New Group')}
        >
          <Plus className="w-5 h-5 mr-2 group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
          Add New Group
        </Button>
      </motion.div>
    </div>
  );
};

interface GroupSectionProps {
  group: Group;
  columns: Column[];
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateGroup: (id: string, updates: Partial<Group>) => void;
  onDeleteGroup: (id: string) => void;
  onUpdateColumn: (id: string, updates: Partial<Column>) => void;
  onDeleteColumn: (id: string) => void;
  boardId: string;
}

const GroupSection = ({ 
  group, columns, tasks, onAddTask, onUpdateTask, onDeleteTask, 
  onUpdateGroup, onDeleteGroup, onUpdateColumn, onDeleteColumn, boardId 
}: GroupSectionProps) => {
  const { createColumn } = usePalette();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

  const handleAddColumn = (type: ColumnType) => {
    const typeLabels: Record<ColumnType, string> = {
      text: 'Text',
      number: 'Number',
      date: 'Date',
      checkbox: 'Checkbox',
      link: 'Link',
      tags: 'Tags',
      select: 'Select',
      status: 'Status',
      file: 'File',
      tool: 'Tool',
      youtube: 'YouTube',
      priority: 'Priority',
    };
    createColumn(boardId, typeLabels[type], type);
  };

  return (
    <div className="space-y-3">
      {/* Group Header */}
      <div className="flex items-center justify-between group/header">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </motion.button>
          
          <div 
            className="w-1.5 h-7 rounded-full transition-all duration-300" 
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
              className="h-8 font-bold text-base bg-transparent border-none p-0 focus-visible:ring-0 w-fit"
            />
          ) : (
            <h3 
              className="text-base font-bold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsEditingName(true)}
            >
              {group.name}
            </h3>
          )}
          
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full"
          >
            {tasks.length}
          </motion.span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Add Column</div>
              <DropdownMenuSeparator />
              {(Object.keys(columnTypeIcons) as ColumnType[]).map((type) => {
                const Icon = columnTypeIcons[type];
                return (
                  <DropdownMenuItem 
                    key={type} 
                    onClick={() => handleAddColumn(type)}
                    className="cursor-pointer"
                  >
                    <Icon className={cn("w-4 h-4 mr-2", columnTypeColors[type])} />
                    <span className="capitalize">{type}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDeleteGroup(group.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card/80 backdrop-blur-sm border border-border/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  {/* Header */}
                  <thead>
                    <tr className="border-b border-border/30 bg-muted/10">
                      <th className="w-10 p-3"></th>
                      <th className="text-left p-3 min-w-[180px]">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          <Type className="w-3.5 h-3.5" />
                          Task
                        </div>
                      </th>
                      {columns.map((column) => {
                        const Icon = columnTypeIcons[column.type] || Type;
                        return (
                          <th key={column.id} className="text-left p-3 min-w-[140px]">
                            <div className="flex items-center justify-between group/col">
                              <div className={cn(
                                "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider",
                                columnTypeColors[column.type] || 'text-muted-foreground'
                              )}>
                                <Icon className="w-3.5 h-3.5" />
                                {column.name}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 opacity-0 group-hover/col:opacity-100 transition-opacity"
                                onClick={() => setEditingColumn(column)}
                              >
                                <Settings2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </th>
                        );
                      })}
                      <th className="w-10 p-3"></th>
                    </tr>
                  </thead>
                  
                  {/* Body */}
                  <tbody>
                    <AnimatePresence>
                      {tasks.map((task, index) => (
                        <TaskRow 
                          key={task.id} 
                          task={task}
                          columns={columns}
                          index={index}
                          onUpdate={(updates) => onUpdateTask(task.id, updates)}
                          onDelete={() => onDeleteTask(task.id)}
                        />
                      ))}
                    </AnimatePresence>
                    
                    {/* Add Task Row */}
                    <tr>
                      <td colSpan={columns.length + 3}>
                        <motion.button
                          whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
                          onClick={onAddTask}
                          className="w-full p-3 text-left text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group/add"
                        >
                          <Plus className="w-4 h-4 group-hover/add:scale-110 group-hover/add:rotate-90 transition-transform duration-200" />
                          <span className="text-sm font-medium">Add Task</span>
                        </motion.button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {editingColumn && (
        <ColumnEditor
          column={editingColumn}
          open={!!editingColumn}
          onOpenChange={(open) => !open && setEditingColumn(null)}
          onUpdate={(updates) => {
            onUpdateColumn(editingColumn.id, updates);
            setEditingColumn(null);
          }}
          onDelete={() => {
            onDeleteColumn(editingColumn.id);
            setEditingColumn(null);
          }}
        />
      )}
    </div>
  );
};

interface TaskRowProps {
  task: Task;
  columns: Column[];
  index: number;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}

const TaskRow = ({ task, columns, index, onUpdate, onDelete }: TaskRowProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const statusColors: Record<string, string> = {
    'Pending': 'bg-slate-500',
    'Backlog': 'bg-slate-500',
    'Not Started': 'bg-slate-500',
    'In Progress': 'bg-blue-500',
    'Learning': 'bg-blue-500',
    'Working': 'bg-orange-500',
    'Review': 'bg-purple-500',
    'Ready': 'bg-cyan-500',
    'Stuck': 'bg-red-500',
    'Done': 'bg-green-500',
    'Completed': 'bg-green-500',
  };

  const priorityColors: Record<string, string> = {
    'Low': 'bg-slate-400 text-white',
    'Medium': 'bg-amber-500 text-white',
    'High': 'bg-orange-500 text-white',
    'Urgent': 'bg-red-500 text-white',
  };

  const renderCell = (column: Column) => {
    const value = task.data?.[column.id];

    switch (column.type) {
      case 'status':
        const statusOptions = column.settings?.options || ['Pending', 'In Progress', 'Done'];
        return (
          <select
            value={value || statusOptions[0]}
            onChange={(e) => onUpdate({ data: { ...task.data, [column.id]: e.target.value } })}
            className={cn(
              "w-full h-8 rounded-lg text-white text-[10px] font-bold px-2 appearance-none cursor-pointer text-center transition-all duration-200 hover:opacity-90 active:scale-95 uppercase tracking-wider",
              statusColors[value] || 'bg-slate-500'
            )}
          >
            {statusOptions.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'priority':
        const priorityOptions = column.settings?.options || ['Low', 'Medium', 'High', 'Urgent'];
        return (
          <select
            value={value || ''}
            onChange={(e) => onUpdate({ data: { ...task.data, [column.id]: e.target.value } })}
            className={cn(
              "w-full h-8 rounded-lg text-[10px] font-bold px-2 appearance-none cursor-pointer text-center transition-all duration-200 hover:opacity-90 active:scale-95 uppercase tracking-wider",
              value ? priorityColors[value] : 'bg-muted text-muted-foreground'
            )}
          >
            <option value="">Select...</option>
            {priorityOptions.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'tool':
        return (
          <ToolSelector
            value={value}
            onChange={(toolId) => onUpdate({ data: { ...task.data, [column.id]: toolId } })}
          />
        );

      case 'youtube':
        return (
          <YouTubeIntegration
            value={value}
            onChange={(url) => onUpdate({ data: { ...task.data, [column.id]: url } })}
            compact
          />
        );

      case 'date':
        return (
          <Input 
            type="date"
            value={value ? value.split('T')[0] : ''}
            onChange={(e) => onUpdate({ data: { ...task.data, [column.id]: e.target.value ? new Date(e.target.value).toISOString() : null } })}
            className="h-8 bg-transparent border-border/30 rounded-xl text-xs cursor-pointer hover:border-primary/50 transition-colors"
          />
        );

      case 'checkbox':
        return (
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate({ data: { ...task.data, [column.id]: !value } })}
              className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
                value 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "border-border/50 hover:border-primary/50"
              )}
            >
              {value && (
                <motion.svg 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }}
                  className="w-3.5 h-3.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </motion.svg>
              )}
            </motion.button>
          </div>
        );

      case 'link':
        return (
          <div className="flex items-center gap-1">
            <Input 
              placeholder="Add link..."
              value={value || ''}
              onChange={(e) => onUpdate({ data: { ...task.data, [column.id]: e.target.value } })}
              className="h-8 bg-transparent border-border/30 rounded-xl text-xs text-blue-500 hover:border-primary/50 transition-colors"
            />
            {value && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </motion.a>
            )}
          </div>
        );

      case 'number':
        return (
          <Input 
            type="number"
            value={value || ''}
            onChange={(e) => onUpdate({ data: { ...task.data, [column.id]: e.target.value } })}
            className="h-8 bg-transparent border-border/30 rounded-xl text-xs font-mono hover:border-primary/50 transition-colors"
          />
        );

      default:
        return (
          <Input 
            value={value || ''}
            onChange={(e) => onUpdate({ data: { ...task.data, [column.id]: e.target.value } })}
            className="h-8 bg-transparent border-border/30 rounded-xl text-xs hover:border-primary/50 transition-colors"
          />
        );
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors group/row"
    >
      <td className="p-3">
        <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover/row:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors" />
      </td>
      
      <td className="p-3">
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
          <motion.div 
            className="font-medium cursor-text hover:text-primary transition-colors py-1"
            onClick={() => setIsEditing(true)}
            whileHover={{ x: 2 }}
          >
            {task.title}
          </motion.div>
        )}
      </td>
      
      {columns.map((column) => (
        <td key={column.id} className="p-3">
          {renderCell(column)}
        </td>
      ))}
      
      <td className="p-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="p-1.5 rounded-lg opacity-0 group-hover/row:opacity-100 transition-all text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </td>
    </motion.tr>
  );
};
