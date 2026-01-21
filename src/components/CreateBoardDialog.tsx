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
import { LayoutGrid, Kanban, Users, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColorPicker } from '@/components/ColorPicker';
import { BoardTemplate } from '@/types/palette';

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const templates = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start with a clean slate. Custom columns for any project.',
    icon: LayoutGrid,
    color: 'bg-slate-500',
  },
  {
    id: 'kanban',
    name: 'Kanban',
    description: 'Optimized for flow. To Do, In Progress, and Done views.',
    icon: Kanban,
    color: 'bg-indigo-500',
  },
  {
    id: 'todo',
    name: 'To Do List',
    description: 'A simple, clean list to track your daily tasks.',
    icon: LayoutGrid,
    color: 'bg-emerald-500',
  },
  {
    id: 'software',
    name: 'Software Dev',
    description: 'Integrated with your favorite dev tools and links.',
    icon: Kanban,
    color: 'bg-blue-500',
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Lead tracking, contact info, and deal management.',
    icon: Users,
    color: 'bg-rose-500',
  },
  {
    id: 'smart',
    name: 'SMART Memo',
    description: 'Write down and track your Specific, Measurable goals.',
    icon: FileText,
    color: 'bg-amber-500',
  },
] as const;

export const CreateBoardDialog = ({ open, onOpenChange }: CreateBoardDialogProps) => {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState<BoardTemplate>('blank');
  const [selectedColor, setSelectedColor] = useState('#FF9AA2');
  const { createBoard, openBoard } = usePalette();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (name.trim()) {
      const board = createBoard(name.trim(), template, selectedColor);
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter">Create New Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="board-name" className="text-xs font-bold uppercase tracking-widest ml-1">Board Name</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Q1 Marketing Plan"
              className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 text-lg font-semibold"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest ml-1">Board Color</Label>
            <ColorPicker value={selectedColor} onChange={setSelectedColor} />
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-widest ml-1">Choose a Template</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "relative flex flex-col p-5 rounded-[2rem] border-2 transition-all cursor-pointer hover:shadow-lg group",
                    template === t.id 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-border/50 bg-card hover:border-primary/20"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform", t.color)}>
                    <t.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-1">{t.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!name.trim()}
              className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Create Workspace
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
