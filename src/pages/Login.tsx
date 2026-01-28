import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Mail, Sparkles } from 'lucide-react';
import paletteLogo from '@/assets/palette-logo.jpg';

export const Login = () => {
  const { loginWithGithub, loginWithEmail, isLoading } = useAuth();
  const [email, setEmail] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      loginWithEmail(email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-palette-purple/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-palette-blue/10 rounded-full blur-[120px]" />

      <Card className="w-full max-w-md rounded-[2.5rem] border-none shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)] bg-background/80 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-4 pt-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden border-2 border-background">
            <img src={paletteLogo} alt="Palette" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black tracking-tighter italic uppercase">Welcome Back</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
              Enter your creative studio
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-10">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2 px-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium text-lg px-6"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-black hover:bg-black/90 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? "Signing in..." : "Continue with Email"}
              <Mail className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => loginWithGithub()}
            className="w-full h-14 rounded-2xl border-2 border-muted/50 hover:bg-muted/30 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95"
            disabled={isLoading}
          >
            GitHub
            <Github className="ml-2 w-4 h-4" />
          </Button>

          <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
            By continuing, you agree to our creative terms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};