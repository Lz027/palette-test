import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ExternalLink, Play, List, Youtube, Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface YouTubeIntegrationProps {
  value?: string;
  onChange: (url: string) => void;
  compact?: boolean;
}

export const YouTubeIntegration = ({ value, onChange, compact = false }: YouTubeIntegrationProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  const getVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getPlaylistId = (url: string): string | null => {
    const match = url.match(/[?&]list=([^&]+)/);
    return match ? match[1] : null;
  };

  const isPlaylist = value ? !!getPlaylistId(value) : false;
  const videoId = value ? getVideoId(value) : null;
  const playlistId = value ? getPlaylistId(value) : null;

  const handleSave = () => {
    onChange(inputValue);
    setOpen(false);
  };

  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value) {
      window.open(value, '_blank');
    }
  };

  const getThumbnail = () => {
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return null;
  };

  if (compact) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 gap-2 px-3 rounded-xl border border-border/50 transition-all duration-200",
              "hover:bg-red-500/10 hover:border-red-500/30 hover:scale-[1.02] active:scale-[0.98]",
              value ? "text-red-500" : "text-muted-foreground"
            )}
          >
            <Youtube className="w-4 h-4" />
            {value ? (
              <>
                <span className="truncate max-w-[80px] text-xs">{isPlaylist ? 'Playlist' : 'Video'}</span>
                <ExternalLink 
                  className="w-3 h-3 ml-auto hover:text-red-400"
                  onClick={handleVisit}
                />
              </>
            ) : (
              <span className="text-xs">Add YouTube</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 rounded-2xl overflow-hidden" align="start">
          <YouTubePopoverContent
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSave={handleSave}
            thumbnail={getThumbnail()}
            isPlaylist={isPlaylist}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative cursor-pointer rounded-2xl overflow-hidden border border-border/50 transition-all duration-300",
            "hover:shadow-lg hover:border-red-500/30 group",
            value ? "bg-gradient-to-br from-red-500/5 to-red-600/10" : "bg-muted/20"
          )}
        >
          {value && getThumbnail() ? (
            <div className="relative aspect-video">
              <img 
                src={getThumbnail()!} 
                alt="YouTube thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>
              {isPlaylist && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                  <List className="w-3 h-3" />
                  Playlist
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Youtube className="w-10 h-10" />
              <span className="text-sm font-medium">Add YouTube Link</span>
            </div>
          )}
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-2xl overflow-hidden" align="start">
        <YouTubePopoverContent
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSave={handleSave}
          thumbnail={getThumbnail()}
          isPlaylist={isPlaylist}
        />
      </PopoverContent>
    </Popover>
  );
};

interface YouTubePopoverContentProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSave: () => void;
  thumbnail: string | null;
  isPlaylist: boolean;
}

const YouTubePopoverContent = ({ inputValue, setInputValue, onSave, thumbnail, isPlaylist }: YouTubePopoverContentProps) => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-2 text-red-500">
      <Youtube className="w-5 h-5" />
      <span className="font-semibold">YouTube Integration</span>
    </div>
    
    {thumbnail && (
      <div className="rounded-xl overflow-hidden border border-border/30">
        <img src={thumbnail} alt="Preview" className="w-full aspect-video object-cover" />
      </div>
    )}
    
    <div className="space-y-2">
      <label className="text-xs text-muted-foreground font-medium">Video or Playlist URL</label>
      <div className="relative">
        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="https://youtube.com/watch?v=..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>
      <p className="text-[10px] text-muted-foreground">
        Supports videos and playlists • Paste any YouTube URL
      </p>
    </div>
    
    <div className="flex gap-2">
      <Button 
        onClick={onSave} 
        className="flex-1 rounded-xl bg-red-500 hover:bg-red-600"
      >
        Save
      </Button>
      {inputValue && (
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => window.open(inputValue, '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      )}
    </div>
  </div>
);
