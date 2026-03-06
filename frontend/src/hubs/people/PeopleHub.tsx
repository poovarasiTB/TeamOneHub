import React from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { EmployeeList } from './employees/EmployeeList';
import { EmployeeDetail } from './employees/EmployeeDetail';
import { CreateEmployee } from './employees/CreateEmployee';
import { AttendanceCalendar } from './attendance/AttendanceCalendar';
import { LeaveManagement } from './leave/LeaveManagement';
import { PayrollView } from './payroll/PayrollView';
import { PerformanceManagement } from './performance/PerformanceManagement';
import { RecruitmentATS } from './recruitment/RecruitmentATS';
import { VendorPortal } from './recruitment/VendorPortal';
import { ShiftRostering } from './recruitment/ShiftRostering';
import { LivenessVerification } from './recruitment/LivenessVerification';

export function PeopleHub() {
  const location = useLocation();
  const isRoot = location.pathname === '/people';

  if (isRoot) {
    return <Navigate to="/people/employees" replace />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-6 px-8 py-4 bg-surface-800 border-b border-border-12 sticky top-0 z-10">
        <NavLink
          to="/people/employees"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive || location.pathname.startsWith('/people/employees')
              ? 'text-primary-400 border-b-2 border-primary-400 pb-1'
              : 'text-text-400 hover:text-text-100'
            }`
          }
        >
          Directory
        </NavLink>
        <NavLink
          to="/people/attendance"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-primary-400 border-b-2 border-primary-400 pb-1'
              : 'text-text-400 hover:text-text-100'
            }`
          }
        >
          Attendance
        </NavLink>
        <NavLink
          to="/people/leave"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-primary-400 border-b-2 border-primary-400 pb-1'
              : 'text-text-400 hover:text-text-100'
            }`
          }
        >
          Leave
        </NavLink>
        <NavLink
          to="/people/payroll"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-primary-400 border-b-2 border-primary-400 pb-1'
              : 'text-text-400 hover:text-text-100'
            }`
          }
        >
          Payroll
        </NavLink>
        <NavLink
          to="/people/performance"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-primary-400 border-b-2 border-primary-400 pb-1'
              : 'text-text-400 hover:text-text-100'
            }`
          }
        >
          Performance
        </NavLink>
        <NavLink
          to="/people/recruitment"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-primary-400 border-b-2 border-primary-400 pb-1'
              : 'text-text-400 hover:text-text-100'
            }`
          }
        >
          Recruitment
        </NavLink>
        <NavLink
          to="/people/vendors"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-primary-400 border-b-2 border-primary-400 pb-1'
              : 'text-text-400 hover:text-text-100'
            }`
          }
        >
          Vendors
        </NavLink>
        <NavLink
          to="/people/rostering"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-primary-400 border-b-2 border-primary-400 pb-1'
              : 'text-text-400 hover:text-text-100'
            }`
          }
        >
          Rostering
        </NavLink>
        <NavLink
          to="/people/verification"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive
              ? 'text-primary-400 border-b-2 border-primary-400 pb-1'
              : 'text-text-400 hover:text-text-100'
            }`
          }
        >
          Verification
        </NavLink>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/new" element={<CreateEmployee />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            <Route path="attendance" element={<AttendanceCalendar />} />
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="payroll" element={<PayrollView />} />
            <Route path="performance" element={<PerformanceManagement />} />
            <Route path="recruitment" element={<RecruitmentATS />} />
            <Route path="vendors" element={<VendorPortal />} />
            <Route path="rostering" element={<ShiftRostering />} />
            <Route path="verification" element={<LivenessVerification />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
