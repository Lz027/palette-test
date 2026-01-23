import { BoardTemplateType } from '@/types/palette';
import { 
  Calculator, 
  FileText, 
  FolderOpen, 
  Lightbulb, 
  Brain, 
  Zap,
  Target,
  ListTodo,
  Code,
  BookOpen,
  Palette,
  StickyNote,
  Timer,
  GitBranch,
  Bug,
  Presentation,
  GraduationCap,
  Video,
  type LucideIcon
} from 'lucide-react';

export interface BoardTool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: 'general' | 'brainstorm' | 'productivity' | 'development' | 'learning';
  color: string;
  environments: BoardTemplateType[];
}

// General tools available to all or most boards
export const boardTools: BoardTool[] = [
  // General Tools (available to all)
  {
    id: 'file-storage',
    name: 'File Storage',
    description: 'Store and organize your files',
    icon: FolderOpen,
    category: 'general',
    color: '#3B82F6',
    environments: ['blank', 'todo', 'softwaredev', 'learning', 'smart_goal'],
  },
  {
    id: 'pdf-editor',
    name: 'PDF Editor',
    description: 'Create and edit PDF documents',
    icon: FileText,
    category: 'general',
    color: '#EF4444',
    environments: ['blank', 'todo', 'softwaredev', 'learning', 'smart_goal'],
  },
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Quick calculations linked to boards',
    icon: Calculator,
    category: 'general',
    color: '#10B981',
    environments: ['blank', 'todo', 'softwaredev', 'learning', 'smart_goal'],
  },
  
  // Brainstorming Tools
  {
    id: 'mind-map',
    name: 'Mind Map',
    description: 'Visualize ideas and connections',
    icon: Brain,
    category: 'brainstorm',
    color: '#8B5CF6',
    environments: ['blank', 'todo', 'softwaredev', 'learning', 'smart_goal'],
  },
  {
    id: 'idea-generator',
    name: 'Idea Generator',
    description: 'AI-powered idea suggestions',
    icon: Lightbulb,
    category: 'brainstorm',
    color: '#F59E0B',
    environments: ['blank', 'todo', 'softwaredev', 'learning', 'smart_goal'],
  },
  {
    id: 'quick-notes',
    name: 'Quick Notes',
    description: 'Capture thoughts instantly',
    icon: StickyNote,
    category: 'brainstorm',
    color: '#EC4899',
    environments: ['blank', 'todo', 'softwaredev', 'learning', 'smart_goal'],
  },
  {
    id: 'whiteboard',
    name: 'Whiteboard',
    description: 'Free-form drawing and sketching',
    icon: Palette,
    category: 'brainstorm',
    color: '#06B6D4',
    environments: ['blank', 'softwaredev', 'learning', 'smart_goal'],
  },
  {
    id: 'inspiration',
    name: 'Inspiration',
    description: 'Random prompts and quotes',
    icon: Zap,
    category: 'brainstorm',
    color: '#F97316',
    environments: ['blank', 'learning', 'smart_goal'],
  },
  
  // To-Do Specific Tools
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    description: 'Focus timer for productivity',
    icon: Timer,
    category: 'productivity',
    color: '#EF4444',
    environments: ['blank', 'todo'],
  },
  {
    id: 'priority-matrix',
    name: 'Priority Matrix',
    description: 'Eisenhower matrix for tasks',
    icon: Target,
    category: 'productivity',
    color: '#6366F1',
    environments: ['blank', 'todo'],
  },
  {
    id: 'daily-planner',
    name: 'Daily Planner',
    description: 'Plan your day effectively',
    icon: ListTodo,
    category: 'productivity',
    color: '#22C55E',
    environments: ['blank', 'todo'],
  },
  
  // Software Dev Specific Tools
  {
    id: 'code-snippets',
    name: 'Code Snippets',
    description: 'Save and reuse code blocks',
    icon: Code,
    category: 'development',
    color: '#3B82F6',
    environments: ['blank', 'softwaredev'],
  },
  {
    id: 'git-helper',
    name: 'Git Helper',
    description: 'Quick git commands reference',
    icon: GitBranch,
    category: 'development',
    color: '#F97316',
    environments: ['blank', 'softwaredev'],
  },
  {
    id: 'bug-tracker',
    name: 'Bug Tracker',
    description: 'Track and manage bugs',
    icon: Bug,
    category: 'development',
    color: '#EF4444',
    environments: ['blank', 'softwaredev'],
  },
  
  // Learning Specific Tools
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Create study flashcards',
    icon: BookOpen,
    category: 'learning',
    color: '#8B5CF6',
    environments: ['blank', 'learning'],
  },
  {
    id: 'presentation',
    name: 'Presentations',
    description: 'Create quick presentations',
    icon: Presentation,
    category: 'learning',
    color: '#F59E0B',
    environments: ['blank', 'learning'],
  },
  {
    id: 'study-planner',
    name: 'Study Planner',
    description: 'Plan your learning schedule',
    icon: GraduationCap,
    category: 'learning',
    color: '#10B981',
    environments: ['blank', 'learning'],
  },
];

export const getToolsForEnvironment = (templateType: BoardTemplateType): BoardTool[] => {
  return boardTools.filter(tool => tool.environments.includes(templateType));
};

export const getToolById = (id: string): BoardTool | undefined => {
  return boardTools.find(tool => tool.id === id);
};

export const getToolsByCategory = (category: BoardTool['category']): BoardTool[] => {
  return boardTools.filter(tool => tool.category === category);
};