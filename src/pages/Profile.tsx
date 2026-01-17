import { useState } from 'react';
import { usePalette } from '@/contexts/PaletteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Key, Brain, Sparkles, ShieldCheck, User, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = usePalette();
  const [openaiKey, setOpenaiKey] = useState(settings.openaiKey || '');
  const [geminiKey, setGeminiKey] = useState(settings.geminiKey || '');
  const [aiEnabled, setAiEnabled] = useState(settings.aiEnabled || false);

  const handleSave = () => {
    updateSettings({
      openaiKey,
      geminiKey,
      aiEnabled,
    });
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
          </div>
          <Button onClick={handleSave} className="rounded-xl px-6">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column: User Info */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/50 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20" />
              <CardContent className="relative pt-12">
                <div className="absolute -top-10 left-6 w-20 h-20 rounded-2xl bg-background border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-xl">Test User</h3>
                  <p className="text-sm text-muted-foreground">test@example.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Free Tier</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">Active</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: API Keys & AI */}
          <div className="md:col-span-2 space-y-6">
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle>AI Assistant (Pal)</CardTitle>
                </div>
                <CardDescription>
                  Configure your AI assistant by providing your own API keys. We never store these on our servers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Enable Pal</Label>
                    <p className="text-sm text-muted-foreground">Allow the AI assistant to help you manage boards.</p>
                  </div>
                  <Switch 
                    checked={aiEnabled} 
                    onCheckedChange={setAiEnabled}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-orange-500" />
                        OpenAI API Key
                      </Label>
                      <a href="https://platform.openai.com/api-keys" target="_blank" className="text-xs text-primary hover:underline">Get Key</a>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="sk-..." 
                        className="pl-10 rounded-xl"
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                        Gemini API Key
                      </Label>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-xs text-primary hover:underline">Get Key</a>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="AIza..." 
                        className="pl-10 rounded-xl"
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/50 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 h-fit">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold">Privacy First</h4>
                    <p className="text-sm text-muted-foreground">
                      Your API keys are stored locally in your browser's storage. They are only used to make requests directly to the AI providers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
