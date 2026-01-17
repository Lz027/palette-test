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
import { LayoutGrid, Kanban, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const templates = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start with a clean slate. Add columns as needed.',
    icon: LayoutGrid,
    color: 'bg-slate-500',
  },
  {
    id: 'kanban',
    name: 'Kanban',
    description: 'Perfect for workflow management. Organize tasks by status.',
    icon: Kanban,
    color: 'bg-indigo-500',
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Manage contacts and deals. Track customer relationships.',
    icon: Users,
    color: 'bg-rose-500',
  },
] as const;

export const CreateBoardDialog = ({ open, onOpenChange }: CreateBoardDialogProps) => {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState<'blank' | 'kanban' | 'crm'>('blank');
  const { createBoard, openBoard } = usePalette();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (name.trim()) {
      const board = createBoard(name.trim(), template);
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="board-name">Board Name</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="My Awesome Project"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Choose a Template</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "relative flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
                    template === t.id 
                      ? "border-primary bg-primary/5" 
                      : "border-muted bg-card"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", t.color)}>
                    <t.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{t.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim()}>
              Create Board
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
