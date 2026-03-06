import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface KnowledgeArticle {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  categoryId?: string;
  categoryName?: string;
  tags: string[];
  authorId: string;
  authorName?: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'internal' | 'restricted';
  views: number;
  likes: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KBCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

interface KnowledgeState {
  articles: KnowledgeArticle[];
  categories: KBCategory[];
  currentArticle: KnowledgeArticle | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchArticles: (filters?: any) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchArticle: (id: string) => Promise<void>;
  createArticle: (data: Partial<KnowledgeArticle>) => Promise<void>;
  updateArticle: (id: string, data: Partial<KnowledgeArticle>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  addFeedback: (id: string, rating: 'helpful' | 'not-helpful', comment?: string) => Promise<void>;
  clearCurrentArticle: () => void;
  clearError: () => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  articles: [],
  categories: [],
  currentArticle: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  fetchArticles: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/support/kb', { params: filters });
      const { data, pagination } = response.data;
      set({ articles: data, pagination, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch articles', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await apiClient.get('/support/kb/categories');
      set({ categories: response.data });
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchArticle: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/support/kb/${id}`);
      set({ currentArticle: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch article', isLoading: false });
    }
  },

  createArticle: async (data: Partial<KnowledgeArticle>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/support/kb', data);
      const newArticle = response.data;
      set((state) => ({
        articles: [newArticle, ...state.articles],
        currentArticle: newArticle,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create article', isLoading: false });
      throw error;
    }
  },

  updateArticle: async (id: string, data: Partial<KnowledgeArticle>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/support/kb/${id}`, data);
      const updatedArticle = response.data;
      set((state) => ({
        articles: state.articles.map((a) => (a.id === id ? updatedArticle : a)),
        currentArticle: updatedArticle,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update article', isLoading: false });
      throw error;
    }
  },

  deleteArticle: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/support/kb/${id}`);
      set((state) => ({
        articles: state.articles.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete article', isLoading: false });
      throw error;
    }
  },

  addFeedback: async (id: string, rating: 'helpful' | 'not-helpful', comment?: string) => {
    try {
      await apiClient.post(`/support/kb/${id}/feedback`, { rating, comment });
      set((state) => ({
        articles: state.articles.map((a) =>
          a.id === id ? { ...a, likes: rating === 'helpful' ? a.likes + 1 : a.likes } : a
        ),
      }));
    } catch (error: any) {
      console.error('Failed to add feedback:', error);
    }
  },

  clearCurrentArticle: () => set({ currentArticle: null }),
  clearError: () => set({ error: null }),
}));
