import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type?: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  startDate?: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  targetAudience?: any;
  metrics?: any;
  createdAt: string;
  updatedAt: string;
}

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchCampaigns: (filters?: any) => Promise<void>;
  fetchCampaign: (id: string) => Promise<void>;
  createCampaign: (data: Partial<Campaign>) => Promise<void>;
  updateCampaign: (id: string, data: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  clearCurrentCampaign: () => void;
  clearError: () => void;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  currentCampaign: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  fetchCampaigns: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/growth/campaigns', { params: filters });
      const { data, pagination } = response.data;
      set({ campaigns: data, pagination, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch campaigns', isLoading: false });
    }
  },

  fetchCampaign: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/growth/campaigns/${id}`);
      set({ currentCampaign: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch campaign', isLoading: false });
    }
  },

  createCampaign: async (data: Partial<Campaign>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/growth/campaigns', data);
      const newCampaign = response.data;
      set((state) => ({
        campaigns: [newCampaign, ...state.campaigns],
        currentCampaign: newCampaign,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create campaign', isLoading: false });
      throw error;
    }
  },

  updateCampaign: async (id: string, data: Partial<Campaign>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/growth/campaigns/${id}`, data);
      const updatedCampaign = response.data;
      set((state) => ({
        campaigns: state.campaigns.map((c) => (c.id === id ? updatedCampaign : c)),
        currentCampaign: updatedCampaign,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update campaign', isLoading: false });
      throw error;
    }
  },

  deleteCampaign: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/growth/campaigns/${id}`);
      set((state) => ({
        campaigns: state.campaigns.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete campaign', isLoading: false });
      throw error;
    }
  },

  clearCurrentCampaign: () => set({ currentCampaign: null }),
  clearError: () => set({ error: null }),
}));
