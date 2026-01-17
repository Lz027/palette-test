import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const PALETTE_COLORS = [
  { name: 'Pastel Red', value: '#FF9AA2' },
  { name: 'Pastel Orange', value: '#FFB7B2' },
  { name: 'Pastel Yellow', value: '#FFDAC1' },
  { name: 'Pastel Green', value: '#B5EAD7' },
  { name: 'Pastel Blue', value: '#C7CEEA' },
  { name: 'Pastel Purple', value: '#E2C4E8' },
  { name: 'Pastel Pink', value: '#FFD1DC' },
  { name: 'Pastel Mint', value: '#C1FFC1' },
  { name: 'Pastel Lavender', value: '#E6E6FA' },
  { name: 'Pastel Peach', value: '#FFDAB9' },
  { name: 'Slate', value: '#64748b' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Zinc', value: '#71717a' },
  { name: 'Stone', value: '#78716c' },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  trigger?: React.ReactNode;
}

export function ColorPicker({ value, onChange, trigger }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start gap-2">
            <div 
              className="w-5 h-5 rounded border" 
              style={{ backgroundColor: value }}
            />
            <span className="text-sm">Pick a color</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Choose your palette</p>
          <div className="grid grid-cols-7 gap-2">
            {PALETTE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => onChange(color.value)}
                className={cn(
                  "w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 relative",
                  value === color.value ? "border-foreground ring-2 ring-offset-2 ring-foreground" : "border-transparent"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {value === color.value && (
                  <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
