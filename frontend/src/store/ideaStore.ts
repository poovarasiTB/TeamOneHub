import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface Idea {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  category?: string;
  submitterId: string;
  submitterName?: string;
  status: 'submitted' | 'under-review' | 'approved' | 'in-progress' | 'implemented' | 'rejected';
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  impactScore?: number;
  implementedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface IdeaState {
  ideas: Idea[];
  currentIdea: Idea | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  userVotes: Map<string, 'up' | 'down'>;

  fetchIdeas: (filters?: any) => Promise<void>;
  fetchIdea: (id: string) => Promise<void>;
  createIdea: (data: Partial<Idea>) => Promise<void>;
  updateIdea: (id: string, data: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  upvote: (id: string) => Promise<void>;
  downvote: (id: string) => Promise<void>;
  removeVote: (id: string) => Promise<void>;
  clearCurrentIdea: () => void;
  clearError: () => void;
}

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  currentIdea: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  userVotes: new Map(),

  fetchIdeas: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/growth/ideas', { params: filters });
      const { data, pagination } = response.data;
      set({ ideas: data, pagination, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch ideas', isLoading: false });
    }
  },

  fetchIdea: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/growth/ideas/${id}`);
      set({ currentIdea: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch idea', isLoading: false });
    }
  },

  createIdea: async (data: Partial<Idea>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/growth/ideas', data);
      const newIdea = response.data;
      set((state) => ({
        ideas: [newIdea, ...state.ideas],
        currentIdea: newIdea,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create idea', isLoading: false });
      throw error;
    }
  },

  updateIdea: async (id: string, data: Partial<Idea>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/growth/ideas/${id}`, data);
      const updatedIdea = response.data;
      set((state) => ({
        ideas: state.ideas.map((i) => (i.id === id ? updatedIdea : i)),
        currentIdea: updatedIdea,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update idea', isLoading: false });
      throw error;
    }
  },

  deleteIdea: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/growth/ideas/${id}`);
      set((state) => ({
        ideas: state.ideas.filter((i) => i.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete idea', isLoading: false });
      throw error;
    }
  },

  upvote: async (id: string) => {
    try {
      const response = await apiClient.post(`/growth/ideas/${id}/upvote`);
      const updatedIdea = response.data;
      set((state) => ({
        ideas: state.ideas.map((i) => (i.id === id ? updatedIdea : i)),
        currentIdea: state.currentIdea?.id === id ? updatedIdea : state.currentIdea,
        userVotes: new Map(state.userVotes).set(id, 'up'),
      }));
    } catch (error: any) {
      console.error('Failed to upvote:', error);
    }
  },

  downvote: async (id: string) => {
    try {
      const response = await apiClient.post(`/growth/ideas/${id}/downvote`);
      const updatedIdea = response.data;
      set((state) => ({
        ideas: state.ideas.map((i) => (i.id === id ? updatedIdea : i)),
        currentIdea: state.currentIdea?.id === id ? updatedIdea : state.currentIdea,
        userVotes: new Map(state.userVotes).set(id, 'down'),
      }));
    } catch (error: any) {
      console.error('Failed to downvote:', error);
    }
  },

  removeVote: async (id: string) => {
    try {
      const response = await apiClient.delete(`/growth/ideas/${id}/vote`);
      const updatedIdea = response.data;
      set((state) => {
        const newVotes = new Map(state.userVotes);
        newVotes.delete(id);
        return {
          ideas: state.ideas.map((i) => (i.id === id ? updatedIdea : i)),
          currentIdea: state.currentIdea?.id === id ? updatedIdea : state.currentIdea,
          userVotes: newVotes,
        };
      });
    } catch (error: any) {
      console.error('Failed to remove vote:', error);
    }
  },

  clearCurrentIdea: () => set({ currentIdea: null }),
  clearError: () => set({ error: null }),
}));
