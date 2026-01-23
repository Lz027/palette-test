import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Plus, Trash2, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardsToolProps {
  boardId: string;
  onClose: () => void;
}

const STORAGE_KEY = 'palette_flashcards_';

export const FlashcardsTool = ({ boardId, onClose }: FlashcardsToolProps) => {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY + boardId);
    return stored ? JSON.parse(stored) : [
      { id: '1', front: 'What is React?', back: 'A JavaScript library for building user interfaces' },
    ];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + boardId, JSON.stringify(cards));
  }, [cards, boardId]);

  const addCard = () => {
    if (newFront.trim() && newBack.trim()) {
      const newCard: Flashcard = {
        id: crypto.randomUUID(),
        front: newFront,
        back: newBack,
      };
      setCards([...cards, newCard]);
      setNewFront('');
      setNewBack('');
      setIsAdding(false);
    }
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    if (currentIndex >= cards.length - 1) {
      setCurrentIndex(Math.max(0, cards.length - 2));
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <span className="font-semibold">Flashcards</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {cards.length} cards
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Card
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6">
        {isAdding ? (
          /* Add New Card Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium mb-1.5 block">Front (Question)</label>
              <Input
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                placeholder="Enter question or term..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Back (Answer)</label>
              <Textarea
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                placeholder="Enter answer or definition..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addCard} className="flex-1">Add Card</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </motion.div>
        ) : cards.length > 0 ? (
          /* Flashcard Display */
          <div className="flex flex-col items-center gap-6">
            {/* Card */}
            <div 
              className="relative w-full max-w-md h-64 cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="absolute inset-0 preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 flex items-center justify-center text-white backface-hidden shadow-xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p className="text-xl font-medium text-center">{currentCard?.front}</p>
                </div>
                
                {/* Back */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 flex items-center justify-center text-white backface-hidden shadow-xl"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <p className="text-lg text-center">{currentCard?.back}</p>
                </div>
              </motion.div>
            </div>

            {/* Hint */}
            <p className="text-xs text-muted-foreground">
              <RotateCw className="w-3 h-3 inline mr-1" />
              Click card to flip
            </p>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevCard}
                disabled={cards.length <= 1}
                className="rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm font-medium min-w-[60px] text-center">
                {currentIndex + 1} / {cards.length}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={nextCard}
                disabled={cards.length <= 1}
                className="rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Delete current card */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteCard(currentCard.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete Card
            </Button>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
            <p className="font-medium mb-1">No flashcards yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first flashcard to start studying</p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Flashcard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};