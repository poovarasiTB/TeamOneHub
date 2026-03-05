import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  notifications: Notification[];
  
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  notifications: [],

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setTheme: (theme: 'dark' | 'light') => {
    set({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id: Date.now().toString() }],
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notification.id),
      }));
    }, 5000);
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
