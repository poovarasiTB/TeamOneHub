import { create } from 'zustand';
import apiClient from '../lib/api';

interface Employee {
  id: string;
  employeeCode: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  department?: string;
  designation?: string;
  reportingManagerId?: string;
  status: 'active' | 'on-leave' | 'terminated' | 'resigned';
  joinDate: string;
  location?: string;
  phone?: string;
}

interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  fetchEmployees: (filters?: any) => Promise<void>;
  fetchEmployee: (id: string) => Promise<void>;
  createEmployee: (data: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  clearCurrentEmployee: () => void;
  clearError: () => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  currentEmployee: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  fetchEmployees: async (filters?: any) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.get('/people/employees', { params: filters });
      const { data, pagination } = response.data;
      
      set({
        employees: data,
        pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch employees',
        isLoading: false,
      });
    }
  },

  fetchEmployee: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.get(`/people/employees/${id}`);
      set({
        currentEmployee: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch employee',
        isLoading: false,
      });
    }
  },

  createEmployee: async (data: Partial<Employee>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.post('/people/employees', data);
      const newEmployee = response.data;
      
      set((state) => ({
        employees: [newEmployee, ...state.employees],
        currentEmployee: newEmployee,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create employee',
        isLoading: false,
      });
      throw error;
    }
  },

  updateEmployee: async (id: string, data: Partial<Employee>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.patch(`/people/employees/${id}`, data);
      const updatedEmployee = response.data;
      
      set((state) => ({
        employees: state.employees.map((e) => (e.id === id ? updatedEmployee : e)),
        currentEmployee: updatedEmployee,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update employee',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteEmployee: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.delete(`/people/employees/${id}`);
      
      set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
        currentEmployee: state.currentEmployee?.id === id ? null : state.currentEmployee,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete employee',
        isLoading: false,
      });
      throw error;
    }
  },

  clearCurrentEmployee: () => {
    set({ currentEmployee: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
