import { useState, useEffect, useCallback } from 'react';
import { Board, Column, Task, UserSettings, PaletteState } from '@/types/palette';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const STORAGE_KEY = 'palette_data';

const defaultSettings: UserSettings = {
  openaiKey: '',
  claudeKey: '',
  geminiKey: '',
  aiEnabled: false,
  supabaseUrl: '',
  supabaseAnonKey: '',
};

const initialState: PaletteState = {
  boards: [],
  columns: [],
  tasks: [],
  settings: defaultSettings,
};

const loadFromStorage = (): PaletteState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return initialState;
};

const saveToStorage = (state: PaletteState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const usePaletteStore = () => {
  const [state, setState] = useState<PaletteState>(loadFromStorage);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // Board operations
  const createBoard = useCallback((name: string, templateType: 'blank' | 'kanban' | 'crm' = 'blank'): Board => {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      name,
      lastOpenedAt: new Date().toISOString(),
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString(),
      templateType,
      color: '#FF9AA2', // Default to Pastel Red
      icon: templateType === 'kanban' ? 'kanban' : templateType === 'crm' ? 'users' : 'layout-grid',
    };

    let defaultColumns: Column[] = [];
    
    if (templateType === 'kanban') {
      defaultColumns = [
        { id: crypto.randomUUID(), boardId: newBoard.id, name: 'To Do', position: 0, type: 'status' },
        { id: crypto.randomUUID(), boardId: newBoard.id, name: 'In Progress', position: 1, type: 'status' },
        { id: crypto.randomUUID(), boardId: newBoard.id, name: 'Done', position: 2, type: 'status' },
      ];
    } else if (templateType === 'crm') {
      defaultColumns = [
        { id: crypto.randomUUID(), boardId: newBoard.id, name: 'Contact', position: 0, type: 'text' },
        { id: crypto.randomUUID(), boardId: newBoard.id, name: 'Company', position: 1, type: 'text' },
        { id: crypto.randomUUID(), boardId: newBoard.id, name: 'Email', position: 2, type: 'link' },
        { 
          id: crypto.randomUUID(), 
          boardId: newBoard.id, 
          name: 'Status', 
          position: 3, 
          type: 'select',
          settings: { options: ['Lead', 'Prospect', 'Customer'] }
        },
      ];
    } else {
      defaultColumns = [
        { id: crypto.randomUUID(), boardId: newBoard.id, name: 'Title', position: 0, type: 'text' },
      ];
    }

    setState(prev => ({
      ...prev,
      boards: [...prev.boards, newBoard],
      columns: [...prev.columns, ...defaultColumns],
    }));

    return newBoard;
  }, []);

  const updateBoard = useCallback((id: string, updates: Partial<Board>) => {
    setState(prev => ({
      ...prev,
      boards: prev.boards.map(b => (b.id === id ? { ...b, ...updates } : b)),
    }));
  }, []);

  const deleteBoard = useCallback((id: string) => {
    setState(prev => {
      const columnIds = prev.columns.filter(c => c.boardId === id).map(c => c.id);
      return {
        ...prev,
        boards: prev.boards.filter(b => b.id !== id),
        columns: prev.columns.filter(c => c.boardId !== id),
        tasks: prev.tasks.filter(t => !columnIds.includes(t.columnId)),
      };
    });
  }, []);

  const openBoard = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      boards: prev.boards.map(b =>
        b.id === id ? { ...b, lastOpenedAt: new Date().toISOString() } : b
      ),
    }));
  }, []);

  const togglePinBoard = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      boards: prev.boards.map(b => (b.id === id ? { ...b, pinned: !b.pinned } : b)),
    }));
  }, []);

  // Column operations
  const createColumn = useCallback((boardId: string, name: string) => {
    setState(prev => {
      const boardColumns = prev.columns.filter(c => c.boardId === boardId);
      const maxPosition = Math.max(-1, ...boardColumns.map(c => c.position));
      const newColumn: Column = {
        id: crypto.randomUUID(),
        boardId,
        name,
        position: maxPosition + 1,
        type: 'text',
      };
      return { ...prev, columns: [...prev.columns, newColumn] };
    });
  }, []);

  const updateColumn = useCallback((id: string, updates: Partial<Column>) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.map(c => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const deleteColumn = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.filter(c => c.id !== id),
      tasks: prev.tasks.filter(t => t.columnId !== id),
    }));
  }, []);

  // Task operations
  const createTask = useCallback((columnId: string, title: string): Task => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      columnId,
      title,
      description: '',
      dueDate: null,
      tags: [],
      position: 0,
      createdAt: new Date().toISOString(),
    };

    setState(prev => {
      const columnTasks = prev.tasks.filter(t => t.columnId === columnId);
      const maxPosition = Math.max(-1, ...columnTasks.map(t => t.position));
      newTask.position = maxPosition + 1;
      return { ...prev, tasks: [...prev.tasks, newTask] };
    });

    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));
  }, []);

  const moveTask = useCallback((taskId: string, newColumnId: string, newPosition: number) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === taskId ? { ...t, columnId: newColumnId, position: newPosition } : t
      ),
    }));
  }, []);

  // Settings operations
  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  // Data operations
  const exportData = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const clearAllData = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Computed values
  const getBoardColumns = useCallback(
    (boardId: string) => state.columns.filter(c => c.boardId === boardId).sort((a, b) => a.position - b.position),
    [state.columns]
  );

  const getColumnTasks = useCallback(
    (columnId: string) => state.tasks.filter(t => t.columnId === columnId).sort((a, b) => a.position - b.position),
    [state.tasks]
  );

  const getActiveBoards = useCallback(
    () => state.boards.filter(b => !b.archived).sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? -1 : 1; // Pinned first
      return new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime();
    }),
    [state.boards]
  );

  const getCurrentFocusBoard = useCallback(() => {
    const pinned = state.boards.find(b => b.pinned && !b.archived);
    if (pinned) return pinned;
    const sorted = state.boards
      .filter(b => !b.archived)
      .sort((a, b) => new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime());
    return sorted[0] || null;
  }, [state.boards]);

  const getBoardTaskCount = useCallback(
    (boardId: string) => {
      const columnIds = state.columns.filter(c => c.boardId === boardId).map(c => c.id);
      return state.tasks.filter(t => columnIds.includes(t.columnId)).length;
    },
    [state.columns, state.tasks]
  );

  const getBoardProgress = useCallback(
    (boardId: string) => {
      const columns = state.columns.filter(c => c.boardId === boardId);
      const doneColumn = columns.find(c => c.name.toLowerCase() === 'done');
      
      const columnIds = columns.map(c => c.id);
      const allTasks = state.tasks.filter(t => columnIds.includes(t.columnId));
      
      if (allTasks.length === 0) return 0;
      
      if (!doneColumn) {
        // If no "Done" column, progress is based on tasks in the last column
        const lastColumn = columns.sort((a, b) => b.position - a.position)[0];
        const completedTasks = state.tasks.filter(t => t.columnId === lastColumn.id);
        return Math.round((completedTasks.length / allTasks.length) * 100);
      }
      
      const doneTasks = state.tasks.filter(t => t.columnId === doneColumn.id);
      return Math.round((doneTasks.length / allTasks.length) * 100);
    },
    [state.columns, state.tasks]
  );

  const hasAiKeys = !!(state.settings.openaiKey || state.settings.claudeKey || state.settings.geminiKey);

  const syncToCloud = useCallback(async () => {
    if (!supabase) {
      toast.error('Supabase not configured');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to sync');
        return;
      }

      // Sync logic: In a real app, we'd have a more complex sync strategy.
      // For now, we'll just log that we're ready to sync.
      console.log('Ready to sync state to Supabase for user:', user.id);
      toast.success('Sync feature coming soon!');
    } catch (error) {
      console.error('Cloud sync failed:', error);
      toast.error('Sync failed');
    }
  }, [state]);

  return {
    ...state,
    createBoard,
    updateBoard,
    deleteBoard,
    openBoard,
    togglePinBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    updateSettings,
    exportData,
    clearAllData,
    getBoardColumns,
    getColumnTasks,
    getActiveBoards,
    getCurrentFocusBoard,
    getBoardTaskCount,
    getBoardProgress,
    hasAiKeys,
    syncToCloud,
    isCloudConnected: !!supabase,
  };
};
