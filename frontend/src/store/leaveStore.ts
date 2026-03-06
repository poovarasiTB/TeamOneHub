import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface LeaveRequest {
    id: string;
    tenantId: string;
    employeeId: string;
    leaveTypeId: string;
    leaveTypeName?: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason?: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    approvedBy?: string;
    approvedAt?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LeaveBalance {
    leaveTypeId: string;
    leaveTypeName: string;
    openingBalance: number;
    allocated: number;
    taken: number;
    closingBalance: number;
}

interface LeaveState {
    requests: LeaveRequest[];
    balances: LeaveBalance[];
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };

    fetchRequests: (filters?: any) => Promise<void>;
    applyLeave: (data: Partial<LeaveRequest>) => Promise<void>;
    approveLeave: (id: string) => Promise<void>;
    rejectLeave: (id: string, reason: string) => Promise<void>;
    fetchBalances: (employeeId: string, year?: number) => Promise<void>;
    clearError: () => void;
}

export const useLeaveStore = create<LeaveState>((set, get) => ({
    requests: [],
    balances: [],
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    },

    fetchRequests: async (filters?: any) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/people/leave', { params: filters });
            const { data, pagination } = response.data;

            // Map snake_case to camelCase if needed (backend seems to return snake_case)
            const mappedData = data.map((item: any) => ({
                id: item.id,
                tenantId: item.tenant_id,
                employeeId: item.employee_id,
                leaveTypeId: item.leave_type_id,
                leaveTypeName: item.leave_type_name,
                startDate: item.start_date,
                endDate: item.end_date,
                totalDays: item.total_days,
                reason: item.reason,
                status: item.status,
                approvedBy: item.approved_by,
                approvedAt: item.approved_at,
                rejectionReason: item.rejection_reason,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            }));

            set({ requests: mappedData, pagination, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch leave requests', isLoading: false });
        }
    },

    applyLeave: async (data: Partial<LeaveRequest>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/people/leave/apply', data);
            const newRequest = response.data;
            set((state) => ({
                requests: [newRequest, ...state.requests],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to apply for leave', isLoading: false });
            throw error;
        }
    },

    approveLeave: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post(`/people/leave/${id}/approve`);
            const updatedRequest = response.data;
            set((state) => ({
                requests: state.requests.map((r) => (r.id === id ? { ...r, ...updatedRequest } : r)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to approve leave', isLoading: false });
        }
    },

    rejectLeave: async (id: string, reason: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post(`/people/leave/${id}/reject`, { reason });
            const updatedRequest = response.data;
            set((state) => ({
                requests: state.requests.map((r) => (r.id === id ? { ...r, ...updatedRequest } : r)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to reject leave', isLoading: false });
        }
    },

    fetchBalances: async (employeeId: string, year?: number) => {
        set({ isLoading: true, error: null });
        try {
            // Note: Backend might need to be called multiple times for different leave types 
            // or a new endpoint to get all balances for an employee.
            // For now, we'll just implement the single balance fetch.
            const response = await apiClient.get('/people/leave/balance', {
                params: { employeeId, year: year || new Date().getFullYear() }
            });
            // This part might need refinement based on how the backend returns all balances
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch leave balances', isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
