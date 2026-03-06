import { create } from 'zustand';
import { apiClient } from '@/lib/api';

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position: string;
    department: string;
    status: 'active' | 'on-leave' | 'terminated';
    joinDate: string;
    avatarUrl?: string;
    managerId?: string;
    salary?: number;
    location?: string;
    employeeCode?: string;
}

export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    type: 'vacation' | 'sick' | 'personal' | 'other';
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    reason?: string;
}

export interface Payslip {
    id: string;
    employeeId: string;
    period: string;
    baseAmount: number;
    bonus?: number;
    deductions?: number;
    netAmount: number;
    paymentDate: string;
    status: 'paid' | 'pending';
}

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: 'present' | 'absent' | 'late' | 'excused';
}

export interface PerformanceReview {
    id: string;
    employeeId: string;
    employeeName: string;
    reviewerId: string;
    reviewerName: string;
    status: 'pending' | 'in-progress' | 'completed';
    rating?: number;
    feedback?: string;
    periodStart: string;
    periodEnd: string;
}

interface PeopleState {
    employees: Employee[];
    currentEmployee: Employee | null;
    leaveRequests: LeaveRequest[];
    attendanceRecords: AttendanceRecord[];
    payslips: Payslip[];
    reviews: PerformanceReview[];
    isLoading: boolean;
    error: string | null;

    fetchEmployees: () => Promise<void>;
    fetchEmployee: (id: string) => Promise<void>;
    createEmployee: (data: Partial<Employee>) => Promise<void>;

    fetchLeaveRequests: () => Promise<void>;
    updateLeaveStatus: (id: string, status: LeaveRequest['status']) => Promise<void>;

    fetchAttendance: (filters: any) => Promise<void>;
    fetchPayslips: (employeeId?: string) => Promise<void>;

    fetchReviews: (filters?: any) => Promise<void>;
}

export const usePeopleStore = create<PeopleState>((set) => ({
    employees: [],
    currentEmployee: null,
    leaveRequests: [],
    attendanceRecords: [],
    payslips: [],
    reviews: [],
    isLoading: false,
    error: null,

    fetchEmployees: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/people/employees');
            set({ employees: response.data, isLoading: false });
        } catch (error: any) {
            console.warn('Backend /people/employees not found, using mock data');
            set({
                employees: [
                    {
                        id: '1',
                        firstName: 'Sarah',
                        lastName: 'Wilson',
                        email: 'sarah.w@teamone.hub',
                        position: 'Chief People Officer',
                        department: 'HR',
                        status: 'active',
                        joinDate: '2023-01-15',
                        employeeCode: 'EMP001',
                        location: 'London HQ'
                    },
                    {
                        id: '2',
                        firstName: 'Michael',
                        lastName: 'Chen',
                        email: 'm.chen@teamone.hub',
                        position: 'Lead Engineer',
                        department: 'Engineering',
                        status: 'active',
                        joinDate: '2023-03-20',
                        employeeCode: 'EMP042',
                        location: 'Remote (NYC)'
                    },
                    {
                        id: '3',
                        firstName: 'Jessica',
                        lastName: 'Lee',
                        email: 'j.lee@teamone.hub',
                        position: 'UI/UX Designer',
                        department: 'Design',
                        status: 'on-leave',
                        joinDate: '2024-06-10',
                        employeeCode: 'EMP085',
                        location: 'Singapore Office'
                    }
                ],
                isLoading: false
            });
        }
    },

    fetchEmployee: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(`/people/employees/${id}`);
            set({ currentEmployee: response.data, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch employee', isLoading: false });
        }
    },

    createEmployee: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post('/people/employees', data);
            set(state => ({ employees: [...state.employees, response.data], isLoading: false }));
        } catch (error) {
            set({ error: 'Failed to create employee', isLoading: false });
        }
    },

    fetchLeaveRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/people/leave');
            set({ leaveRequests: response.data, isLoading: false });
        } catch (error) {
            console.warn('Backend /people/leave not found, using mock data');
            set({
                leaveRequests: [
                    {
                        id: '1',
                        employeeId: '3',
                        employeeName: 'Jessica Lee',
                        type: 'vacation',
                        startDate: '2026-03-15',
                        endDate: '2026-03-22',
                        status: 'pending',
                        reason: 'Annual family trip',
                    },
                    {
                        id: '2',
                        employeeId: '2',
                        employeeName: 'Michael Chen',
                        type: 'sick',
                        startDate: '2026-03-05',
                        endDate: '2026-03-06',
                        status: 'approved',
                    }
                ],
                isLoading: false
            });
        }
    },

    updateLeaveStatus: async (id, status) => {
        try {
            await apiClient.patch(`/people/leave/${id}`, { status });
            set(state => ({
                leaveRequests: state.leaveRequests.map(r => r.id === id ? { ...r, status } : r)
            }));
        } catch (error) {
            set({ error: 'Failed to update leave status' });
        }
    },

    fetchAttendance: async (filters) => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get('/people/attendance', { params: filters });
            set({ attendanceRecords: response.data, isLoading: false });
        } catch (error) {
            console.warn('Backend /people/attendance not found, using empty mock');
            set({ attendanceRecords: [], isLoading: false });
        }
    },

    fetchPayslips: async (employeeId) => {
        set({ isLoading: true });
        try {
            const params = employeeId ? { employeeId } : {};
            const response = await apiClient.get('/people/payroll', { params });
            set({ payslips: response.data, isLoading: false });
        } catch (error) {
            console.warn('Backend /people/payroll not found, using mock data');
            set({
                payslips: [
                    {
                        id: 'p1',
                        employeeId: '1',
                        period: 'February 2026',
                        baseAmount: 12000,
                        netAmount: 11200,
                        paymentDate: '2026-02-28',
                        status: 'paid',
                    }
                ],
                isLoading: false
            });
        }
    },

    fetchReviews: async (filters) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/people/performance', { params: filters });
            set({ reviews: response.data, isLoading: false });
        } catch (error) {
            console.warn('Backend /people/performance not found, using mock data');
            set({
                reviews: [
                    {
                        id: 'r1',
                        employeeId: '2',
                        employeeName: 'Michael Chen',
                        reviewerId: '1',
                        reviewerName: 'Sarah Wilson',
                        status: 'completed',
                        rating: 4.8,
                        periodStart: '2025-01-01',
                        periodEnd: '2025-12-31'
                    }
                ],
                isLoading: false
            });
        }
    },
}));
