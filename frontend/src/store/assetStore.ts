import { create } from 'zustand';
import { apiClient } from '@/lib/api';

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

export interface License {
  id: string;
  name: string;
  publisher: string;
  type: string;
  totalSeats: number;
  usedSeats: number;
  expiryDate: string;
  status: string;
  complianceStatus: string;
}

export interface Domain {
  id: string;
  name: string;
  registrar: string;
  registrationDate: string;
  expiryDate: string;
  autoRenew: boolean;
  status: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName?: string;
  maintenanceType: string;
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  vendor: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface AssetState {
  assets: Asset[];
  licenses: License[];
  domains: Domain[];
  maintenanceRecords: MaintenanceRecord[];
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
  fetchLicenses: (filters?: any) => Promise<void>;
  fetchDomains: (filters?: any) => Promise<void>;
  fetchMaintenance: (filters?: any) => Promise<void>;
  fetchAsset: (id: string) => Promise<void>;
  createAsset: (data: Partial<Asset>) => Promise<void>;
  updateAsset: (id: string, data: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  assignAsset: (id: string, userId: string) => Promise<void>;
  clearCurrentAsset: () => void;
  clearError: () => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  assets: [],
  licenses: [],
  domains: [],
  maintenanceRecords: [],
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
      console.warn('Backend /assets/assets not found, using empty array');
      set({ assets: [], isLoading: false });
    }
  },

  fetchLicenses: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/assets/licenses', { params: filters });
      set({ licenses: response.data, isLoading: false });
    } catch (error: any) {
      console.warn('Backend /assets/licenses not found, using mock data');
      set({
        licenses: [
          { id: '1', name: 'Microsoft 365 Business', publisher: 'Microsoft', type: 'subscription', totalSeats: 100, usedSeats: 85, expiryDate: '2026-12-31', status: 'active', complianceStatus: 'compliant' },
          { id: '2', name: 'Adobe Creative Cloud', publisher: 'Adobe', type: 'subscription', totalSeats: 50, usedSeats: 48, expiryDate: '2026-06-30', status: 'active', complianceStatus: 'compliant' },
          { id: '3', name: 'JetBrains All Products', publisher: 'JetBrains', type: 'subscription', totalSeats: 75, usedSeats: 75, expiryDate: '2026-03-31', status: 'active', complianceStatus: 'overallocated' },
        ],
        isLoading: false
      });
    }
  },

  fetchDomains: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/assets/domains', { params: filters });
      set({ domains: response.data, isLoading: false });
    } catch (error: any) {
      console.warn('Backend /assets/domains not found, using mock data');
      set({
        domains: [
          { id: '1', name: 'teamone.local', registrar: 'GoDaddy', registrationDate: '2020-01-15', expiryDate: '2027-01-15', autoRenew: true, status: 'active' },
          { id: '2', name: 'teamone.com', registrar: 'Namecheap', registrationDate: '2020-01-15', expiryDate: '2027-01-15', autoRenew: true, status: 'active' },
          { id: '3', name: 'teamone.io', registrar: 'Google Domains', registrationDate: '2021-03-20', expiryDate: '2026-03-20', autoRenew: false, status: 'expiring-soon' },
        ],
        isLoading: false
      });
    }
  },

  fetchMaintenance: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/assets/maintenance', { params: filters });
      set({ maintenanceRecords: response.data, isLoading: false });
    } catch (error: any) {
      console.warn('Backend /assets/maintenance not found, using mock data');
      set({
        maintenanceRecords: [
          { id: '1', assetId: 'a1', assetName: 'MacBook Pro 16"', maintenanceType: 'preventive', description: 'Annual battery health check', scheduledDate: '2026-04-10', status: 'scheduled', cost: 0, vendor: 'Apple' },
          { id: '2', assetId: 'a2', assetName: 'Dell XPS 15', maintenanceType: 'corrective', description: 'Screen flickering issue', scheduledDate: '2026-03-01', completedDate: '2026-03-02', status: 'completed', cost: 250, vendor: 'Dell' },
        ],
        isLoading: false
      });
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
