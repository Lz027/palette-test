import { useState } from 'react';
import { RightSidebar } from './RightSidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <main 
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "md:mr-16" : "mr-0 md:mr-72"
        )}
      >
        <div className="relative pb-20 md:pb-0">
          {children}
        </div>
      </main>
      <div className="hidden md:block">
        <RightSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>
    </div>
  );
};
