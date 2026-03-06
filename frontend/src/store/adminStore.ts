import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'user';
    status: 'active' | 'inactive';
    lastLogin: string;
}

export interface Permission {
    id: string;
    module: string;
    action: 'read' | 'write' | 'delete' | 'manage';
    enabled: boolean;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    action: string;
    module: string;
    details: string;
    ipAddress: string;
}

export interface SystemSetting {
    key: string;
    value: string;
    category: 'general' | 'security' | 'appearance' | 'email';
    description: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    userCount: number;
}

interface AdminState {
    users: AdminUser[];
    roles: Role[];
    auditLogs: AuditLogEntry[];
    settings: SystemSetting[];
    isLoading: boolean;
    error: string | null;

    fetchUsers: () => Promise<void>;
    updateUserRole: (id: string, role: string) => Promise<void>;

    fetchRoles: () => Promise<void>;
    updatePermissions: (roleId: string, permissions: any) => Promise<void>;

    fetchAuditLogs: () => Promise<void>;
    fetchSettings: () => Promise<void>;
    updateSetting: (key: string, value: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
    users: [],
    roles: [],
    auditLogs: [],
    settings: [],
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/admin/users');
            set({ users: response.data, isLoading: false });
        } catch (error: any) {
            console.warn('Backend /admin/users not found, using mock data');
            set({
                users: [
                    {
                        id: 'u1',
                        name: 'John Doe',
                        email: 'admin@teamone.hub',
                        role: 'admin',
                        status: 'active',
                        lastLogin: '2026-03-05T09:00:00Z'
                    },
                    {
                        id: 'u2',
                        name: 'Jane Smith',
                        email: 'm.smith@teamone.hub',
                        role: 'manager',
                        status: 'active',
                        lastLogin: '2026-03-04T15:30:00Z'
                    }
                ],
                isLoading: false
            });
        }
    },

    updateUserRole: async (id, role) => {
        try {
            await apiClient.patch(`/admin/users/${id}/role`, { role });
            set(state => ({
                users: state.users.map(u => u.id === id ? { ...u, role: role as any } : u)
            }));
        } catch (error) {
            set({ error: 'Failed to update user role' });
        }
    },

    fetchRoles: async () => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get('/admin/roles');
            set({ roles: response.data, isLoading: false });
        } catch (error) {
            console.warn('Backend /admin/roles not found, using mock data');
            set({
                roles: [
                    { id: 'r1', name: 'Administrator', description: 'Full system access', userCount: 3 },
                    { id: 'r2', name: 'Operations', description: 'Manage projects and people', userCount: 12 },
                    { id: 'r3', name: 'Standard User', description: 'Regular employee access', userCount: 85 }
                ],
                isLoading: false
            });
        }
    },

    updatePermissions: async (roleId, permissions) => {
        try {
            await apiClient.patch(`/admin/roles/${roleId}/permissions`, { permissions });
        } catch (error) {
            set({ error: 'Failed to update permissions' });
        }
    },

    fetchAuditLogs: async () => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get('/admin/audit');
            set({ auditLogs: response.data, isLoading: false });
        } catch (error) {
            console.warn('Backend /admin/audit not found, using mock data');
            set({
                auditLogs: [
                    {
                        id: 'log1',
                        timestamp: new Date().toISOString(),
                        userId: 'u1',
                        userName: 'John Doe',
                        action: 'Updated Payroll Status',
                        module: 'People Hub',
                        details: 'Approved payroll for March 2026',
                        ipAddress: '192.168.1.1'
                    }
                ],
                isLoading: false
            });
        }
    },

    fetchSettings: async () => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get('/admin/settings');
            set({ settings: response.data, isLoading: false });
        } catch (error) {
            console.warn('Backend /admin/settings not found, using mock data');
            set({
                settings: [
                    {
                        key: 'site_name',
                        value: 'TeamOne Hub',
                        category: 'general',
                        description: 'The display name of the application'
                    },
                    {
                        key: 'maintenance_mode',
                        value: 'false',
                        category: 'general',
                        description: 'Put the site in maintenance mode'
                    }
                ],
                isLoading: false
            });
        }
    },

    updateSetting: async (key, value) => {
        try {
            await apiClient.put(`/admin/settings/${key}`, { value });
            set(state => ({
                settings: state.settings.map(s => s.key === key ? { ...s, value } : s)
            }));
        } catch (error) {
            set({ error: 'Failed to update setting' });
        }
    },
}));
