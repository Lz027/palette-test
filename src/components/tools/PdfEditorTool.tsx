import { useState } from 'react';
import { X, FileText, Download, Plus, Type, Image, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PdfElement {
  id: string;
  type: 'heading' | 'paragraph' | 'image';
  content: string;
}

interface PdfEditorToolProps {
  boardId: string;
  onClose: () => void;
}

export const PdfEditorTool = ({ boardId, onClose }: PdfEditorToolProps) => {
  const [title, setTitle] = useState('Untitled Document');
  const [elements, setElements] = useState<PdfElement[]>([
    { id: '1', type: 'heading', content: 'Document Title' },
    { id: '2', type: 'paragraph', content: 'Start writing your content here...' },
  ]);

  const addElement = (type: PdfElement['type']) => {
    const newElement: PdfElement = {
      id: crypto.randomUUID(),
      type,
      content: type === 'heading' ? 'New Heading' : 'New paragraph...',
    };
    setElements([...elements, newElement]);
  };

  const updateElement = (id: string, content: string) => {
    setElements(elements.map(el => el.id === id ? { ...el, content } : el));
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
  };

  const exportToPdf = () => {
    // In a real implementation, we'd use a library like jsPDF
    const content = elements.map(el => {
      if (el.type === 'heading') return `# ${el.content}\n`;
      return `${el.content}\n\n`;
    }).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Document exported!');
  };

  return (
    <div className="flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-red-500" />
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-semibold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToPdf}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-border/30 bg-muted/30">
        <Button variant="ghost" size="sm" onClick={() => addElement('heading')}>
          <Type className="w-4 h-4 mr-1.5" />
          Heading
        </Button>
        <Button variant="ghost" size="sm" onClick={() => addElement('paragraph')}>
          <FileText className="w-4 h-4 mr-1.5" />
          Paragraph
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white dark:bg-zinc-900">
        {elements.map((element) => (
          <div key={element.id} className="group relative">
            {element.type === 'heading' ? (
              <Input
                value={element.content}
                onChange={(e) => updateElement(element.id, e.target.value)}
                className="text-xl font-bold border-none bg-transparent p-0 focus-visible:ring-0"
              />
            ) : (
              <Textarea
                value={element.content}
                onChange={(e) => updateElement(element.id, e.target.value)}
                className="min-h-[80px] border-none bg-transparent resize-none focus-visible:ring-0"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeElement(element.id)}
              className="absolute -right-2 top-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}

        {/* Add Element Button */}
        <Button
          variant="ghost"
          className="w-full border-2 border-dashed border-border/50 hover:border-primary/50"
          onClick={() => addElement('paragraph')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>
    </div>
  );
};