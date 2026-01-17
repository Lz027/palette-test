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

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateBoardDialog = ({ open, onOpenChange }: CreateBoardDialogProps) => {
  const [name, setName] = useState('');
  const { createBoard, openBoard } = usePalette();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (name.trim()) {
      const board = createBoard(name.trim());
      openBoard(board.id);
      setName('');
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
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
          <div className="flex justify-end gap-2">
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
