import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePeopleStore } from '../../../store/peopleStore';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { LoadingPage } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEmployee, fetchEmployee, isLoading } = usePeopleStore();

  useEffect(() => {
    if (id) {
      fetchEmployee(id);
    }
  }, [id, fetchEmployee]);

  const handleDelete = () => {
    toast.error('Deletion is restricted to Administrators');
  };

  if (isLoading || !currentEmployee) {
    return <LoadingPage message="Loading employee details..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-700 flex items-center justify-center text-white text-2xl font-bold">
            {currentEmployee.firstName[0]}{currentEmployee.lastName[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-100">
              {currentEmployee.firstName} {currentEmployee.lastName}
            </h1>
            <p className="text-text-400">{currentEmployee.position} • {currentEmployee.department}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={currentEmployee.status === 'active' ? 'success' : 'warning'}>
                {currentEmployee.status}
              </Badge>
              <span className="text-text-400 text-sm">Joined {new Date(currentEmployee.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(`/people/employees/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Contact Information</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-400">Email</dt>
                <dd className="text-text-100">{currentEmployee.email}</dd>
              </div>
              {currentEmployee.phone && (
                <div>
                  <dt className="text-sm text-text-400">Phone</dt>
                  <dd className="text-text-100">{currentEmployee.phone}</dd>
                </div>
              )}
              {currentEmployee.location && (
                <div>
                  <dt className="text-sm text-text-400">Location</dt>
                  <dd className="text-text-100">{currentEmployee.location}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Job Information</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-400">Department</dt>
                <dd className="text-text-100">{currentEmployee.department}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-400">Position</dt>
                <dd className="text-text-100">{currentEmployee.position}</dd>
              </div>
              {currentEmployee.employeeCode && (
                <div>
                  <dt className="text-sm text-text-400">Employee Code</dt>
                  <dd className="text-text-100 font-mono">{currentEmployee.employeeCode}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Employment Details</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-400">Join Date</dt>
                <dd className="text-text-100">{new Date(currentEmployee.joinDate).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-400">Status</dt>
                <dd>
                  <Badge variant={currentEmployee.status === 'active' ? 'success' : 'warning'}>
                    {currentEmployee.status}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to={`/people/employees/${id}/attendance`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-lg font-semibold text-text-100">Attendance</h3>
              <p className="text-sm text-text-400 mt-1">View attendance</p>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/people/employees/${id}/leave`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🏖️</div>
              <h3 className="text-lg font-semibold text-text-100">Leave</h3>
              <p className="text-sm text-text-400 mt-1">View leave balance</p>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/people/employees/${id}/performance`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-text-100">Performance</h3>
              <p className="text-sm text-text-400 mt-1">View reviews</p>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/people/employees/${id}/documents`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="text-lg font-semibold text-text-100">Documents</h3>
              <p className="text-sm text-text-400 mt-1">View documents</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
