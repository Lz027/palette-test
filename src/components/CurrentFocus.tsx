import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight } from 'lucide-react';
import { Board } from '@/types/palette';
import { usePalette } from '@/contexts/PaletteContext';

interface CurrentFocusProps {
  board: Board;
}

export const CurrentFocus = ({ board }: CurrentFocusProps) => {
  const navigate = useNavigate();
  const { getBoardTaskCount, getBoardProgress, openBoard } = usePalette();
  
  const taskCount = getBoardTaskCount(board.id);
  const progress = getBoardProgress(board.id);

  const handleClick = () => {
    openBoard(board.id);
    navigate(`/board/${board.id}`);
  };

  return (
    <Card className="gradient-palette p-5 text-primary-foreground overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-wider opacity-80 mb-1">Current Focus</p>
        <h2 className="text-xl font-bold mb-3">{board.name}</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold">{progress}%</p>
            <p className="text-xs opacity-80">{taskCount} tasks</p>
          </div>
          <Progress 
            value={progress} 
            className="w-24 h-2 bg-white/20 [&>div]:bg-white" 
          />
        </div>
        
        <Button 
          onClick={handleClick}
          variant="secondary"
          className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
        >
          Continue Working
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};
