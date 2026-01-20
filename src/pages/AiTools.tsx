import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePalette } from "@/contexts/PaletteContext";
import { Sparkles, Send, Brain, Wand2, MessageSquare, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getGeminiResponse } from "@/lib/gemini";
import { cn } from "@/lib/utils";

const AiTools = () => {
  const { settings } = usePalette();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const systemKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : import.meta.env.VITE_GEMINI_API_KEY;
    if (!settings.geminiKey && !systemKey) {
      toast.error("Gemini API key is missing. Please check your setup.");
      return;
    }
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(settings.geminiKey || systemKey, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast.error("Failed to get response from Pal. Please check the API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex items-center justify-center w-12 h-12 bg-black rounded-2xl shadow-lg">
            <Sparkles className="w-7 h-7 text-[#FF6B6B] absolute -top-1 -left-1" />
            <Sparkles className="w-5 h-5 text-[#8A2BE2] absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Pal Assistant</h1>
            <p className="text-muted-foreground font-medium">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-6 h-6 text-palette-purple group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-palette-purple/10 text-palette-purple">ACTIVE</span>
              </div>
              <CardTitle>Intelligent Planning</CardTitle>
              <CardDescription>Let AI suggest board structures and task groups based on your project goals.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Wand2 className="w-6 h-6 text-palette-red group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-palette-red/10 text-palette-red">NEW</span>
              </div>
              <CardTitle>Auto-Categorize</CardTitle>
              <CardDescription>Automatically organize messy task lists into meaningful status groups.</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-primary/20 shadow-xl shadow-primary/5 bg-gradient-to-b from-card to-background">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <CardTitle>Chat with Pal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] mb-4 rounded-2xl border border-border/40 bg-card shadow-inner overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <div className="p-4 rounded-full bg-muted/50">
                    <Sparkles className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm italic font-medium">How can Pal help you today?</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}>
                    <div className={cn(
                      "px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted text-foreground rounded-tl-none border border-border/50"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1 font-bold uppercase tracking-tighter opacity-50">
                      {msg.role === 'user' ? 'You' : 'Pal'}
                    </span>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse ml-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Pal is thinking...
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="How can I organize my next React project?" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                className="rounded-xl h-12"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                className="h-12 w-12 rounded-xl shrink-0 bg-black hover:bg-black/90"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 text-white" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AiTools;
