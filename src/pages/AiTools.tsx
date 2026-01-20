import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Key, MessageSquare, ListTodo, FileText } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { usePalette } from '@/contexts/PaletteContext';
import { useNavigate } from 'react-router-dom';

const AiTools = () => {
  const { hasAiKeys } = usePalette();
  const navigate = useNavigate();

  const aiFeatures = [
    {
      icon: MessageSquare,
      title: 'Generate Description',
      description: 'Let Pal write detailed task descriptions for you',
    },
    {
      icon: ListTodo,
      title: 'Suggest Next Tasks',
      description: 'Get AI-powered suggestions for your next steps',
    },
    {
      icon: FileText,
      title: 'Summarize Board',
      description: 'Get a quick overview of your project status',
    },
  ];

  return (
    <AppLayout>
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 py-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Meet Pal</h1>
            <p className="text-xs text-muted-foreground">Your AI assistant</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-5 space-y-6">
        {!hasAiKeys ? (
          <Card className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Key className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Add Your API Keys</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Connect your OpenAI, Claude, or Gemini API keys to unlock Pal's AI features.
              Your keys are stored securely on your device.
            </p>
            <Button onClick={() => navigate('/settings')}>
              <Key className="h-4 w-4 mr-2" />
              Add API Keys
            </Button>
          </Card>
        ) : (
          <>
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-1">Pal is ready!</h2>
              <p className="text-muted-foreground text-sm">
                Open any board to use AI features
              </p>
            </div>

            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Available Features
              </h3>
              <div className="space-y-3">
                {aiFeatures.map((feature) => (
                  <Card key={feature.title} className="p-4 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
    </AppLayout>
  );
};

export default AiTools;
