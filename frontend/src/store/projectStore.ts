import { create } from 'zustand';
import apiClient from '../lib/api';

interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  type: 'fixed-price' | 'time-materials' | 'retainer' | 'internal';
  budget?: number;
  currency: string;
  startDate: string;
  endDate?: string;
  healthStatus: 'green' | 'yellow' | 'red';
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  fetchProjects: (filters?: any) => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  clearCurrentProject: () => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  fetchProjects: async (filters?: any) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.get('/work/projects', { params: filters });
      const { data, pagination } = response.data;
      
      set({
        projects: data,
        pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch projects',
        isLoading: false,
      });
    }
  },

  fetchProject: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.get(`/work/projects/${id}`);
      set({
        currentProject: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch project',
        isLoading: false,
      });
    }
  },

  createProject: async (data: Partial<Project>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.post('/work/projects', data);
      const newProject = response.data;
      
      set((state) => ({
        projects: [newProject, ...state.projects],
        currentProject: newProject,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create project',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProject: async (id: string, data: Partial<Project>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.patch(`/work/projects/${id}`, data);
      const updatedProject = response.data;
      
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
        currentProject: updatedProject,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update project',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.delete(`/work/projects/${id}`);
      
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete project',
        isLoading: false,
      });
      throw error;
    }
  },

  clearCurrentProject: () => {
    set({ currentProject: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
