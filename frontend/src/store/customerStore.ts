import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface Customer {
    id: string;
    tenantId: string;
    type: 'individual' | 'company';
    name: string;
    email?: string;
    phone?: string;
    taxId?: string;
    billingAddress?: string;
    shippingAddress?: string;
    creditLimit?: number;
    paymentTerms?: string;
    status: 'active' | 'inactive';
    revenue?: number;
    invoicesCount?: number;
}

interface CustomerState {
    customers: Customer[];
    currentCustomer: Customer | null;
    isLoading: boolean;
    error: string | null;

    fetchCustomers: (filters?: any) => Promise<void>;
    fetchCustomerById: (id: string) => Promise<void>;
    createCustomer: (data: Partial<Customer>) => Promise<void>;
    updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
    customers: [],
    currentCustomer: null,
    isLoading: false,
    error: null,

    fetchCustomers: async (filters?: any) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/money/customers', { params: filters });
            // Map database snake_case to camelCase
            const mappedData = response.data.map((item: any) => ({
                id: item.id,
                tenantId: item.tenant_id,
                type: item.type,
                name: item.name,
                email: item.email,
                phone: item.phone,
                taxId: item.tax_id,
                billingAddress: item.billing_address,
                shippingAddress: item.shipping_address,
                creditLimit: item.credit_limit,
                paymentTerms: item.payment_terms,
                status: item.status,
                revenue: item.revenue || 0,
                invoicesCount: item.invoices_count || 0
            }));
            set({ customers: mappedData, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch customers', isLoading: false });
        }
    },

    fetchCustomerById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/money/customers/${id}`);
            const item = response.data;
            const mappedCustomer = {
                id: item.id,
                tenantId: item.tenant_id,
                type: item.type,
                name: item.name,
                email: item.email,
                phone: item.phone,
                taxId: item.tax_id,
                billingAddress: item.billing_address,
                shippingAddress: item.shipping_address,
                creditLimit: item.credit_limit,
                paymentTerms: item.payment_terms,
                status: item.status,
            };
            set({ currentCustomer: mappedCustomer, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch customer', isLoading: false });
        }
    },

    createCustomer: async (data: Partial<Customer>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/money/customers', data);
            set((state) => ({
                customers: [response.data, ...state.customers],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create customer', isLoading: false });
            throw error;
        }
    },

    updateCustomer: async (id: string, data: Partial<Customer>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.put(`/money/customers/${id}`, data);
            set((state) => ({
                customers: state.customers.map((c) => (c.id === id ? { ...c, ...response.data } : c)),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update customer', isLoading: false });
            throw error;
        }
    },

    deleteCustomer: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/money/customers/${id}`);
            set((state) => ({
                customers: state.customers.filter((c) => c.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete customer', isLoading: false });
        }
    },
}));
