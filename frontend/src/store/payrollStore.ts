import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface PayrollRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName?: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  grossPay: number;
  netPay: number;
  deductions: {
    tax: number;
    insurance: number;
    retirement: number;
    other: number;
  };
  allowances: {
    housing: number;
    transport: number;
    other: number;
  };
  status: 'draft' | 'approved' | 'paid';
  paymentMethod?: string;
  bankAccount?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PayrollState {
  records: PayrollRecord[];
  currentRecord: PayrollRecord | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    totalGrossPay: number;
    totalNetPay: number;
    totalDeductions: number;
  };

  fetchPayroll: (filters?: any) => Promise<void>;
  fetchPayrollRecord: (id: string) => Promise<void>;
  generatePayroll: (data: Partial<PayrollRecord>) => Promise<void>;
  approvePayroll: (id: string) => Promise<void>;
  markPaid: (id: string) => Promise<void>;
  clearCurrentRecord: () => void;
  clearError: () => void;
}

export const usePayrollStore = create<PayrollState>((set, get) => ({
  records: [],
  currentRecord: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  stats: {
    totalGrossPay: 0,
    totalNetPay: 0,
    totalDeductions: 0,
  },

  fetchPayroll: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/people/payroll', { params: filters });
      const { data, pagination } = response.data;
      set({ records: data, pagination, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch payroll', isLoading: false });
    }
  },

  fetchPayrollRecord: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/people/payroll/${id}`);
      set({ currentRecord: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch payroll record', isLoading: false });
    }
  },

  generatePayroll: async (data: Partial<PayrollRecord>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/people/payroll/generate', data);
      const newRecord = response.data;
      set((state) => ({
        records: [newRecord, ...state.records],
        currentRecord: newRecord,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to generate payroll', isLoading: false });
      throw error;
    }
  },

  approvePayroll: async (id: string) => {
    try {
      const response = await apiClient.post(`/people/payroll/${id}/process`);
      const updatedRecord = response.data;
      set((state) => ({
        records: state.records.map((r) => (r.id === id ? updatedRecord : r)),
        currentRecord: updatedRecord,
      }));
    } catch (error: any) {
      console.error('Failed to approve payroll:', error);
    }
  },

  markPaid: async (id: string) => {
    try {
      const response = await apiClient.post(`/people/payroll/${id}/pay`);
      const updatedRecord = response.data;
      set((state) => ({
        records: state.records.map((r) => (r.id === id ? updatedRecord : r)),
        currentRecord: updatedRecord,
      }));
    } catch (error: any) {
      console.error('Failed to mark payroll as paid:', error);
    }
  },

  clearCurrentRecord: () => set({ currentRecord: null }),
  clearError: () => set({ error: null }),
}));
