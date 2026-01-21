import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AccountNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {user.name?.[0] || user.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border/50 backdrop-blur-md bg-background/80">
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {user.name?.[0] || user.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-bold leading-none tracking-tight">{user.name || 'User'}</p>
              <p className="text-[10px] font-medium leading-none text-muted-foreground opacity-70">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/40" />
        <div className="p-1">
          <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-lg cursor-pointer h-9 px-3 focus:bg-primary/5">
            <User className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-xs font-bold">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-lg cursor-pointer h-9 px-3 focus:bg-primary/5">
            <Settings className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-xs font-bold">Settings</span>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="bg-border/40" />
        <div className="p-1">
          <DropdownMenuItem 
            onClick={() => logout()} 
            className="rounded-lg cursor-pointer h-9 px-3 text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="text-xs font-bold">Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
