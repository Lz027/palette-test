import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePalette } from "@/contexts/PaletteContext";
import { Sparkles, Send, Brain, Wand2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AiTools = () => {
  const { hasAiKeys } = usePalette();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!hasAiKeys()) {
      toast.error("Please add your OpenAI API key in settings first.");
      return;
    }
    toast.info("AI assistant processing... (Demo Mode)");
    setInput("");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-palette-purple/10 text-palette-purple">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-muted-foreground">Supercharge your productivity with Pal</p>
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
            <div className="h-[300px] mb-4 rounded-xl border border-dashed border-border/60 flex items-center justify-center text-muted-foreground text-sm">
              Start a conversation to get help with your projects
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="How can I organize my next React project?" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="rounded-xl h-12"
              />
              <Button onClick={handleSend} size="icon" className="h-12 w-12 rounded-xl shrink-0">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AiTools;
