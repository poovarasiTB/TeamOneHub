import { create } from 'zustand';
import apiClient from '../lib/api';

export interface WikiArticle {
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

export interface WikiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

interface WikiState {
  articles: WikiArticle[];
  categories: WikiCategory[];
  currentArticle: WikiArticle | null;
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
  createArticle: (data: Partial<WikiArticle>) => Promise<void>;
  updateArticle: (id: string, data: Partial<WikiArticle>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  publishArticle: (id: string) => Promise<void>;
  clearCurrentArticle: () => void;
  clearError: () => void;
}

export const useWikiStore = create<WikiState>((set, get) => ({
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
      const response = await apiClient.get('/growth/wiki', { params: filters });
      const { data, pagination } = response.data;
      set({ articles: data, pagination, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch articles', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await apiClient.get('/growth/wiki/categories');
      set({ categories: response.data });
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchArticle: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/growth/wiki/${id}`);
      set({ currentArticle: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch article', isLoading: false });
    }
  },

  createArticle: async (data: Partial<WikiArticle>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/growth/wiki', data);
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

  updateArticle: async (id: string, data: Partial<WikiArticle>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/growth/wiki/${id}`, data);
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
      await apiClient.delete(`/growth/wiki/${id}`);
      set((state) => ({
        articles: state.articles.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete article', isLoading: false });
      throw error;
    }
  },

  publishArticle: async (id: string) => {
    try {
      const response = await apiClient.post(`/growth/wiki/${id}/publish`);
      const updatedArticle = response.data;
      set((state) => ({
        articles: state.articles.map((a) => (a.id === id ? updatedArticle : a)),
        currentArticle: updatedArticle,
      }));
    } catch (error: any) {
      console.error('Failed to publish article:', error);
    }
  },

  clearCurrentArticle: () => set({ currentArticle: null }),
  clearError: () => set({ error: null }),
}));
