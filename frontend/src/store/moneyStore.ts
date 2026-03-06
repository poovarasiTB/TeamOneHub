import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface Invoice {
    id: string;
    clientName: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue' | 'draft';
    dueDate: string;
    invoiceNumber: string;
}

export interface Bill {
    id: string;
    vendorName: string;
    amount: number;
    status: 'paid' | 'unpaid' | 'overdue';
    dueDate: string;
    category: string;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
}

interface MoneyState {
    invoices: Invoice[];
    bills: Bill[];
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;

    fetchInvoices: () => Promise<void>;
    fetchBills: () => Promise<void>;
    fetchTransactions: () => Promise<void>;

    createInvoice: (data: Partial<Invoice>) => Promise<void>;
}

export const useMoneyStore = create<MoneyState>((set) => ({
    invoices: [],
    bills: [],
    transactions: [],
    isLoading: false,
    error: null,

    fetchInvoices: async () => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get('/money/invoices');
            set({ invoices: response.data, isLoading: false });
        } catch (error) {
            console.warn('Backend /money/invoices not found, using mock data');
            set({
                invoices: [
                    { id: 'inv1', clientName: 'Globex Corp', amount: 4500, status: 'pending', dueDate: '2026-03-15', invoiceNumber: 'INV-2026-001' },
                    { id: 'inv2', clientName: 'Acme Inc', amount: 2800, status: 'paid', dueDate: '2026-02-28', invoiceNumber: 'INV-2026-002' }
                ],
                isLoading: false
            });
        }
    },

    fetchBills: async () => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get('/money/bills');
            set({ bills: response.data, isLoading: false });
        } catch (error) {
            console.warn('Backend /money/bills not found, using mock data');
            set({
                bills: [
                    { id: 'bill1', vendorName: 'AWS', amount: 540.20, status: 'unpaid', dueDate: '2026-03-10', category: 'Cloud Infrastructure' },
                    { id: 'bill2', vendorName: 'Office Rent', amount: 2100, status: 'paid', dueDate: '2026-03-01', category: 'Rent' }
                ],
                isLoading: false
            });
        }
    },

    fetchTransactions: async () => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get('/money/transactions');
            set({ transactions: response.data, isLoading: false });
        } catch (error) {
            console.warn('Backend /money/transactions not found, using mock data');
            set({
                transactions: [
                    { id: 't1', date: '2026-03-04', description: 'Client Payment - Acme', amount: 2800, type: 'income', category: 'Sales' },
                    { id: 't2', date: '2026-03-03', description: 'Office Supplies', amount: -150.45, type: 'expense', category: 'Operations' }
                ],
                isLoading: false
            });
        }
    },

    createInvoice: async (data) => {
        set({ isLoading: true });
        try {
            const response = await apiClient.post('/money/invoices', data);
            set(state => ({ invoices: [...state.invoices, response.data], isLoading: false }));
        } catch (error) {
            set({ error: 'Failed to create invoice', isLoading: false });
        }
    },
}));
