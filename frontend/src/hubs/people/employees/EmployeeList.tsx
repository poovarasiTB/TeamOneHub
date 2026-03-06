import { useEffect, useState } from 'react';
import { usePeopleStore } from '../../../store/peopleStore';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card, CardContent } from '../../../components/Card';
import { LoadingTable } from '../../../components/Loading';

export function EmployeeList() {
  const { employees, fetchEmployees, isLoading } = usePeopleStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department).filter(Boolean)))];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  if (isLoading && employees.length === 0) {
    return <LoadingTable rows={5} columns={5} />;
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

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full bg-bg-800 border border-border-12 rounded-xl px-4 py-2 text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="bg-bg-800 border border-border-12 rounded-xl px-4 py-2 text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {departments.map((dept, i) => (
            <option key={i} value={dept as string}>{dept}</option>
          ))}
        </select>
        <div className="flex bg-bg-800 rounded-xl p-1 border border-border-12">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-text-400 hover:text-text-100'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-text-400 hover:text-text-100'}`}
          >
            List
          </button>
        </div>
      </div>

      {filteredEmployees.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <p className="text-text-400 text-lg">No employees found matching your criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <Link to={`/people/employees/${employee.id}`} className="flex-1 flex flex-col">
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
                  <p className="text-sm text-text-400 mb-2">{employee.position}</p>
                  <p className="text-sm text-text-400 mb-4">{employee.department}</p>
                  <div className="flex items-center text-sm text-text-400 mt-auto">
                    <span>📧</span>
                    <span className="ml-2 truncate">{employee.email}</span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-surface-800 rounded-xl border border-border-12 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-12 bg-bg-800">
                <th className="p-4 text-sm font-semibold text-text-400">Employee</th>
                <th className="p-4 text-sm font-semibold text-text-400">Role</th>
                <th className="p-4 text-sm font-semibold text-text-400">Department</th>
                <th className="p-4 text-sm font-semibold text-text-400">Status</th>
                <th className="p-4 text-sm font-semibold text-text-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-12">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-bg-800/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold text-sm">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-text-100">{employee.firstName} {employee.lastName}</p>
                      <p className="text-sm text-text-400">{employee.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-text-100">{employee.position}</td>
                  <td className="p-4 text-text-100">{employee.department}</td>
                  <td className="p-4">
                    <Badge variant={
                      employee.status === 'active' ? 'success' :
                        employee.status === 'on-leave' ? 'warning' : 'default'
                    }>
                      {employee.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/people/employees/${employee.id}`}>
                      <Button variant="secondary" size="sm">View Options</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
