import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Brain, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
}

interface MindMapToolProps {
  boardId: string;
  onClose: () => void;
}

const STORAGE_KEY = 'palette_mindmap_';

const NODE_COLORS = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-pink-500',
  'bg-cyan-500',
];

export const MindMapTool = ({ boardId, onClose }: MindMapToolProps) => {
  const [root, setRoot] = useState<MindMapNode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY + boardId);
    return stored ? JSON.parse(stored) : {
      id: 'root',
      text: 'Main Idea',
      children: [],
    };
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + boardId, JSON.stringify(root));
  }, [root, boardId]);

  const findAndUpdate = (node: MindMapNode, id: string, action: 'add' | 'delete' | 'update', newText?: string): MindMapNode => {
    if (node.id === id) {
      if (action === 'add') {
        return {
          ...node,
          children: [...node.children, { id: crypto.randomUUID(), text: 'New Idea', children: [] }],
        };
      }
      if (action === 'update' && newText !== undefined) {
        return { ...node, text: newText };
      }
    }

    const newChildren = node.children
      .map(child => findAndUpdate(child, id, action, newText))
      .filter(child => !(action === 'delete' && child.id === id));

    return { ...node, children: newChildren };
  };

  const addChild = (parentId: string) => {
    setRoot(prev => findAndUpdate(prev, parentId, 'add'));
  };

  const deleteNode = (id: string) => {
    if (id === 'root') return;
    setRoot(prev => findAndUpdate(prev, id, 'delete'));
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editingId) {
      setRoot(prev => findAndUpdate(prev, editingId, 'update', editText));
      setEditingId(null);
    }
  };

  const renderNode = (node: MindMapNode, depth: number = 0) => {
    const colorClass = NODE_COLORS[depth % NODE_COLORS.length];
    const isEditing = editingId === node.id;

    return (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        <div className="flex items-start gap-2">
          {/* Node */}
          <div
            className={cn(
              "group relative flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-md transition-transform hover:scale-105",
              colorClass
            )}
          >
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="h-6 text-sm bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={saveEdit}
                  className="h-6 w-6 text-white hover:bg-white/20"
                >
                  <Check className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <>
                <span className="font-medium text-sm">{node.text}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => addChild(node.id)}
                    className="h-5 w-5 text-white hover:bg-white/20"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => startEdit(node.id, node.text)}
                    className="h-5 w-5 text-white hover:bg-white/20"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  {node.id !== 'root' && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteNode(node.id)}
                      className="h-5 w-5 text-white hover:bg-white/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Children */}
        {node.children.length > 0 && (
          <div className="ml-8 mt-2 pl-4 border-l-2 border-border/50 space-y-2">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-purple-500" />
          </div>
          <span className="font-semibold">Mind Map</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Mind Map */}
      <div className="flex-1 p-6 overflow-auto">
        {renderNode(root)}
      </div>

      {/* Tips */}
      <div className="p-3 border-t border-border/50 bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Click + to add ideas • Click ✏️ to edit • Hover for more options
        </p>
      </div>
    </div>
  );
};