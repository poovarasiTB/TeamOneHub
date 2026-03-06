import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface Expense {
    id: string;
    tenantId: string;
    employeeId: string;
    employeeName?: string;
    amount: number;
    category: string;
    description?: string;
    expenseDate: string;
    receiptUrl?: string;
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    approvedBy?: string;
    approvedAt?: string;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
}

interface ExpenseState {
    expenses: Expense[];
    isLoading: boolean;
    error: string | null;

    fetchExpenses: (filters?: any) => Promise<void>;
    createExpense: (data: Partial<Expense>) => Promise<void>;
    approveExpense: (id: string) => Promise<void>;
    rejectExpense: (id: string) => Promise<void>;
    payExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
    expenses: [],
    isLoading: false,
    error: null,

    fetchExpenses: async (filters?: any) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/money/expenses', { params: filters });
            const mappedData = response.data.map((item: any) => ({
                id: item.id,
                tenantId: item.tenant_id,
                employeeId: item.employee_id,
                employeeName: item.employee_name,
                amount: parseFloat(item.amount),
                category: item.category,
                description: item.description,
                expenseDate: item.expense_date,
                receiptUrl: item.receipt_url,
                status: item.status,
                approvedBy: item.approved_by,
                approvedAt: item.approved_at,
                paidAt: item.paid_at,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            }));
            set({ expenses: mappedData, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch expenses', isLoading: false });
        }
    },

    createExpense: async (data: Partial<Expense>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/money/expenses', data);
            set((state) => ({
                expenses: [response.data, ...state.expenses],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create expense', isLoading: false });
            throw error;
        }
    },

    approveExpense: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post(`/money/expenses/${id}/approve`);
            set((state) => ({
                expenses: state.expenses.map((e) => (e.id === id ? { ...e, status: 'approved' } : e)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to approve expense', isLoading: false });
        }
    },

    rejectExpense: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post(`/money/expenses/${id}/reject`);
            set((state) => ({
                expenses: state.expenses.map((e) => (e.id === id ? { ...e, status: 'rejected' } : e)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to reject expense', isLoading: false });
        }
    },

    payExpense: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post(`/money/expenses/${id}/pay`);
            set((state) => ({
                expenses: state.expenses.map((e) => (e.id === id ? { ...e, status: 'paid' } : e)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to pay expense', isLoading: false });
        }
    },
}));
