// Developer tools with logos and links for Software Dev boards
export interface DevTool {
  id: string;
  name: string;
  url: string;
  logo: string;
  category: 'ai' | 'dev' | 'design' | 'platform';
  color: string;
}

export const devTools: DevTool[] = [
  {
    id: 'canva',
    name: 'Canva',
    url: 'https://canva.com',
    logo: 'https://static.canva.com/web/images/12487a1e0770d29351bd4ce4f87ec8fe.svg',
    category: 'design',
    color: '#00C4CC',
  },
  {
    id: 'manus-ai',
    name: 'Manus AI',
    url: 'https://manus.im',
    logo: 'https://manus.im/favicon.ico',
    category: 'ai',
    color: '#6366F1',
  },
  {
    id: 'kimi-ai',
    name: 'Kimi AI',
    url: 'https://kimi.moonshot.cn',
    logo: 'https://statics.moonshot.cn/kimi-chat/favicon.ico',
    category: 'ai',
    color: '#7C3AED',
  },
  {
    id: 'genspark-ai',
    name: 'Genspark AI',
    url: 'https://genspark.ai',
    logo: 'https://www.genspark.ai/favicon.ico',
    category: 'ai',
    color: '#F59E0B',
  },
  {
    id: 'poe-ai',
    name: 'Poe AI',
    url: 'https://poe.com',
    logo: 'https://poe.com/favicon.ico',
    category: 'ai',
    color: '#8B5CF6',
  },
  {
    id: 'lovable',
    name: 'Lovable',
    url: 'https://lovable.dev',
    logo: 'https://lovable.dev/favicon.ico',
    category: 'dev',
    color: '#EC4899',
  },
  {
    id: 'replit',
    name: 'Replit',
    url: 'https://replit.com',
    logo: 'https://replit.com/public/icons/favicon-196.png',
    category: 'dev',
    color: '#F26207',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    url: 'https://supabase.com',
    logo: 'https://supabase.com/favicon/favicon-32x32.png',
    category: 'platform',
    color: '#3ECF8E',
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com',
    logo: 'https://github.githubassets.com/favicons/favicon-dark.svg',
    category: 'platform',
    color: '#333333',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    url: 'https://vercel.com',
    logo: 'https://vercel.com/favicon.ico',
    category: 'platform',
    color: '#000000',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://youtube.com',
    logo: 'https://www.youtube.com/s/desktop/4965577f/img/favicon_32x32.png',
    category: 'platform',
    color: '#FF0000',
  },
];

export const getToolById = (id: string): DevTool | undefined => {
  return devTools.find(tool => tool.id === id);
};

export const getToolsByCategory = (category: DevTool['category']): DevTool[] => {
  return devTools.filter(tool => tool.category === category);
};
