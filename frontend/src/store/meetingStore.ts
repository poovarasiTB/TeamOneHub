import { create } from 'zustand';
import apiClient from '../lib/api';

export interface Meeting {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  meetingType?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  locationType?: string;
  location?: string;
  videoLink?: string;
  organizerId: string;
  organizerName?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  recordingUrl?: string;
  transcript?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingAttendee {
  id: string;
  meetingId: string;
  userId: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined';
  responseAt?: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  status: 'open' | 'in-progress' | 'completed';
  completedAt?: string;
}

interface MeetingState {
  meetings: Meeting[];
  currentMeeting: Meeting | null;
  attendees: MeetingAttendee[];
  actionItems: ActionItem[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  fetchMeetings: (filters?: any) => Promise<void>;
  fetchMeeting: (id: string) => Promise<void>;
  fetchAttendees: (id: string) => Promise<void>;
  fetchActionItems: (id: string) => Promise<void>;
  createMeeting: (data: Partial<Meeting>) => Promise<void>;
  updateMeeting: (id: string, data: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  addAttendee: (meetingId: string, userId: string) => Promise<void>;
  removeAttendee: (meetingId: string, userId: string) => Promise<void>;
  updateAttendeeStatus: (meetingId: string, userId: string, status: 'pending' | 'accepted' | 'declined') => Promise<void>;
  addActionItem: (meetingId: string, description: string, assigneeId?: string, dueDate?: string) => Promise<void>;
  updateActionItemStatus: (actionItemId: string, status: 'open' | 'in-progress' | 'completed') => Promise<void>;
  clearCurrentMeeting: () => void;
  clearError: () => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetings: [],
  currentMeeting: null,
  attendees: [],
  actionItems: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  fetchMeetings: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/growth/meetings', { params: filters });
      const { data, pagination } = response.data;
      set({ meetings: data, pagination, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch meetings', isLoading: false });
    }
  },

  fetchMeeting: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/growth/meetings/${id}`);
      set({ currentMeeting: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch meeting', isLoading: false });
    }
  },

  fetchAttendees: async (id: string) => {
    try {
      const response = await apiClient.get(`/growth/meetings/${id}/attendees`);
      set({ attendees: response.data });
    } catch (error: any) {
      console.error('Failed to fetch attendees:', error);
    }
  },

  fetchActionItems: async (id: string) => {
    try {
      const response = await apiClient.get(`/growth/meetings/${id}/action-items`);
      set({ actionItems: response.data });
    } catch (error: any) {
      console.error('Failed to fetch action items:', error);
    }
  },

  createMeeting: async (data: Partial<Meeting>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/growth/meetings', data);
      const newMeeting = response.data;
      set((state) => ({
        meetings: [newMeeting, ...state.meetings],
        currentMeeting: newMeeting,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create meeting', isLoading: false });
      throw error;
    }
  },

  updateMeeting: async (id: string, data: Partial<Meeting>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/growth/meetings/${id}`, data);
      const updatedMeeting = response.data;
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? updatedMeeting : m)),
        currentMeeting: updatedMeeting,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update meeting', isLoading: false });
      throw error;
    }
  },

  deleteMeeting: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/growth/meetings/${id}`);
      set((state) => ({
        meetings: state.meetings.filter((m) => m.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete meeting', isLoading: false });
      throw error;
    }
  },

  addAttendee: async (meetingId: string, userId: string) => {
    try {
      await apiClient.post(`/growth/meetings/${meetingId}/attendees`, { userId });
      get().fetchAttendees(meetingId);
    } catch (error: any) {
      console.error('Failed to add attendee:', error);
    }
  },

  removeAttendee: async (meetingId: string, userId: string) => {
    try {
      await apiClient.delete(`/growth/meetings/${meetingId}/attendees`, { data: { userId } });
      get().fetchAttendees(meetingId);
    } catch (error: any) {
      console.error('Failed to remove attendee:', error);
    }
  },

  updateAttendeeStatus: async (meetingId: string, userId: string, status: 'pending' | 'accepted' | 'declined') => {
    try {
      await apiClient.patch(`/growth/meetings/${meetingId}/attendees/status`, { userId, status });
      get().fetchAttendees(meetingId);
    } catch (error: any) {
      console.error('Failed to update attendee status:', error);
    }
  },

  addActionItem: async (meetingId: string, description: string, assigneeId?: string, dueDate?: string) => {
    try {
      await apiClient.post(`/growth/meetings/${meetingId}/action-items`, { description, assigneeId, dueDate });
      get().fetchActionItems(meetingId);
    } catch (error: any) {
      console.error('Failed to add action item:', error);
    }
  },

  updateActionItemStatus: async (actionItemId: string, status: 'open' | 'in-progress' | 'completed') => {
    try {
      await apiClient.patch(`/growth/meetings/action-items/${actionItemId}/status`, { status });
      const meetingId = get().currentMeeting?.id;
      if (meetingId) get().fetchActionItems(meetingId);
    } catch (error: any) {
      console.error('Failed to update action item status:', error);
    }
  },

  clearCurrentMeeting: () => set({ currentMeeting: null, attendees: [], actionItems: [] }),
  clearError: () => set({ error: null }),
}));
