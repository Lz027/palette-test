import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePalette } from '@/contexts/PaletteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Settings, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  Search,
  Plus,
  LayoutGrid,
  Pin,
  ExternalLink,
  PanelRightClose,
  PanelRight,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import paletteLogo from '@/assets/palette-logo.jpg';
import shosekiLogo from '@/assets/shoseki-logo.png';
import { CreateBoardDialog } from './CreateBoardDialog';

interface RightSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const RightSidebar = ({ collapsed = false, onToggle }: RightSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getActiveBoards, settings, hasAiKeys } = usePalette();
  const [boardsExpanded, setBoardsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const activeBoards = getActiveBoards();
  const filteredBoards = activeBoards.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isActive = (path: string) => location.pathname === path;
  const isBoardActive = (id: string) => location.pathname === `/board/${id}`;

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      <aside 
        className={cn(
          "fixed right-0 top-0 h-full bg-card border-l border-border/50 z-40 transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-72"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img 
                  src={paletteLogo} 
                  alt="PALETTE" 
                  className="h-9 w-9 rounded-xl object-cover"
                />
                <div>
                  <h1 className="text-sm font-bold text-gradient">PALETTE</h1>
                  <p className="text-[10px] text-muted-foreground">Project Manager</p>
                </div>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 shrink-0"
              onClick={onToggle}
            >
              {collapsed ? <PanelRight className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          {/* Search */}
          {!collapsed && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs bg-muted/30 border-none"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="space-y-1 mb-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-9 px-3 text-sm font-medium",
                  isActive(item.path) && "bg-primary/10 text-primary",
                  collapsed && "justify-center px-0"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                {!collapsed && item.label}
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Boards Table of Contents */}
          {!collapsed && (
            <div className="space-y-2">
              <button
                onClick={() => setBoardsExpanded(!boardsExpanded)}
                className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1 hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Boards ({activeBoards.length})
                </div>
                {boardsExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>

              {boardsExpanded && (
                <div className="space-y-0.5 pl-2">
                  {filteredBoards.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => navigate(`/board/${board.id}`)}
                      className={cn(
                        "flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors",
                        isBoardActive(board.id) 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <div 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: board.color }}
                      />
                      <span className="truncate flex-1">{board.name}</span>
                      {board.pinned && <Pin className="h-3 w-3 shrink-0 opacity-50" />}
                    </button>
                  ))}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-xs text-muted-foreground mt-1"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-2" />
                    New Board
                  </Button>
                </div>
              )}
            </div>
          )}

          {collapsed && (
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-full h-9"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Separator className="my-4" />

          {/* Pal AI Section */}
          {!collapsed && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-palette-purple" />
                AI Assistant
              </div>
              <div className="px-2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-palette-purple/10 to-palette-red/10 border border-palette-purple/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-palette-purple flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">Pal</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {hasAiKeys() 
                      ? "Ready to help with your tasks" 
                      : "Add API keys in settings to enable AI features"
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Shoseki AI Directory */}
        <div className="p-3 border-t border-border/50">
          <a 
            href="https://shoseki.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group",
              collapsed && "justify-center"
            )}
          >
            <img 
              src={shosekiLogo} 
              alt="Shoseki" 
              className="h-8 w-8 rounded-lg object-cover bg-slate-800"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold truncate">Shoseki</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] text-muted-foreground truncate">Your AI Directory</p>
              </div>
            )}
          </a>
        </div>
      </aside>

      <CreateBoardDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
};
