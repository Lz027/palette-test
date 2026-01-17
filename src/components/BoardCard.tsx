import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Pin, MoreVertical, Trash2, ArrowUpRight } from 'lucide-react';
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
      className={cn(
        "group p-5 cursor-pointer border-border/50 transition-all duration-300",
        "hover:shadow-xl hover:border-primary/30 hover:-translate-y-1",
        "active:scale-[0.98] touch-target relative overflow-hidden"
      )}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Pin indicator */}
      {board.pinned && (
        <div className="absolute top-3 left-3">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Pin className="h-3 w-3 text-primary fill-primary" />
          </div>
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("flex-1 pr-2", board.pinned && "pl-8")}>
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
              {board.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-scale-in">
                <DropdownMenuItem onClick={handlePin} className="cursor-pointer">
                  <Pin className="h-4 w-4 mr-2" />
                  {board.pinned ? 'Unpin' : 'Pin to top'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Progress value={progress} className="h-2 flex-1" />
            <span className={cn(
              "text-xs font-medium w-10 text-right transition-colors",
              progress === 100 ? "text-green-500" : "text-muted-foreground"
            )}>
              {progress}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {progress === 100 ? '✓ Complete' : progress > 0 ? 'In progress' : 'Not started'}
          </p>
        </div>
      </div>
    </Card>
  );
};