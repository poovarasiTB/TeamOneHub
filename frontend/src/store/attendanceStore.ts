import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface AttendanceRecord {
    id: string;
    tenantId: string;
    employeeId: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: 'present' | 'absent' | 'late' | 'half-day' | 'work-from-home';
    workHours?: number;
    location?: string;
    ipAddress?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface AttendanceStats {
    present: number;
    absent: number;
    late: number;
    workFromHome: number;
    totalHours: number;
}

interface AttendanceState {
    records: AttendanceRecord[];
    currentRecord: AttendanceRecord | null;
    stats: AttendanceStats | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };

    fetchAttendance: (filters?: any) => Promise<void>;
    markAttendance: (data: Partial<AttendanceRecord>) => Promise<void>;
    fetchMonthlyStats: (employeeId: string, year: number, month: number) => Promise<void>;
    clearError: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
    records: [],
    currentRecord: null,
    stats: null,
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    },

    fetchAttendance: async (filters?: any) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/people/attendance', { params: filters });
            const { data, pagination } = response.data;
            set({
                records: data,
                pagination,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch attendance records',
                isLoading: false,
            });
        }
    },

    markAttendance: async (data: Partial<AttendanceRecord>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/people/attendance/mark', data);
            const newRecord = response.data;

            set((state) => {
                // Update existing record or add new
                const existingIndex = state.records.findIndex(
                    (r) => r.date === newRecord.date && r.employeeId === newRecord.employeeId
                );

                const updatedRecords = [...state.records];
                if (existingIndex >= 0) {
                    updatedRecords[existingIndex] = newRecord;
                } else {
                    updatedRecords.unshift(newRecord);
                }

                return {
                    records: updatedRecords,
                    currentRecord: newRecord,
                    isLoading: false,
                };
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to mark attendance',
                isLoading: false,
            });
            throw error;
        }
    },

    fetchMonthlyStats: async (employeeId: string, year: number, month: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/people/attendance/monthly-stats', {
                params: { employeeId, year, month }
            });
            set({
                stats: response.data,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch monthly stats',
                isLoading: false,
            });
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
