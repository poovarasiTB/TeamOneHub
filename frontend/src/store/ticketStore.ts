import { create } from 'zustand';
import apiClient from '../lib/api';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  type: 'incident' | 'service-request' | 'problem' | 'change';
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'open' | 'pending' | 'on-hold' | 'resolved' | 'closed';
  assigneeId?: string;
  assigneeName?: string;
  requesterName?: string;
  requesterEmail?: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  fetchTickets: (filters?: any) => Promise<void>;
  fetchTicket: (id: string) => Promise<void>;
  createTicket: (data: Partial<Ticket>) => Promise<void>;
  updateTicket: (id: string, data: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  addComment: (ticketId: string, content: string) => Promise<void>;
  assignTicket: (ticketId: string, assigneeId: string) => Promise<void>;
  clearCurrentTicket: () => void;
  clearError: () => void;
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  currentTicket: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  fetchTickets: async (filters?: any) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.get('/support/tickets', { params: filters });
      const { data, pagination } = response.data;
      
      set({
        tickets: data,
        pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch tickets',
        isLoading: false,
      });
    }
  },

  fetchTicket: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.get(`/support/tickets/${id}`);
      set({
        currentTicket: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch ticket',
        isLoading: false,
      });
    }
  },

  createTicket: async (data: Partial<Ticket>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.post('/support/tickets', data);
      const newTicket = response.data;
      
      set((state) => ({
        tickets: [newTicket, ...state.tickets],
        currentTicket: newTicket,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create ticket',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTicket: async (id: string, data: Partial<Ticket>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.patch(`/support/tickets/${id}`, data);
      const updatedTicket = response.data;
      
      set((state) => ({
        tickets: state.tickets.map((t) => (t.id === id ? updatedTicket : t)),
        currentTicket: updatedTicket,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update ticket',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTicket: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.delete(`/support/tickets/${id}`);
      
      set((state) => ({
        tickets: state.tickets.filter((t) => t.id !== id),
        currentTicket: state.currentTicket?.id === id ? null : state.currentTicket,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete ticket',
        isLoading: false,
      });
      throw error;
    }
  },

  addComment: async (ticketId: string, content: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.post(`/support/tickets/${ticketId}/comment`, {
        content,
        commentType: 'public',
      });
      
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add comment',
        isLoading: false,
      });
      throw error;
    }
  },

  assignTicket: async (ticketId: string, assigneeId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.post(`/support/tickets/${ticketId}/assign`, { assigneeId });
      
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === ticketId ? { ...t, assigneeId, status: 'open' as const } : t
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to assign ticket',
        isLoading: false,
      });
      throw error;
    }
  },

  clearCurrentTicket: () => {
    set({ currentTicket: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
