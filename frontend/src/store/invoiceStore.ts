import { create } from 'zustand';
import { apiClient } from '@/lib/api';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issuedDate: string;
  paidAt?: string;
  createdAt: string;
  items?: any[];
}

interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchInvoices: (filters?: any) => Promise<void>;
  fetchInvoice: (id: string) => Promise<void>;
  createInvoice: (data: Partial<Invoice>) => Promise<void>;
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  sendInvoice: (id: string) => Promise<void>;
  recordPayment: (id: string, data: any) => Promise<void>;
  clearCurrentInvoice: () => void;
  clearError: () => void;
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  fetchInvoices: async (filters?: any) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.get('/money/invoices', { params: filters });
      const { data, pagination } = response.data;

      set({
        invoices: data,
        pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch invoices',
        isLoading: false,
      });
    }
  },

  fetchInvoice: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.get(`/money/invoices/${id}`);
      set({
        currentInvoice: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch invoice',
        isLoading: false,
      });
    }
  },

  createInvoice: async (data: Partial<Invoice>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.post('/money/invoices', data);
      const newInvoice = response.data;

      set((state) => ({
        invoices: [newInvoice, ...state.invoices],
        currentInvoice: newInvoice,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create invoice',
        isLoading: false,
      });
      throw error;
    }
  },

  updateInvoice: async (id: string, data: Partial<Invoice>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.patch(`/money/invoices/${id}`, data);
      const updatedInvoice = response.data;

      set((state) => ({
        invoices: state.invoices.map((i) => (i.id === id ? updatedInvoice : i)),
        currentInvoice: updatedInvoice,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update invoice',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteInvoice: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await apiClient.delete(`/money/invoices/${id}`);

      set((state) => ({
        invoices: state.invoices.filter((i) => i.id !== id),
        currentInvoice: state.currentInvoice?.id === id ? null : state.currentInvoice,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete invoice',
        isLoading: false,
      });
      throw error;
    }
  },

  sendInvoice: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await apiClient.post(`/money/invoices/${id}/send`);

      set((state) => ({
        invoices: state.invoices.map((i) =>
          i.id === id ? { ...i, status: 'sent' as const } : i
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to send invoice',
        isLoading: false,
      });
      throw error;
    }
  },

  recordPayment: async (id: string, data: any) => {
    set({ isLoading: true, error: null });

    try {
      await apiClient.post(`/money/invoices/${id}/payment`, data);

      set((state) => ({
        invoices: state.invoices.map((i) =>
          i.id === id ? { ...i, status: 'paid' as const } : i
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to record payment',
        isLoading: false,
      });
      throw error;
    }
  },

  clearCurrentInvoice: () => {
    set({ currentInvoice: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
