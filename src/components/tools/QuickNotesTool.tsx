import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, StickyNote, Plus, Trash2, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
}

interface QuickNotesToolProps {
  boardId: string;
  onClose: () => void;
}

const NOTE_COLORS = [
  '#FEF3C7', // Yellow
  '#DBEAFE', // Blue
  '#FCE7F3', // Pink
  '#D1FAE5', // Green
  '#F3E8FF', // Purple
  '#FED7AA', // Orange
];

const STORAGE_KEY = 'palette_notes_';

export const QuickNotesTool = ({ boardId, onClose }: QuickNotesToolProps) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY + boardId);
    return stored ? JSON.parse(stored) : [];
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + boardId, JSON.stringify(notes));
  }, [notes, boardId]);

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: '',
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setEditingId(newNote.id);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(note => note.id === id ? { ...note, content } : note));
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(note => note.id === id ? { ...note, pinned: !note.pinned } : note));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <StickyNote className="w-4 h-4 text-pink-500" />
          </div>
          <span className="font-semibold">Quick Notes</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {notes.length} notes
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={addNote}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Note
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {sortedNotes.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {sortedNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div
                  className="rounded-xl p-3 min-h-[120px] shadow-sm transition-shadow hover:shadow-md"
                  style={{ backgroundColor: note.color }}
                >
                  <Textarea
                    value={note.content}
                    onChange={(e) => updateNote(note.id, e.target.value)}
                    placeholder="Write something..."
                    className="w-full h-full min-h-[80px] bg-transparent border-none resize-none text-sm text-zinc-700 placeholder:text-zinc-400 focus-visible:ring-0"
                  />
                  
                  {/* Note Actions */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePin(note.id)}
                      className={cn(
                        "h-6 w-6 bg-white/50 hover:bg-white/80",
                        note.pinned && "text-amber-500"
                      )}
                    >
                      <Pin className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNote(note.id)}
                      className="h-6 w-6 bg-white/50 hover:bg-white/80 text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Pinned Indicator */}
                  {note.pinned && (
                    <Pin className="absolute top-2 left-2 w-3 h-3 text-amber-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
              <StickyNote className="w-8 h-8 text-pink-500" />
            </div>
            <p className="font-medium mb-1">No notes yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first note to get started</p>
            <Button onClick={addNote}>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};