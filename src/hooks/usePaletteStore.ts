import { useState, useEffect, useCallback } from 'react';
import { Board, Group, Column, Task, UserSettings, PaletteState, BoardTemplate } from '@/types/palette';
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
  groups: [],
  columns: [],
  tasks: [],
  settings: defaultSettings,
};

const loadFromStorage = (): PaletteState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...initialState,
        ...parsed,
        groups: parsed.groups || [],
      };
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
  const createBoard = useCallback((name: string, templateType: BoardTemplate = 'blank', color: string = '#FF9AA2'): Board => {
    const boardId = crypto.randomUUID();
    const newBoard: Board = {
      id: boardId,
      name,
      lastOpenedAt: new Date().toISOString(),
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString(),
      templateType,
      color,
      icon: templateType === 'software' ? 'code' : templateType === 'todo' ? 'check-square' : templateType === 'crm' ? 'users' : templateType === 'smart' ? 'file-text' : 'layout-grid',
    };

    let defaultGroups: Group[] = [];
    let defaultColumns: Column[] = [];
    let defaultTasks: Task[] = [];

    if (templateType === 'todo') {
      const groupId = crypto.randomUUID();
      defaultGroups = [
        { id: groupId, boardId, name: 'My Tasks', color: '#10B981', position: 0 }
      ];
      defaultColumns = [
        { id: crypto.randomUUID(), boardId, name: 'Task', position: 0, type: 'text' },
        { id: crypto.randomUUID(), boardId, name: 'Status', position: 1, type: 'status' },
      ];
    } else if (templateType === 'software') {
      const groupId = crypto.randomUUID();
      defaultGroups = [
        { id: groupId, boardId, name: 'Development', color: '#3B82F6', position: 0 }
      ];
      defaultColumns = [
        { id: crypto.randomUUID(), boardId, name: 'Feature', position: 0, type: 'text' },
        { id: crypto.randomUUID(), boardId, name: 'Dev Tool', position: 1, type: 'dev-tool' },
        { id: crypto.randomUUID(), boardId, name: 'Course Link', position: 2, type: 'youtube-playlist' },
        { id: crypto.randomUUID(), boardId, name: 'Status', position: 3, type: 'status' },
      ];
    } else if (templateType === 'crm') {
      const groupId = crypto.randomUUID();
      defaultGroups = [
        { id: groupId, boardId, name: 'Leads', color: '#6A0DAD', position: 0 }
      ];
      defaultColumns = [
        { id: crypto.randomUUID(), boardId, name: 'Contact', position: 0, type: 'text' },
        { id: crypto.randomUUID(), boardId, name: 'Stage', position: 1, type: 'status' },
        { id: crypto.randomUUID(), boardId, name: 'Value', position: 2, type: 'number' },
        { id: crypto.randomUUID(), boardId, name: 'Last Contact', position: 3, type: 'date' },
      ];
    } else if (templateType === 'smart') {
      const groupId = crypto.randomUUID();
      defaultGroups = [
        { id: groupId, boardId, name: 'Core Framework', color: '#F59E0B', position: 0 }
      ];
      defaultColumns = [
        { id: crypto.randomUUID(), boardId, name: 'Specific (What?)', position: 0, type: 'text' },
        { id: crypto.randomUUID(), boardId, name: 'Measurable (How?)', position: 1, type: 'text' },
        { id: crypto.randomUUID(), boardId, name: 'Achievable (Can?)', position: 2, type: 'checkbox' },
        { id: crypto.randomUUID(), boardId, name: 'Relevant (Why?)', position: 3, type: 'checkbox' },
        { id: crypto.randomUUID(), boardId, name: 'Time-bound (When?)', position: 4, type: 'date' },
      ];
      // Add a template task
      defaultTasks = [
        {
          id: crypto.randomUUID(),
          columnId: '',
          groupId,
          title: 'Specific: What exactly do I want to accomplish?',
          description: 'Define the goal as clearly as possible with no ambiguous language.',
          dueDate: new Date().toISOString(),
          tags: ['SMART'],
          position: 0,
          createdAt: new Date().toISOString(),
          status: 'Planning'
        },
        {
          id: crypto.randomUUID(),
          columnId: '',
          groupId,
          title: 'Measurable: How will I know when it is accomplished?',
          description: 'Establish concrete criteria for measuring progress.',
          dueDate: new Date().toISOString(),
          tags: ['SMART'],
          position: 1,
          createdAt: new Date().toISOString(),
          status: 'Planning'
        }
      ];
    } else {
      // Default Monday-style grouping for blank
      const groupId = crypto.randomUUID();
      defaultGroups = [
        { id: groupId, boardId, name: 'Main Table', color: '#6A0DAD', position: 0 }
      ];
      defaultColumns = [
        { id: crypto.randomUUID(), boardId, name: 'Status', position: 0, type: 'status' },
        { id: crypto.randomUUID(), boardId, name: 'Due Date', position: 1, type: 'date' },
      ];
    }

    setState(prev => ({
      ...prev,
      boards: [...prev.boards, newBoard],
      groups: [...prev.groups, ...defaultGroups],
      columns: [...prev.columns, ...defaultColumns],
      tasks: [...prev.tasks, ...defaultTasks],
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
    setState(prev => ({
      ...prev,
      boards: prev.boards.filter(b => b.id !== id),
      groups: prev.groups.filter(g => g.boardId !== id),
      columns: prev.columns.filter(c => c.boardId !== id),
      tasks: prev.tasks.filter(t => {
        const group = prev.groups.find(g => g.id === t.groupId);
        return group ? group.boardId !== id : true;
      }),
    }));
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

  // Group operations
  const createGroup = useCallback((boardId: string, name: string) => {
    const newGroup: Group = {
      id: crypto.randomUUID(),
      boardId,
      name,
      color: '#6A0DAD',
      position: state.groups.filter(g => g.boardId === boardId).length,
    };
    setState(prev => ({ ...prev, groups: [...prev.groups, newGroup] }));
    return newGroup;
  }, [state.groups]);

  const updateGroup = useCallback((id: string, updates: Partial<Group>) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(g => (g.id === id ? { ...g, ...updates } : g)),
    }));
  }, []);

  const deleteGroup = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.filter(g => g.id !== id),
      tasks: prev.tasks.filter(t => t.groupId !== id),
    }));
  }, []);

  // Column operations
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
  const createTask = useCallback((columnId: string, title: string, groupId?: string): Task => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      columnId,
      groupId,
      title,
      description: '',
      dueDate: null,
      tags: [],
      position: 0,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    setState(prev => {
      const siblingTasks = groupId 
        ? prev.tasks.filter(t => t.groupId === groupId)
        : prev.tasks.filter(t => t.columnId === columnId);
      const maxPosition = Math.max(-1, ...siblingTasks.map(t => t.position));
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

  // Computed values
  const getBoardGroups = useCallback(
    (boardId: string) => state.groups.filter(g => g.boardId === boardId).sort((a, b) => a.position - b.position),
    [state.groups]
  );

  const getGroupTasks = useCallback(
    (groupId: string) => state.tasks.filter(t => t.groupId === groupId).sort((a, b) => a.position - b.position),
    [state.tasks]
  );

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
      if (a.pinned !== b.pinned) return b.pinned ? -1 : 1;
      return new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime();
    }),
    [state.boards]
  );

  const getBoardProgress = useCallback(
    (boardId: string) => {
      const boardGroups = state.groups.filter(g => g.boardId === boardId).map(g => g.id);
      const boardTasks = state.tasks.filter(t => t.groupId && boardGroups.includes(t.groupId));
      
      if (boardTasks.length === 0) return 0;
      const doneTasks = boardTasks.filter(t => t.status?.toLowerCase() === 'done' || t.status?.toLowerCase() === 'complete');
      return Math.round((doneTasks.length / boardTasks.length) * 100);
    },
    [state.groups, state.tasks]
  );

  const getBoardTaskCount = useCallback(
    (boardId: string) => {
      const boardGroups = state.groups.filter(g => g.boardId === boardId).map(g => g.id);
      return state.tasks.filter(t => t.groupId && boardGroups.includes(t.groupId)).length;
    },
    [state.groups, state.tasks]
  );

  const getCurrentFocusBoard = useCallback(() => {
    const active = getActiveBoards();
    return active.length > 0 ? active[0] : null;
  }, [getActiveBoards]);

  const hasAiKeys = useCallback(() => {
    return !!(state.settings.openaiKey || state.settings.geminiKey);
  }, [state.settings]);

  // Data management
  const exportData = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const clearAllData = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isCloudConnected = !!(state.settings.supabaseUrl && state.settings.supabaseAnonKey);

  const syncToCloud = useCallback(async () => {
    // Placeholder for cloud sync - would integrate with Supabase
    console.log('Syncing to cloud...');
  }, []);

  return {
    ...state,
    createBoard,
    updateBoard,
    deleteBoard,
    openBoard,
    togglePinBoard,
    createGroup,
    updateGroup,
    deleteGroup,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
    getBoardGroups,
    getGroupTasks,
    getBoardColumns,
    getColumnTasks,
    getActiveBoards,
    getBoardTaskCount,
    getBoardProgress,
    getCurrentFocusBoard,
    hasAiKeys,
    exportData,
    clearAllData,
    isCloudConnected,
    syncToCloud,
    updateSettings: (updates: Partial<UserSettings>) => setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } })),
  };
};
