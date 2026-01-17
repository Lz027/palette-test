import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Pin, MoreVertical, Trash2 } from 'lucide-react';
import { Board } from '@/types/palette';
import { usePalette } from '@/contexts/PaletteContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface BoardCardProps {
  board: Board;
}

export const BoardCard = ({ board }: BoardCardProps) => {
  const navigate = useNavigate();
  const { getBoardTaskCount, getBoardProgress, togglePinBoard, deleteBoard, openBoard } = usePalette();
  
  const taskCount = getBoardTaskCount(board.id);
  const progress = getBoardProgress(board.id);

  const handleClick = () => {
    openBoard(board.id);
    navigate(`/board/${board.id}`);
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePinBoard(board.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBoard(board.id);
  };

  return (
    <Card
      onClick={handleClick}
      className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30 animate-fade-in touch-target relative group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground truncate flex-1 pr-2">{board.name}</h3>
        <div className="flex items-center gap-1">
          {board.pinned && (
            <Pin className="h-4 w-4 text-primary fill-primary" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePin}>
                <Pin className="h-4 w-4 mr-2" />
                {board.pinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </p>
        <div className="flex items-center gap-2">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-xs text-muted-foreground w-8">{progress}%</span>
        </div>
      </div>
    </Card>
  );
};
