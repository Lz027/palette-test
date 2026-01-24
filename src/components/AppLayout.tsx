import { useState } from 'react';
import { RightSidebar } from './RightSidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <main 
        className={cn(
          "min-h-screen transition-all duration-300 w-full",
          sidebarCollapsed ? "sm:mr-16" : "sm:mr-72"
        )}
      >
        <div className="pb-24 sm:pb-0">
          {children}
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:static sm:z-0">
         <RightSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>
    </div>
  );
};
