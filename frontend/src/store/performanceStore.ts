import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface PerformanceReview {
    id: string;
    tenantId: string;
    employeeId: string;
    employeeName?: string;
    reviewerId: string;
    reviewerName?: string;
    periodStart: string;
    periodEnd: string;
    rating?: number;
    strengths?: string;
    weaknesses?: string;
    goals?: string;
    comments?: string;
    status: 'draft' | 'in-progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}

interface PerformanceState {
    reviews: PerformanceReview[];
    currentReview: PerformanceReview | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };

    fetchReviews: (filters?: any) => Promise<void>;
    fetchReviewById: (id: string) => Promise<void>;
    createReview: (data: Partial<PerformanceReview>) => Promise<void>;
    updateReview: (id: string, data: Partial<PerformanceReview>) => Promise<void>;
    clearCurrentReview: () => void;
    clearError: () => void;
}

export const usePerformanceStore = create<PerformanceState>((set) => ({
    reviews: [],
    currentReview: null,
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    },

    fetchReviews: async (filters?: any) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/people/performance', { params: filters });
            const { data, pagination } = response.data;

            const mappedData = data.map((item: any) => ({
                id: item.id,
                tenantId: item.tenant_id,
                employeeId: item.employee_id,
                employeeName: item.employee_name,
                reviewerId: item.reviewer_id,
                reviewerName: item.reviewer_name,
                periodStart: item.period_start,
                periodEnd: item.period_end,
                rating: item.rating,
                strengths: item.strengths,
                weaknesses: item.weaknesses,
                goals: item.goals,
                comments: item.comments,
                status: item.status,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            }));

            set({ reviews: mappedData, pagination, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch reviews', isLoading: false });
        }
    },

    fetchReviewById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/people/performance/${id}`);
            const item = response.data;
            const mappedReview = {
                id: item.id,
                tenantId: item.tenant_id,
                employeeId: item.employee_id,
                employeeName: item.employee_name,
                reviewerId: item.reviewer_id,
                reviewerName: item.reviewer_name,
                periodStart: item.period_start,
                periodEnd: item.period_end,
                rating: item.rating,
                strengths: item.strengths,
                weaknesses: item.weaknesses,
                goals: item.goals,
                comments: item.comments,
                status: item.status,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            };
            set({ currentReview: mappedReview, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch review', isLoading: false });
        }
    },

    createReview: async (data: Partial<PerformanceReview>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/people/performance', data);
            const newReview = response.data;
            set((state) => ({
                reviews: [newReview, ...state.reviews],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create review', isLoading: false });
            throw error;
        }
    },

    updateReview: async (id: string, data: Partial<PerformanceReview>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.put(`/people/performance/${id}`, data);
            const updatedReview = response.data;
            set((state) => ({
                reviews: state.reviews.map((r) => (r.id === id ? { ...r, ...updatedReview } : r)),
                currentReview: updatedReview,
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update review', isLoading: false });
            throw error;
        }
    },

    clearCurrentReview: () => set({ currentReview: null }),
    clearError: () => set({ error: null }),
}));
