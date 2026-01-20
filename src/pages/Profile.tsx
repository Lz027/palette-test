import { usePalette } from '@/contexts/PaletteContext';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Key, Sparkles, Shield, LogOut, Mail, Palette, Trash2, Database } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/AppLayout';
import { AnimatedSection } from '@/components/AnimatedSection';

const Profile = () => {
  const { settings, updateSettings, boards, tasks } = usePalette();
  const { user, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveKeys = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 800);
  };

  const clearLocalStorage = () => {
    if (confirm("Are you sure? This will delete all your local boards and tasks!")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <AppLayout>
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        
        <AnimatedSection direction="down">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-[1.5rem] bg-palette-purple/10 flex items-center justify-center border-2 border-palette-purple/20">
                <User className="h-8 w-8 text-palette-purple" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter">Profile</h1>
                <p className="text-muted-foreground font-medium">Manage your PALETTE workspace</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl text-destructive hover:bg-destructive/10">
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </AnimatedSection>

        {/* Account Info */}
        <AnimatedSection delay={0.1}>
          <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-palette-purple" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</p>
                    <p className="font-semibold">{user?.email || 'Not signed in'}</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest">
                  Verified
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* AI Configuration */}
        <AnimatedSection delay={0.2}>
          <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#FF6B6B]" />
                    Pal (Gemini 2.5)
                  </CardTitle>
                  <CardDescription>
                    Assistant is active and powered by your system API key.
                  </CardDescription>
                </div>
                <Switch 
                  checked={settings.aiEnabled} 
                  onCheckedChange={(checked) => updateSettings({ aiEnabled: checked })}
                />
              </div>
            </CardHeader>
          </Card>
        </AnimatedSection>

        {/* Workspace Stats */}
        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-[2rem] border-border/50 p-6 flex flex-col items-center text-center space-y-2">
              <Palette className="h-6 w-6 text-palette-purple" />
              <p className="text-2xl font-black">{boards.length}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Boards</p>
            </Card>
            <Card className="rounded-[2rem] border-border/50 p-6 flex flex-col items-center text-center space-y-2">
              <Database className="h-6 w-6 text-palette-red" />
              <p className="text-2xl font-black">{tasks.length}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tasks</p>
            </Card>
          </div>
        </AnimatedSection>

        {/* Danger Zone */}
        <AnimatedSection delay={0.4}>
          <Card className="rounded-[2rem] border-destructive/20 bg-destructive/5 shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Button 
                variant="destructive" 
                onClick={clearLocalStorage}
                className="w-full h-12 rounded-2xl font-bold"
              >
                Reset Local Workspace
              </Button>
              <p className="mt-3 text-[10px] text-center text-destructive/60 font-medium">
                This action is permanent and cannot be undone.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

      </div>
    </div>
    </AppLayout>
  );
};

export default Profile;
