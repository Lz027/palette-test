export interface Board {
  id: string;
  name: string;
  lastOpenedAt: string;
  pinned: boolean;
  archived: boolean;
  createdAt: string;
  templateType: 'blank' | 'kanban' | 'crm';
  color: string;
  icon: string;
  description?: string;
}

export type ColumnType = 'text' | 'checkbox' | 'file' | 'link' | 'date' | 'tags' | 'number' | 'select' | 'status';

export interface Column {
  id: string;
  boardId: string;
  name: string;
  position: number;
  type: ColumnType;
  settings?: Record<string, any>;
  formula?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description: string;
  dueDate: string | null;
  tags: string[];
  position: number;
  createdAt: string;
  data?: Record<string, any>;
}

export interface UserSettings {
  openaiKey: string;
  claudeKey: string;
  geminiKey: string;
  aiEnabled: boolean;
}

export interface PaletteState {
  boards: Board[];
  columns: Column[];
  tasks: Task[];
  settings: UserSettings;
}
