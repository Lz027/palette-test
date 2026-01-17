export interface Board {
  id: string;
  name: string;
  lastOpenedAt: string;
  pinned: boolean;
  archived: boolean;
  createdAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  name: string;
  position: number;
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
