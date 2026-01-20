import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Key, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  AlertTriangle,
  Info
} from 'lucide-react';
import { usePalette } from '@/contexts/PaletteContext';
import { AppLayout } from '@/components/AppLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import paletteLogo from '@/assets/palette-logo.jpg';

const Settings = () => {
  const { settings, updateSettings, exportData, clearAllData } = usePalette();
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showClaude, setShowClaude] = useState(false);
  const [showGemini, setShowGemini] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleClearData = () => {
    clearAllData();
    toast.success('All data cleared');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="px-6 py-5 border-b border-border/50">
          <h1 className="text-xl font-bold">Settings</h1>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          {/* API Keys Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">AI API Keys</h2>
            </div>
            
            <Card className="p-4 space-y-4">
              <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Add your API keys to enable AI-powered features like task generation and summaries.
                </p>
              </div>

              {/* OpenAI */}
              <div className="space-y-2">
                <Label htmlFor="openai-key" className="text-sm">OpenAI API Key</Label>
                <div className="relative">
                  <Input
                    id="openai-key"
                    type={showOpenAI ? 'text' : 'password'}
                    value={settings.openaiKey}
                    onChange={(e) => updateSettings({ openaiKey: e.target.value })}
                    placeholder="sk-..."
                    className="pr-10 h-9 text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowOpenAI(!showOpenAI)}
                  >
                    {showOpenAI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Claude */}
              <div className="space-y-2">
                <Label htmlFor="claude-key" className="text-sm">Claude API Key</Label>
                <div className="relative">
                  <Input
                    id="claude-key"
                    type={showClaude ? 'text' : 'password'}
                    value={settings.claudeKey}
                    onChange={(e) => updateSettings({ claudeKey: e.target.value })}
                    placeholder="sk-ant-..."
                    className="pr-10 h-9 text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowClaude(!showClaude)}
                  >
                    {showClaude ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Gemini */}
              <div className="space-y-2">
                <Label htmlFor="gemini-key" className="text-sm">Gemini API Key</Label>
                <div className="relative">
                  <Input
                    id="gemini-key"
                    type={showGemini ? 'text' : 'password'}
                    value={settings.geminiKey}
                    onChange={(e) => updateSettings({ geminiKey: e.target.value })}
                    placeholder="AI..."
                    className="pr-10 h-9 text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowGemini(!showGemini)}
                  >
                    {showGemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ai-enabled" className="text-sm">Enable AI Features</Label>
                  <p className="text-xs text-muted-foreground">Show AI buttons in board view</p>
                </div>
                <Switch
                  id="ai-enabled"
                  checked={settings.aiEnabled}
                  onCheckedChange={(checked) => updateSettings({ aiEnabled: checked })}
                />
              </div>
            </Card>
          </section>

          {/* Data Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Data Management</h2>
            
            <Card className="p-4 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data (JSON)
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-10 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Clear All Data?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your boards, tasks, and settings.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          </section>

          {/* About Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">About</h2>
            
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <img 
                  src={paletteLogo} 
                  alt="PALETTE" 
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-gradient">PALETTE</h3>
                  <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your projects, beautifully organized
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </AppLayout>
  );
};

export default Settings;
