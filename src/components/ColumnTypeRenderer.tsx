import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Link as LinkIcon, FileText, Tag, Hash, List, ChevronDown, Youtube, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColumnType } from '@/types/palette';
import { Badge } from '@/components/ui/badge';

interface ColumnTypeRendererProps {
  type: ColumnType;
  value: any;
  onChange: (value: any) => void;
  isEditing?: boolean;
  settings?: any;
}

const DEV_TOOLS: Record<string, { name: string, url: string, color: string, icon: string }> = {
  canva: { name: 'Canva', url: 'https://www.canva.com', color: 'bg-[#00C4CC]', icon: 'https://www.canva.com/favicon.ico' },
  manus: { name: 'Manus AI', url: 'https://manus.ai', color: 'bg-slate-800', icon: 'https://manus.ai/favicon.ico' },
  kimi: { name: 'Kimi AI', url: 'https://kimi.moonshot.cn', color: 'bg-[#FF6B00]', icon: 'https://kimi.moonshot.cn/favicon.ico' },
  genspark: { name: 'GenSpark', url: 'https://www.genspark.ai', color: 'bg-[#6D28D9]', icon: 'https://www.genspark.ai/favicon.ico' },
  poe: { name: 'Poe', url: 'https://poe.com', color: 'bg-[#B91C1C]', icon: 'https://poe.com/favicon.ico' },
  lovable: { name: 'Lovable', url: 'https://lovable.dev', color: 'bg-[#EC4899]', icon: 'https://lovable.dev/favicon.ico' },
  replit: { name: 'Replit', url: 'https://replit.com', color: 'bg-[#F26207]', icon: 'https://replit.com/favicon.ico' },
  supabase: { name: 'Supabase', url: 'https://supabase.com', color: 'bg-[#3ECF8E]', icon: 'https://supabase.com/favicon.ico' },
  github: { name: 'GitHub', url: 'https://github.com', color: 'bg-[#181717]', icon: 'https://github.com/favicon.ico' },
  vercel: { name: 'Vercel', url: 'https://vercel.com', color: 'bg-black', icon: 'https://vercel.com/favicon.ico' },
};

export const ColumnTypeRenderer = ({ type, value, onChange, isEditing, settings }: ColumnTypeRendererProps) => {
  if (!isEditing) {
    switch (type) {
      case 'dev-tool':
        const tool = DEV_TOOLS[value as string];
        return tool ? (
          <a 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:scale-105 hover:shadow-2xl active:scale-95 ring-offset-background hover:ring-2 hover:ring-primary/20", 
              tool.color
            )}
          >
            <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-md">
              <img src={tool.icon} className="w-3.5 h-3.5 rounded-sm brightness-0 invert" alt="" />
            </div>
            {tool.name}
          </a>
        ) : null;
      case 'youtube-playlist':
        return value ? (
          <a 
            href={value.includes('youtube.com') ? value : `https://www.youtube.com/results?search_query=${value}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-red-600/10 text-red-600 border border-red-600/20 hover:bg-red-600 hover:text-white transition-all group active:scale-95 hover:shadow-xl hover:shadow-red-600/20"
          >
            <div className="w-5 h-5 rounded-lg bg-red-600/10 flex items-center justify-center group-hover:bg-white/20">
              <Youtube className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.15em]">Watch Course</span>
          </a>
        ) : null;
      case 'checkbox':
        return <Checkbox checked={!!value} disabled />;
      case 'date':
        return value ? <span className="text-sm">{format(new Date(value), 'MMM d, yyyy')}</span> : null;
      case 'link':
        return value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
            <LinkIcon className="w-3 h-3" />
            <span className="text-sm truncate max-w-[150px]">{value}</span>
          </a>
        ) : null;
      case 'tags':
        return Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1">
            {value.map((tag: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-[10px] py-0 h-4">{tag}</Badge>
            ))}
          </div>
        ) : null;
      case 'select':
      case 'status':
        return value ? (
          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
            {value}
          </Badge>
        ) : null;
      case 'number':
        return <span className="text-sm font-mono">{value}</span>;
      default:
        return <span className="text-sm">{value}</span>;
    }
  }

  // Editing states
  switch (type) {
    case 'dev-tool':
      return (
        <select 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8 px-2 py-1 text-[10px] font-bold uppercase rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="">Select Tool...</option>
          {Object.entries(DEV_TOOLS).map(([id, t]) => (
            <option key={id} value={id}>{t.name}</option>
          ))}
        </select>
      );
    case 'youtube-playlist':
      return (
        <div className="relative group">
          <Input 
            placeholder="URL or Playlist ID" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            className="h-8 pl-8 text-xs font-medium"
          />
          <Youtube className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 opacity-50 group-focus-within:opacity-100" />
        </div>
      );
    case 'checkbox':
      return <Checkbox checked={!!value} onCheckedChange={onChange} />;
    case 'date':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal h-8">
              <CalendarIcon className="mr-2 h-3 w-3" />
              {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => onChange(date?.toISOString())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    case 'select':
    case 'status':
      const options = settings?.options || ['No Options'];
      return (
        <div className="relative w-full">
          <select 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 px-2 py-1 text-sm rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none appearance-none"
          >
            <option value="">Select...</option>
            {options.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>
      );
    case 'number':
      return (
        <Input 
          type="number" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          className="h-8"
        />
      );
    default:
      return (
        <Input 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          className="h-8"
        />
      );
  }
};
