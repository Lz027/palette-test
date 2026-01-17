import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Target, TrendingUp } from 'lucide-react';
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
    <Card className="relative gradient-palette p-6 text-primary-foreground overflow-hidden group hover:shadow-2xl transition-all duration-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Target className="h-4 w-4" />
          </div>
          <p className="text-xs uppercase tracking-wider opacity-80 font-medium">Current Focus</p>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 group-hover:translate-x-1 transition-transform duration-300">{board.name}</h2>
        
        <div className="flex items-end justify-between mb-5 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 opacity-70" />
              <p className="text-3xl font-bold">{progress}%</p>
            </div>
            <p className="text-sm opacity-80">{taskCount} {taskCount === 1 ? 'task' : 'tasks'} total</p>
          </div>
          <div className="flex-1 max-w-[120px]">
            <Progress 
              value={progress} 
              className="h-3 bg-white/20 [&>div]:bg-white [&>div]:transition-all [&>div]:duration-500" 
            />
            <p className="text-xs opacity-60 mt-1 text-right">
              {progress < 100 ? 'In progress' : 'Complete!'}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleClick}
          variant="secondary"
          className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-300 group/btn hover:scale-[1.02] shadow-lg"
        >
          Continue Working
          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </Card>
  );
};