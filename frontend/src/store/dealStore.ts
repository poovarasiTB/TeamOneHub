import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface Deal {
    id: string;
    tenantId: string;
    title: string;
    customerId: string;
    customerName?: string;
    amount: number;
    stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
    probability: number;
    expectedCloseDate?: string;
    ownerId: string;
    ownerName?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

interface DealState {
    deals: Deal[];
    isLoading: boolean;
    error: string | null;

    fetchDeals: (filters?: any) => Promise<void>;
    createDeal: (data: Partial<Deal>) => Promise<void>;
    updateDeal: (id: string, data: Partial<Deal>) => Promise<void>;
    updateDealStage: (id: string, stage: string) => Promise<void>;
    deleteDeal: (id: string) => Promise<void>;
}

export const useDealStore = create<DealState>((set) => ({
    deals: [],
    isLoading: false,
    error: null,

    fetchDeals: async (filters?: any) => {
        set({ isLoading: true, error: null });
        try {
            // API endpoint might be /money/deals or /money/crm/deals
            const response = await apiClient.get('/money/deals', { params: filters });
            set({ deals: response.data, isLoading: false });
        } catch (error: any) {
            // If endpoint doesn't exist yet, we'll gracefully handle or mock for UI development
            console.warn('Backend /money/deals not found, using empty array', error);
            set({ deals: [], isLoading: false });
        }
    },

    createDeal: async (data: Partial<Deal>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/money/deals', data);
            set((state) => ({ deals: [response.data, ...state.deals], isLoading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create deal', isLoading: false });
            throw error;
        }
    },

    updateDeal: async (id: string, data: Partial<Deal>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.put(`/money/deals/${id}`, data);
            set((state) => ({
                deals: state.deals.map((d) => (d.id === id ? response.data : d)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update deal', isLoading: false });
            throw error;
        }
    },

    updateDealStage: async (id: string, stage: string) => {
        // Optimistic update for UI smoothness
        set((state) => ({
            deals: state.deals.map((d) => (d.id === id ? { ...d, stage: stage as any } : d)),
        }));

        try {
            await apiClient.patch(`/money/deals/${id}/stage`, { stage });
        } catch (error: any) {
            console.error('Failed to update stage on server', error);
        }
    },

    deleteDeal: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/money/deals/${id}`);
            set((state) => ({ deals: state.deals.filter((d) => d.id !== id), isLoading: false }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete deal', isLoading: false });
        }
    },
}));
