import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardTemplateType } from '@/types/palette';
import { getToolsForEnvironment, BoardTool } from '@/data/boardTools';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import individual tool components
import { CalculatorTool } from './CalculatorTool';
import { FileStorageTool } from './FileStorageTool';
import { PdfEditorTool } from './PdfEditorTool';
import { QuickNotesTool } from './QuickNotesTool';
import { MindMapTool } from './MindMapTool';
import { PomodoroTool } from './PomodoroTool';
import { FlashcardsTool } from './FlashcardsTool';
import { CodeSnippetsTool } from './CodeSnippetsTool';

interface ToolPanelProps {
  templateType: BoardTemplateType;
  boardId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const toolComponents: Record<string, React.FC<{ boardId: string; onClose: () => void }>> = {
  'calculator': CalculatorTool,
  'file-storage': FileStorageTool,
  'pdf-editor': PdfEditorTool,
  'quick-notes': QuickNotesTool,
  'mind-map': MindMapTool,
  'pomodoro': PomodoroTool,
  'flashcards': FlashcardsTool,
  'code-snippets': CodeSnippetsTool,
};

export const ToolPanel = ({ templateType, boardId, isOpen, onToggle }: ToolPanelProps) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const tools = getToolsForEnvironment(templateType);

  const ToolComponent = activeTool ? toolComponents[activeTool] : null;

  const handleToolClick = (toolId: string) => {
    if (toolComponents[toolId]) {
      setActiveTool(toolId);
    }
  };

  const handleCloseTool = () => {
    setActiveTool(null);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={onToggle}
        className={cn(
          "fixed right-4 top-1/2 -translate-y-1/2 z-40",
          "w-8 h-16 rounded-l-xl bg-primary/90 text-primary-foreground",
          "flex items-center justify-center shadow-lg",
          "hover:bg-primary transition-colors",
          isOpen && "right-[320px]"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </motion.button>

      {/* Tool Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-2xl z-30"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Board Tools</h2>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                    {tools.length} available
                  </span>
                </div>
              </div>

              {/* Tools Grid */}
              <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-3 gap-2">
                  {tools.map((tool) => (
                    <ToolButton
                      key={tool.id}
                      tool={tool}
                      isActive={activeTool === tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      hasComponent={!!toolComponents[tool.id]}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Tool Modal */}
      <AnimatePresence>
        {activeTool && ToolComponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseTool}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <ToolComponent boardId={boardId} onClose={handleCloseTool} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface ToolButtonProps {
  tool: BoardTool;
  isActive: boolean;
  onClick: () => void;
  hasComponent: boolean;
}

const ToolButton = ({ tool, isActive, onClick, hasComponent }: ToolButtonProps) => {
  const Icon = tool.icon;
  
  return (
    <motion.button
      onClick={onClick}
      disabled={!hasComponent}
      className={cn(
        "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all",
        "hover:bg-muted/80 active:scale-95",
        isActive && "bg-primary/10 ring-1 ring-primary/30",
        !hasComponent && "opacity-50 cursor-not-allowed"
      )}
      whileHover={hasComponent ? { y: -2 } : {}}
      whileTap={hasComponent ? { scale: 0.95 } : {}}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
        style={{ backgroundColor: `${tool.color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color: tool.color }} />
      </div>
      <span className="text-[10px] font-medium text-center leading-tight line-clamp-2">
        {tool.name}
      </span>
    </motion.button>
  );
};