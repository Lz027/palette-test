import { useState, useEffect } from 'react';
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
  User,
  Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import paletteLogo from '@/assets/palette-logo.jpg';
import { CreateBoardDialog } from './CreateBoardDialog';

interface RightSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const RightSidebar = ({ collapsed = false, onToggle }: RightSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getActiveBoards, settings, hasAiKeys, getBoardGroups, boards } = usePalette();
  const [boardsExpanded, setBoardsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const activeBoards = getActiveBoards();
  const filteredBoards = activeBoards.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isActive = (path: string) => location.pathname === path;
  const isBoardActive = (id: string) => location.pathname === `/board/${id}`;

  const boardId = location.pathname.startsWith('/board/') ? location.pathname.split('/')[2] : null;
  const currentBoard = boards.find(b => b.id === boardId);
  const currentGroups = boardId ? getBoardGroups(boardId) : [];

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const scrollToGroup = (groupId: string) => {
    const element = document.getElementById(`group-${groupId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <aside 
        className={cn(
          "fixed right-0 top-0 h-full bg-card border-l border-border/50 z-40 transition-all duration-300 flex flex-col shadow-2xl",
          collapsed ? "w-16" : "w-72"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-muted/5">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img 
                  src={paletteLogo} 
                  alt="PALETTE" 
                  className="h-8 w-8 rounded-lg object-cover"
                />
                <div>
                  <h1 className="text-sm font-bold tracking-tight text-foreground">PALETTE</h1>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Workspace</p>
                </div>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 shrink-0 hover:bg-muted"
              onClick={onToggle}
            >
              {collapsed ? <PanelRight className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          {/* Navigation */}
          <div className="space-y-1 mb-6">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-9 px-3 text-sm font-medium rounded-xl transition-all",
                  isActive(item.path) ? "bg-primary/10 text-primary shadow-sm" : "hover:bg-muted/50",
                  collapsed && "justify-center px-0"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                {!collapsed && item.label}
              </Button>
            ))}
          </div>

          {!collapsed && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input 
                  placeholder="Search boards..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 text-xs bg-muted/30 border-none rounded-lg focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>
            </div>
          )}

          {/* Table of Contents (Current Board) */}
          {!collapsed && currentBoard && currentGroups.length > 0 && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2 px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Hash className="h-3 w-3" />
                Contents
              </div>
              <div className="space-y-0.5">
                {currentGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => scrollToGroup(group.id)}
                    className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group"
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full shrink-0 opacity-60 group-hover:opacity-100" 
                      style={{ backgroundColor: group.color || '#6A0DAD' }} 
                    />
                    <span className="truncate">{group.name}</span>
                  </button>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          )}

          {/* Boards List */}
          {!collapsed && (
            <div className="space-y-2">
              <button
                onClick={() => setBoardsExpanded(!boardsExpanded)}
                className="flex items-center justify-between w-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1 hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-3 w-3" />
                  Boards ({activeBoards.length})
                </div>
                {boardsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>

              {boardsExpanded && (
                <div className="space-y-0.5">
                  {filteredBoards.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => navigate(`/board/${board.id}`)}
                      className={cn(
                        "flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all",
                        isBoardActive(board.id) 
                          ? "bg-primary/5 text-primary font-semibold border border-primary/10 shadow-sm" 
                          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                      )}
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full shrink-0 shadow-sm" 
                        style={{ backgroundColor: board.color }}
                      />
                      <span className="truncate flex-1">{board.name}</span>
                      {board.pinned && <Pin className="h-2.5 w-2.5 shrink-0 opacity-40" />}
                    </button>
                  ))}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-[10px] text-muted-foreground mt-1 hover:bg-muted/50 rounded-lg"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    New Board
                  </Button>
                </div>
              )}
            </div>
          )}

          {collapsed && (
            <div className="flex flex-col items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl bg-primary/5 text-primary"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          )}

          <Separator className="my-6 opacity-50" />

          {/* Pal AI Assistant Tab */}
          {!collapsed && (
            <div className="mb-4">
              <button 
                className="w-full text-left p-3 rounded-2xl bg-black border border-border/50 hover:border-primary/30 transition-all group relative overflow-hidden"
                onClick={() => navigate('/ai')}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <Sparkles className="h-5 w-5 text-[#FF6B6B] absolute -top-1 -left-1" />
                    <Sparkles className="h-4 w-4 text-[#8A2BE2] absolute -bottom-1 -right-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">Talk to Pal</span>
                    </div>
                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter truncate">AI Assistant</p>
                  </div>
                </div>
              </button>
            </div>
          )}

        </ScrollArea>

        {/* Shoseki AI Directory */}
        <div className="p-3 bg-muted/5 border-t border-border/50">
          <a 
            href="https://shoseki.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 p-3 rounded-2xl bg-black border border-border/50 hover:border-primary/30 transition-all group",
              collapsed && "justify-center"
            )}
          >
            <div className="h-8 w-8 rounded-lg shrink-0 shadow-sm border border-white/10">
              <img 
                src="/shoseki-logo.png" 
                alt="Shoseki" 
                className="h-full w-full object-contain"
              />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white truncate">Shoseki</span>
                  <ExternalLink className="h-2.5 w-2.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter truncate">AI Directory</p>
              </div>
            )}
          </a>
        </div>
      </aside>

      <CreateBoardDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
};
