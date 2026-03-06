import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface Vendor {
    id: string;
    name: string;
    category: string;
    email?: string;
    phone?: string;
    address?: string;
    status: 'active' | 'inactive';
    totalSpent: number;
    lastOrderDate?: string;
    createdAt: string;
}

interface VendorState {
    vendors: Vendor[];
    isLoading: boolean;
    error: string | null;

    fetchVendors: (filters?: any) => Promise<void>;
    createVendor: (data: Partial<Vendor>) => Promise<void>;
    updateVendor: (id: string, data: Partial<Vendor>) => Promise<void>;
    deleteVendor: (id: string) => Promise<void>;
}

export const useVendorStore = create<VendorState>((set) => ({
    vendors: [],
    isLoading: false,
    error: null,

    fetchVendors: async (filters?: any) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/money/vendors', { params: filters });
            set({ vendors: response.data, isLoading: false });
        } catch (error: any) {
            console.warn('Backend /money/vendors not found, using empty array', error);
            set({ vendors: [], isLoading: false });
        }
    },

    createVendor: async (data: Partial<Vendor>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/money/vendors', data);
            set((state) => ({ vendors: [response.data, ...state.vendors], isLoading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create vendor', isLoading: false });
            throw error;
        }
    },

    updateVendor: async (id: string, data: Partial<Vendor>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.patch(`/money/vendors/${id}`, data);
            set((state) => ({
                vendors: state.vendors.map((v) => (v.id === id ? response.data : v)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update vendor', isLoading: false });
            throw error;
        }
    },

    deleteVendor: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/money/vendors/${id}`);
            set((state) => ({ vendors: state.vendors.filter((v) => v.id !== id), isLoading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete vendor', isLoading: false });
        }
    },
}));
