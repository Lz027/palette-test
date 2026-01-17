import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Link as LinkIcon, FileText, Tag, Hash, List, ChevronDown } from 'lucide-react';
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

export const ColumnTypeRenderer = ({ type, value, onChange, isEditing, settings }: ColumnTypeRendererProps) => {
  if (!isEditing) {
    switch (type) {
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
