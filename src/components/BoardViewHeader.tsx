import { Board } from '@/types/palette';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Pin, Share2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePalette } from '@/contexts/PaletteContext';

interface BoardViewHeaderProps {
  board: Board;
}

export function BoardViewHeader({ board }: BoardViewHeaderProps) {
  const navigate = useNavigate();
  const { togglePinBoard } = usePalette();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${board.color}20` }}
          >
            <LayoutGrid className="h-6 w-6" style={{ color: board.color }} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{board.name}</h1>
            <p className="text-xs text-muted-foreground">
              Last opened {new Date(board.lastOpenedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => togglePinBoard(board.id)}
          className={board.pinned ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground"}
        >
          <Pin className="h-5 w-5" fill={board.pinned ? "currentColor" : "none"} />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Share2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

import { LayoutGrid } from 'lucide-react';
