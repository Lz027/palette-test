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
import { cn } from '@/lib/utils';

interface BoardCardCompactProps {
  board: Board;
}

export const BoardCardCompact = ({ board }: BoardCardCompactProps) => {
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
      className={cn(
        "group p-3 cursor-pointer border-border/40 transition-all duration-200",
        "hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5",
        "active:scale-[0.99] relative overflow-hidden"
      )}
    >
      {/* Color accent bar */}
      <div 
        className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
        style={{ backgroundColor: board.color }}
      />
      
      <div className="pl-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {board.pinned && (
              <Pin className="h-3 w-3 shrink-0" style={{ color: board.color }} />
            )}
            <h3 className="font-medium text-sm text-foreground truncate">
              {board.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-muted-foreground">
              {taskCount}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem onClick={handlePin} className="cursor-pointer text-xs">
                  <Pin className="h-3 w-3 mr-2" />
                  {board.pinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer text-xs">
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className={cn(
            "text-[10px] font-medium w-8 text-right",
            progress === 100 ? "text-green-500" : "text-muted-foreground"
          )}>
            {progress}%
          </span>
        </div>
      </div>
    </Card>
  );
};
