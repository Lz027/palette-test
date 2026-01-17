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
import { BottomNav } from '@/components/BottomNav';
import { usePalette } from '@/contexts/PaletteContext';
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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-4 py-5 border-b border-border/50">
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <main className="px-4 py-5 space-y-6">
        {/* API Keys Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">API Keys</h2>
          </div>
          
          <Card className="p-4 space-y-4">
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                API keys are stored locally on your device. They're used directly for AI features
                and are never sent to our servers.
              </p>
            </div>

            {/* OpenAI */}
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="openai-key"
                    type={showOpenAI ? 'text' : 'password'}
                    value={settings.openaiKey}
                    onChange={(e) => updateSettings({ openaiKey: e.target.value })}
                    placeholder="sk-..."
                    className="pr-10"
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
            </div>

            {/* Claude */}
            <div className="space-y-2">
              <Label htmlFor="claude-key">Claude API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="claude-key"
                    type={showClaude ? 'text' : 'password'}
                    value={settings.claudeKey}
                    onChange={(e) => updateSettings({ claudeKey: e.target.value })}
                    placeholder="sk-ant-..."
                    className="pr-10"
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
            </div>

            {/* Gemini */}
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Gemini API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="gemini-key"
                    type={showGemini ? 'text' : 'password'}
                    value={settings.geminiKey}
                    onChange={(e) => updateSettings({ geminiKey: e.target.value })}
                    placeholder="AI..."
                    className="pr-10"
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
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-enabled">Enable AI Features</Label>
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
              className="w-full justify-start"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data (JSON)
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive"
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
                className="h-14 w-14 rounded-xl object-cover"
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

      <BottomNav />
    </div>
  );
};

export default Settings;
