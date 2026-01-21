import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePalette } from '@/contexts/PaletteContext';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, CheckSquare, Code, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColorPicker } from '@/components/ColorPicker';
import { BoardTemplateType } from '@/types/palette';
import { motion } from 'framer-motion';

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const templates: {
  id: BoardTemplateType;
  name: string;
  description: string;
  icon: typeof LayoutGrid;
  color: string;
  gradient: string;
}[] = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start fresh with a clean slate',
    icon: LayoutGrid,
    color: 'bg-slate-500',
    gradient: 'from-slate-400 to-slate-600',
  },
  {
    id: 'todo',
    name: 'To Do List',
    description: 'Track tasks with status & priority',
    icon: CheckSquare,
    color: 'bg-emerald-500',
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'softwaredev',
    name: 'Software Dev',
    description: 'Manage projects with tool integrations',
    icon: Code,
    color: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-purple-600',
  },
  {
    id: 'learning',
    name: 'Learning',
    description: 'Track courses with YouTube playlists',
    icon: BookOpen,
    color: 'bg-amber-500',
    gradient: 'from-amber-400 to-orange-600',
  },
];

export const CreateBoardDialog = ({ open, onOpenChange }: CreateBoardDialogProps) => {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState<BoardTemplateType>('blank');
  const [color, setColor] = useState('#FF9AA2');
  const { createBoard, openBoard } = usePalette();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (name.trim()) {
      const board = createBoard(name.trim(), template, color);
      openBoard(board.id);
      setName('');
      setTemplate('blank');
      onOpenChange(false);
      navigate(`/board/${board.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="board-name" className="text-sm font-medium">Board Name</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="My Awesome Project"
              autoFocus
              className="h-11 rounded-xl text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="board-color" className="text-sm font-medium">Board Color</Label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose a Template</Label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((t) => (
                <motion.div
                  key={t.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "relative flex flex-col p-4 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden group",
                    template === t.id 
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                      : "border-border/50 bg-card hover:border-primary/30 hover:shadow-md"
                  )}
                >
                  {/* Gradient background on hover/select */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
                    t.gradient,
                    template === t.id ? "opacity-10" : "group-hover:opacity-5"
                  )} />
                  
                  <div className="relative z-10">
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-all duration-300",
                      "bg-gradient-to-br shadow-inner",
                      t.gradient
                    )}>
                      <t.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-0.5">{t.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                  
                  {/* Selection indicator */}
                  {template === t.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!name.trim()}
              className="rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity"
            >
              Create Board
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
