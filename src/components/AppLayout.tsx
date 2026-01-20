import { useState } from 'react';
import { RightSidebar } from './RightSidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <main 
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarCollapsed ? "mr-16" : "mr-72"
        )}
      >
        {children}
      </main>
      <RightSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
    </div>
  );
};
