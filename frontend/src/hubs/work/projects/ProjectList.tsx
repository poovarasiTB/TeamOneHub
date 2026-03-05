import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { LoadingTable } from '@/components/Loading';

export function ProjectList() {
  const { projects, pagination, fetchProjects, isLoading, error } = useProjectStore();
  const [filters, setFilters] = React.useState({ page: 1, limit: 20, status: '', search: '' });

  React.useEffect(() => {
    fetchProjects(filters);
  }, [filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, status: e.target.value, page: 1 });
  };

  if (isLoading && projects.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-100">Projects</h1>
            <p className="text-text-400 mt-1">Manage all your projects</p>
          </div>
          <Link to="/work/projects/new">
            <Button variant="primary">
              <span className="text-xl mr-2">+</span>
              New Project
            </Button>
          </Link>
        </div>
        <LoadingTable rows={5} columns={6} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Projects</h1>
          <p className="text-text-400 mt-1">Manage all your projects</p>
        </div>
        <Link to="/work/projects/new">
          <Button variant="primary">
            <span className="text-xl mr-2">+</span>
            New Project
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search projects..."
              value={filters.search}
              onChange={handleSearch}
              className="flex-1 px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Code</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Health</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Budget</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-bg-800/50 transition-colors">
                    <td className="py-4 px-6 text-text-600 font-mono">{project.code}</td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/work/projects/${project.id}`}
                        className="text-primary-400 hover:text-primary-300 font-medium"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          project.status === 'active'
                            ? 'success'
                            : project.status === 'completed'
                              ? 'info'
                              : project.status === 'on-hold'
                                ? 'warning'
                                : project.status === 'cancelled'
                                  ? 'error'
                                  : 'default'
                        }
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          project.healthStatus === 'green'
                            ? 'success'
                            : project.healthStatus === 'yellow'
                              ? 'warning'
                              : 'error'
                        }
                      >
                        {project.healthStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-text-600">
                      {project.budget ? `$${(project.budget / 1000).toFixed(0)}K` : '-'}
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/work/projects/${project.id}`}
                        className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {projects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-400 mb-4">No projects found</p>
                <Link to="/work/projects/new">
                  <Button variant="primary">Create Your First Project</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-text-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} projects
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
