import { create } from 'zustand';
import apiClient from '../lib/api';

export interface Task {
  id: string;
  tenantId: string;
  projectId: string;
  parentTaskId?: string;
  code: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  assigneeName?: string;
  reporterId?: string;
  reporterName?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  completedAt?: string;
  tags?: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchTasks: (projectId?: string, filters?: any) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;
  clearCurrentTask: () => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  fetchTasks: async (projectId?: string, filters?: any) => {
    set({ isLoading: true, error: null });

    try {
      const params = { ...filters, projectId };
      const response = await apiClient.get('/work/tasks', { params });
      const { data, pagination } = response.data;

      set({
        tasks: data,
        pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch tasks',
        isLoading: false,
      });
    }
  },

  fetchTask: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.get(`/work/tasks/${id}`);
      set({
        currentTask: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch task',
        isLoading: false,
      });
    }
  },

  createTask: async (data: Partial<Task>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.post('/work/tasks', data);
      const newTask = response.data;

      set((state) => ({
        tasks: [newTask, ...state.tasks],
        currentTask: newTask,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create task',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.patch(`/work/tasks/${id}`, data);
      const updatedTask = response.data;

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        currentTask: updatedTask,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update task',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await apiClient.delete(`/work/tasks/${id}`);

      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        currentTask: state.currentTask?.id === id ? null : state.currentTask,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete task',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTaskStatus: async (id: string, status: Task['status']) => {
    try {
      await apiClient.patch(`/work/tasks/${id}`, { status });
      
      set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
        ),
        currentTask: state.currentTask?.id === id 
          ? { ...state.currentTask, status, updatedAt: new Date().toISOString() }
          : state.currentTask,
      }));
    } catch (error: any) {
      console.error('Failed to update task status:', error);
    }
  },

  clearCurrentTask: () => {
    set({ currentTask: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
