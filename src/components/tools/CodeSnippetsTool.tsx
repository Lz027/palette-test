import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Code, Plus, Trash2, Copy, Check, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  tags: string[];
  createdAt: string;
}

interface CodeSnippetsToolProps {
  boardId: string;
  onClose: () => void;
}

const STORAGE_KEY = 'palette_snippets_';

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'html', 'css', 'sql', 'bash', 'json', 'other'
];

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: 'bg-yellow-500',
  typescript: 'bg-blue-500',
  python: 'bg-green-500',
  html: 'bg-orange-500',
  css: 'bg-pink-500',
  sql: 'bg-purple-500',
  bash: 'bg-gray-500',
  json: 'bg-emerald-500',
  other: 'bg-muted',
};

export const CodeSnippetsTool = ({ boardId, onClose }: CodeSnippetsToolProps) => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY + boardId);
    return stored ? JSON.parse(stored) : [];
  });
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // New snippet form
  const [newTitle, setNewTitle] = useState('');
  const [newLanguage, setNewLanguage] = useState('javascript');
  const [newCode, setNewCode] = useState('');
  const [newTags, setNewTags] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + boardId, JSON.stringify(snippets));
  }, [snippets, boardId]);

  const addSnippet = () => {
    if (newTitle.trim() && newCode.trim()) {
      const snippet: CodeSnippet = {
        id: crypto.randomUUID(),
        title: newTitle,
        language: newLanguage,
        code: newCode,
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      };
      setSnippets([snippet, ...snippets]);
      setNewTitle('');
      setNewCode('');
      setNewTags('');
      setIsAdding(false);
      toast.success('Snippet saved!');
    }
  };

  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id));
    toast.success('Snippet deleted');
  };

  const copyCode = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Code className="w-4 h-4 text-blue-500" />
          </div>
          <span className="font-semibold">Code Snippets</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {snippets.length} saved
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Snippet
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {isAdding ? (
          /* Add New Snippet Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-4"
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Snippet title..."
                />
              </div>
              <div className="w-32">
                <label className="text-sm font-medium mb-1.5 block">Language</label>
                <Select value={newLanguage} onValueChange={setNewLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Code</label>
              <Textarea
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Paste your code here..."
                rows={6}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tags (comma separated)</label>
              <Input
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="react, hooks, utils..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addSnippet} className="flex-1">Save Snippet</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Search */}
            <div className="p-4 border-b border-border/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search snippets..."
                  className="pl-9"
                />
              </div>
            </div>

            {/* Snippets List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredSnippets.length > 0 ? (
                filteredSnippets.map((snippet) => (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-border/50 rounded-xl overflow-hidden group"
                  >
                    {/* Snippet Header */}
                    <div className="flex items-center justify-between p-3 bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", LANGUAGE_COLORS[snippet.language])} />
                        <span className="font-medium text-sm">{snippet.title}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {snippet.language}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyCode(snippet.id, snippet.code)}
                          className="h-7 w-7"
                        >
                          {copiedId === snippet.id ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSnippet(snippet.id)}
                          className="h-7 w-7 text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Code Preview */}
                    <pre className="p-3 bg-zinc-900 text-zinc-100 text-xs font-mono overflow-x-auto max-h-32">
                      <code>{snippet.code}</code>
                    </pre>

                    {/* Tags */}
                    {snippet.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 p-2 border-t border-border/30">
                        <Tag className="w-3 h-3 text-muted-foreground" />
                        {snippet.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : snippets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <Code className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="font-medium mb-1">No snippets yet</p>
                  <p className="text-sm text-muted-foreground mb-4">Save your first code snippet</p>
                  <Button onClick={() => setIsAdding(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Snippet
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No matching snippets</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};