import { useState, useRef, useEffect } from 'react';
import { usePalette } from '@/contexts/PaletteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Sparkles, X, Minimize2, Maximize2, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DualSparkIcon = ({ className }: { className?: string }) => (
  <div className={cn("relative flex items-center justify-center", className)}>
    <Sparkles className="h-full w-full text-palette-purple animate-pulse" />
    <Sparkles className="absolute h-3/5 w-3/5 text-palette-red -top-1 -right-1 animate-pulse [animation-delay:0.5s]" />
  </div>
);

export function PalAssistant() {
  const { settings } = usePalette();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Pal, your AI assistant. I can help you organize your boards and tasks. Have you added your API keys in the Profile page yet?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!settings.aiEnabled || (!settings.openaiKey && !settings.geminiKey)) {
      toast.error("Please enable AI and add an API key in your Profile first!");
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let responseContent = "";
      
      if (settings.openaiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: userMessage }],
            max_tokens: 500
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        responseContent = data.choices[0].message.content;
      } else if (settings.geminiKey) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }]
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        responseContent = data.candidates[0].content.parts[0].text;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
    } catch (error: any) {
      console.error("AI Error:", error);
      toast.error(`AI Error: ${error.message || "Failed to get response"}`);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please check your API key and connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 h-12 w-12 rounded-2xl shadow-lg z-[60] bg-background border border-border/50 hover:shadow-xl transition-all hover:scale-105 group"
      >
        <DualSparkIcon className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed right-6 top-6 z-[60] shadow-2xl border-border/50 transition-all duration-300 flex flex-col overflow-hidden rounded-[2rem]",
      isMinimized ? "h-14 w-64" : "h-[500px] w-[calc(100vw-3rem)] sm:w-[380px]"
    )}>
      <CardHeader className="p-4 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="bg-background p-2 rounded-xl border border-border/50">
            <DualSparkIcon className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-bold">Pal Assistant</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-3 max-w-[90%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}>
                <div className={cn(
                  "h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 border border-border/50",
                  msg.role === 'user' ? "bg-palette-purple/10" : "bg-muted"
                )}>
                  {msg.role === 'user' ? <User className="h-4 w-4 text-palette-purple" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' ? "bg-palette-purple text-white rounded-tr-none" : "bg-muted/50 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center border border-border/50">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t bg-background">
            <div className="relative">
              <Input 
                placeholder="Ask Pal anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="pr-10 rounded-2xl h-12 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-palette-purple hover:bg-transparent"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-3 flex items-center justify-center gap-1 font-medium">
              <Sparkles className="h-3 w-3 text-palette-purple" />
              Powered by your {settings.openaiKey ? "OpenAI" : "Gemini"} Key
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
