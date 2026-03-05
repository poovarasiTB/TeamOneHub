import { create } from 'zustand';
import apiClient from '../lib/api';

export interface Asset {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: 'hardware' | 'software' | 'cloud' | 'digital';
  category?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'retired';
  assignedTo?: string;
  assignedToName?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  vendor?: string;
  warrantyExpiry?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AssetState {
  assets: Asset[];
  currentAsset: Asset | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchAssets: (filters?: any) => Promise<void>;
  fetchAsset: (id: string) => Promise<void>;
  createAsset: (data: Partial<Asset>) => Promise<void>;
  updateAsset: (id: string, data: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  assignAsset: (id: string, userId: string) => Promise<void>;
  clearCurrentAsset: () => void;
  clearError: () => void;
}

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: [],
  currentAsset: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  fetchAssets: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/assets/assets', { params: filters });
      const { data, pagination } = response.data;
      set({ assets: data, pagination, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch assets', isLoading: false });
    }
  },

  fetchAsset: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/assets/assets/${id}`);
      set({ currentAsset: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch asset', isLoading: false });
    }
  },

  createAsset: async (data: Partial<Asset>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/assets/assets', data);
      const newAsset = response.data;
      set((state) => ({
        assets: [newAsset, ...state.assets],
        currentAsset: newAsset,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create asset', isLoading: false });
      throw error;
    }
  },

  updateAsset: async (id: string, data: Partial<Asset>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/assets/assets/${id}`, data);
      const updatedAsset = response.data;
      set((state) => ({
        assets: state.assets.map((a) => (a.id === id ? updatedAsset : a)),
        currentAsset: updatedAsset,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update asset', isLoading: false });
      throw error;
    }
  },

  deleteAsset: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/assets/assets/${id}`);
      set((state) => ({
        assets: state.assets.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete asset', isLoading: false });
      throw error;
    }
  },

  assignAsset: async (id: string, userId: string) => {
    try {
      const response = await apiClient.post(`/assets/assets/${id}/assign`, { userId });
      const updatedAsset = response.data;
      set((state) => ({
        assets: state.assets.map((a) => (a.id === id ? updatedAsset : a)),
        currentAsset: updatedAsset,
      }));
    } catch (error: any) {
      console.error('Failed to assign asset:', error);
    }
  },

  clearCurrentAsset: () => set({ currentAsset: null }),
  clearError: () => set({ error: null }),
}));
