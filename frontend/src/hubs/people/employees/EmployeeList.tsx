import React from 'react';
import { useEmployeeStore } from '../../../store/employeeStore';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card, CardContent } from '../../../components/Card';

export function EmployeeList() {
  const { employees, fetchEmployees, isLoading } = useEmployeeStore();

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Employees</h1>
          <p className="text-text-400 mt-1">Manage your team members</p>
        </div>
        <Link to="/people/employees/new">
          <Button variant="primary">+ Add Employee</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link to={`/people/employees/${employee.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center text-white text-xl font-bold">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </div>
                  <Badge variant={
                    employee.status === 'active' ? 'success' :
                    employee.status === 'on-leave' ? 'warning' : 'default'
                  }>
                    {employee.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-text-100 mb-1">
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className="text-sm text-text-400 mb-2">{employee.designation}</p>
                <p className="text-sm text-text-400 mb-4">{employee.department}</p>
                <div className="flex items-center text-sm text-text-400">
                  <span>📧</span>
                  <span className="ml-2">{employee.email}</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
