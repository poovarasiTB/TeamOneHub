import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EmployeeList } from './employees/EmployeeList';
import { EmployeeDetail } from './employees/EmployeeDetail';
import { CreateEmployee } from './employees/CreateEmployee';
import { AttendanceCalendar } from './attendance/AttendanceCalendar';
import { LeaveManagement } from './leave/LeaveManagement';
import { PayrollView } from './payroll/PayrollView';

export function PeopleHub() {
  return (
    <div className="people-hub">
      <Routes>
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/new" element={<CreateEmployee />} />
        <Route path="/employees/:id" element={<EmployeeDetail />} />
        <Route path="/attendance" element={<AttendanceCalendar />} />
        <Route path="/leave" element={<LeaveManagement />} />
        <Route path="/payroll" element={<PayrollView />} />
      </Routes>
    </div>
  );
}
