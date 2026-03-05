import { create } from 'zustand';
import apiClient from '../lib/api';

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role?: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  avatarUrl?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchUsers: (filters?: any) => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  createUser: (data: Partial<User>) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  suspendUser: (id: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  clearCurrentUser: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  fetchUsers: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/auth/users', { params: filters });
      const { data, pagination } = response.data;
      set({ users: data, pagination, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch users', isLoading: false });
    }
  },

  fetchUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/auth/users/${id}`);
      set({ currentUser: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch user', isLoading: false });
    }
  },

  createUser: async (data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/users', data);
      const newUser = response.data;
      set((state) => ({
        users: [newUser, ...state.users],
        currentUser: newUser,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create user', isLoading: false });
      throw error;
    }
  },

  updateUser: async (id: string, data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/auth/users/${id}`, data);
      const updatedUser = response.data;
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        currentUser: updatedUser,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update user', isLoading: false });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/auth/users/${id}`);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete user', isLoading: false });
      throw error;
    }
  },

  suspendUser: async (id: string) => {
    try {
      const response = await apiClient.post(`/auth/users/${id}/suspend`);
      const updatedUser = response.data;
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        currentUser: updatedUser,
      }));
    } catch (error: any) {
      console.error('Failed to suspend user:', error);
    }
  },

  activateUser: async (id: string) => {
    try {
      const response = await apiClient.post(`/auth/users/${id}/activate`);
      const updatedUser = response.data;
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        currentUser: updatedUser,
      }));
    } catch (error: any) {
      console.error('Failed to activate user:', error);
    }
  },

  clearCurrentUser: () => set({ currentUser: null }),
  clearError: () => set({ error: null }),
}));
