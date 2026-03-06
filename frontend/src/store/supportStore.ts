import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface Ticket {
    id: string;
    ticketId: string; // Friendly ID e.g. TICKET-101
    subject: string;
    description: string;
    status: 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    requesterId: string;
    requesterName: string;
    assigneeId?: string;
    assigneeName?: string;
    slaDeadline: string;
    createdAt: string;
    updatedAt: string;
}

export interface KnowledgeArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    authorId: string;
    authorName: string;
    status: 'draft' | 'published';
    views: number;
    helpfulCount: number;
    unhelpfulCount: number;
    createdAt: string;
    updatedAt: string;
}

interface SupportState {
    tickets: Ticket[];
    currentTicket: Ticket | null;
    articles: KnowledgeArticle[];
    currentArticle: KnowledgeArticle | null;
    isLoading: boolean;
    error: string | null;

    fetchTickets: (filters?: any) => Promise<void>;
    fetchTicket: (id: string) => Promise<void>;
    createTicket: (data: Partial<Ticket>) => Promise<void>;
    updateTicket: (id: string, data: Partial<Ticket>) => Promise<void>;

    fetchArticles: (filters?: any) => Promise<void>;
    fetchArticle: (id: string) => Promise<void>;

    clearCurrentTicket: () => void;
    clearCurrentArticle: () => void;
}

export const useSupportStore = create<SupportState>((set) => ({
    tickets: [],
    currentTicket: null,
    articles: [],
    currentArticle: null,
    isLoading: false,
    error: null,

    fetchTickets: async (filters?: any) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/support/tickets', { params: filters });
            set({ tickets: response.data, isLoading: false });
        } catch (error: any) {
            console.warn('Backend /support/tickets not found, using mock data');
            set({
                tickets: [
                    {
                        id: '1',
                        ticketId: 'TIC-1001',
                        subject: 'Laptop screen flickering',
                        description: 'My screen has been flickering since this morning.',
                        status: 'open',
                        priority: 'medium',
                        category: 'Hardware',
                        requesterId: 'u1',
                        requesterName: 'John Doe',
                        slaDeadline: '2026-03-07T10:00:00Z',
                        createdAt: '2026-03-05T09:00:00Z',
                        updatedAt: '2026-03-05T09:00:00Z',
                    },
                    {
                        id: '2',
                        ticketId: 'TIC-1002',
                        subject: 'VPN access request',
                        description: 'Need access to internal staging environment.',
                        status: 'in-progress',
                        priority: 'high',
                        category: 'Access',
                        requesterId: 'u2',
                        requesterName: 'Jane Smith',
                        assigneeId: 'a1',
                        assigneeName: 'Support Agent 1',
                        slaDeadline: '2026-03-06T12:00:00Z',
                        createdAt: '2026-03-05T10:30:00Z',
                        updatedAt: '2026-03-05T11:00:00Z',
                    }
                ],
                isLoading: false
            });
        }
    },

    fetchTicket: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/support/tickets/${id}`);
            set({ currentTicket: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: 'Failed to fetch ticket', isLoading: false });
        }
    },

    createTicket: async (data: Partial<Ticket>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/support/tickets', data);
            set((state) => ({ tickets: [response.data, ...state.tickets], isLoading: false }));
        } catch (error: any) {
            set({ error: 'Failed to create ticket', isLoading: false });
        }
    },

    updateTicket: async (id: string, data: Partial<Ticket>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.put(`/support/tickets/${id}`, data);
            set((state) => ({
                tickets: state.tickets.map((t) => (t.id === id ? response.data : t)),
                currentTicket: state.currentTicket?.id === id ? response.data : state.currentTicket,
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: 'Failed to update ticket', isLoading: false });
        }
    },

    fetchArticles: async (filters?: any) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/support/articles', { params: filters });
            set({ articles: response.data, isLoading: false });
        } catch (error: any) {
            console.warn('Backend /support/articles not found, using mock data');
            set({
                articles: [
                    {
                        id: '1',
                        title: 'How to Reset Your Password',
                        content: 'Follow these steps to reset your corporate password...',
                        category: 'Security',
                        authorId: 'a1',
                        authorName: 'IT Admin',
                        status: 'published',
                        views: 1250,
                        helpfulCount: 45,
                        unhelpfulCount: 2,
                        createdAt: '2025-01-10T00:00:00Z',
                        updatedAt: '2025-01-10T00:00:00Z',
                    },
                    {
                        id: '2',
                        title: 'VPN Connection Guide',
                        content: 'Detailed instructions for connecting to the VPN using AnyConnect...',
                        category: 'Network',
                        authorId: 'a1',
                        authorName: 'IT Admin',
                        status: 'published',
                        views: 890,
                        helpfulCount: 32,
                        unhelpfulCount: 5,
                        createdAt: '2025-02-15T00:00:00Z',
                        updatedAt: '2025-02-15T00:00:00Z',
                    }
                ],
                isLoading: false
            });
        }
    },

    fetchArticle: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/support/articles/${id}`);
            set({ currentArticle: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: 'Failed to fetch article', isLoading: false });
        }
    },

    clearCurrentTicket: () => set({ currentTicket: null }),
    clearCurrentArticle: () => set({ currentArticle: null }),
}));
