import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface WikiArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    authorId: string;
    authorName: string;
    status: 'draft' | 'published';
    views: number;
    createdAt: string;
    updatedAt: string;
}

export interface Meeting {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    meetingType: 'one-on-one' | 'team' | 'client' | 'interview' | 'other';
    locationType: 'video' | 'office' | 'phone';
    videoLink?: string;
    organizerId: string;
    organizerName: string;
    attendees: string[];
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    notes?: string;
    actions?: string[];
}

export interface Campaign {
    id: string;
    name: string;
    platform: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    budget: number;
    spent: number;
    leads: number;
    impressions: number;
    clicks: number;
    startDate: string;
    endDate?: string;
}

interface GrowthState {
    wikiArticles: WikiArticle[];
    currentWikiArticle: WikiArticle | null;
    meetings: Meeting[];
    currentMeeting: Meeting | null;
    campaigns: Campaign[];
    isLoading: boolean;
    error: string | null;

    fetchWikiArticles: (query?: string) => Promise<void>;
    fetchWikiArticle: (id: string) => Promise<void>;
    fetchMeetings: () => Promise<void>;
    fetchMeeting: (id: string) => Promise<void>;
    fetchCampaigns: () => Promise<void>;

    clearCurrentWikiArticle: () => void;
    clearCurrentMeeting: () => void;
}

export const useGrowthStore = create<GrowthState>((set) => ({
    wikiArticles: [],
    currentWikiArticle: null,
    meetings: [],
    currentMeeting: null,
    campaigns: [],
    isLoading: false,
    error: null,

    fetchWikiArticles: async (query?: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/growth/wiki', { params: { search: query } });
            set({ wikiArticles: response.data, isLoading: false });
        } catch (error: any) {
            console.warn('Backend /growth/wiki not found, using mock data');
            set({
                wikiArticles: [
                    {
                        id: '1',
                        title: 'Onboarding Guide for New Hires',
                        content: 'Welcome to TeamOne! This guide covers everything you need to know...',
                        category: 'Human Resources',
                        tags: ['onboarding', 'hr', 'culture'],
                        status: 'published',
                        views: 450,
                        authorId: 'a1',
                        authorName: 'Sarah Jenkins',
                        createdAt: '2025-01-01T00:00:00Z',
                        updatedAt: '2025-01-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        title: 'Coding Standards & Best Practices',
                        content: 'We follow Clean Code principles and use TypeScript for all frontend projects...',
                        category: 'Engineering',
                        tags: ['typescript', 'react', 'standards'],
                        status: 'published',
                        views: 280,
                        authorId: 'a2',
                        authorName: 'Emily Chen',
                        createdAt: '2025-02-10T00:00:00Z',
                        updatedAt: '2025-02-10T00:00:00Z',
                    }
                ],
                isLoading: false
            });
        }
    },

    fetchWikiArticle: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/growth/wiki/${id}`);
            set({ currentWikiArticle: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: 'Failed to fetch wiki article', isLoading: false });
        }
    },

    fetchMeetings: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/growth/meetings');
            set({ meetings: response.data, isLoading: false });
        } catch (error: any) {
            console.warn('Backend /growth/meetings not found, using mock data');
            set({
                meetings: [
                    {
                        id: '1',
                        title: 'Weekly Sync - Engineering Hub',
                        description: 'Weekly review of ongoing development tasks and blockers.',
                        startTime: '2026-03-10T10:00:00Z',
                        endTime: '2026-03-10T11:00:00Z',
                        location: 'Conference Room A / Zoom',
                        meetingType: 'team',
                        locationType: 'video',
                        organizerId: 'u1',
                        organizerName: 'John Doe',
                        attendees: ['a1', 'a2', 'u2'],
                        status: 'scheduled',
                    },
                    {
                        id: '2',
                        title: 'Marketing Strategy Review',
                        description: 'Discussing Q2 marketing campaigns and budget allocation.',
                        startTime: '2026-03-11T14:00:00Z',
                        endTime: '2026-03-11T15:30:00Z',
                        location: 'Zoom',
                        meetingType: 'client',
                        locationType: 'video',
                        organizerId: 'u2',
                        organizerName: 'Jane Smith',
                        attendees: ['u1', 'm1'],
                        status: 'scheduled',
                    }
                ],
                isLoading: false
            });
        }
    },

    fetchMeeting: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/growth/meetings/${id}`);
            set({ currentMeeting: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: 'Failed to fetch meeting details', isLoading: false });
        }
    },

    fetchCampaigns: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/growth/campaigns');
            set({ campaigns: response.data, isLoading: false });
        } catch (error: any) {
            console.warn('Backend /growth/campaigns not found, using mock data');
            set({
                campaigns: [
                    {
                        id: '1',
                        name: 'LinkedIn Recruitment Drive',
                        platform: 'LinkedIn',
                        status: 'active',
                        budget: 5000,
                        spent: 1200,
                        leads: 45,
                        impressions: 25000,
                        clicks: 850,
                        startDate: '2026-03-01T00:00:00Z',
                    },
                    {
                        id: '2',
                        name: 'Google Ads - Product Launch',
                        platform: 'Google',
                        status: 'active',
                        budget: 10000,
                        spent: 4500,
                        leads: 120,
                        impressions: 85000,
                        clicks: 3200,
                        startDate: '2026-02-15T00:00:00Z',
                    }
                ],
                isLoading: false
            });
        }
    },

    clearCurrentWikiArticle: () => set({ currentWikiArticle: null }),
    clearCurrentMeeting: () => set({ currentMeeting: null }),
}));
