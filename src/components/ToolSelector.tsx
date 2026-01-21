import { useState } from 'react';
import { devTools, DevTool } from '@/data/devTools';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, Sparkles, Code, Palette, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ToolSelectorProps {
  value?: string;
  onChange: (toolId: string) => void;
  onVisit?: (url: string) => void;
}

const categoryIcons = {
  ai: Sparkles,
  dev: Code,
  design: Palette,
  platform: Cloud,
};

const categoryLabels = {
  ai: 'AI Tools',
  dev: 'Development',
  design: 'Design',
  platform: 'Platforms',
};

export const ToolSelector = ({ value, onChange, onVisit }: ToolSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedTool = devTools.find(t => t.id === value);
  
  const filteredTools = devTools.filter(tool =>
    tool.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, DevTool[]>);

  const handleSelect = (tool: DevTool) => {
    onChange(tool.id);
    setOpen(false);
    setSearch('');
  };

  const handleVisit = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
    onVisit?.(url);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-9 justify-start gap-2 px-3 text-sm font-normal transition-all duration-200",
            "hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98]",
            "rounded-xl border border-border/50",
            selectedTool ? "bg-primary/5" : "text-muted-foreground"
          )}
        >
          {selectedTool ? (
            <>
              <img 
                src={selectedTool.logo} 
                alt={selectedTool.name}
                className="w-4 h-4 rounded object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="truncate">{selectedTool.name}</span>
              <ExternalLink 
                className="w-3 h-3 ml-auto text-muted-foreground hover:text-primary transition-colors"
                onClick={(e) => handleVisit(e, selectedTool.url)}
              />
            </>
          ) : (
            <span>Select tool...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-0 rounded-2xl border-border/50 shadow-xl overflow-hidden"
        align="start"
      >
        <div className="p-3 border-b border-border/30 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-background border-border/50"
            />
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto p-2">
          <AnimatePresence>
            {Object.entries(groupedTools).map(([category, tools]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-3 last:mb-0"
                >
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Icon className="w-3 h-3" />
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </div>
                  <div className="space-y-0.5">
                    {tools.map((tool) => (
                      <motion.button
                        key={tool.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(tool)}
                        className={cn(
                          "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all",
                          "hover:bg-primary/10 group",
                          value === tool.id && "bg-primary/10"
                        )}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: `${tool.color}20` }}
                        >
                          <img 
                            src={tool.logo} 
                            alt={tool.name}
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-xs font-bold" style="color: ${tool.color}">${tool.name[0]}</span>`;
                              }
                            }}
                          />
                        </div>
                        <span className="flex-1 text-left text-sm font-medium">{tool.name}</span>
                        <ExternalLink 
                          className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                          onClick={(e) => handleVisit(e, tool.url)}
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredTools.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No tools found
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
