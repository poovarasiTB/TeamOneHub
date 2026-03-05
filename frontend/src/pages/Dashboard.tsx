import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useUIStore } from '@/store/uiStore';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent } from '@/components/Card';

export function Dashboard() {
  const { projects, fetchProjects } = useProjectStore();
  const { addNotification } = useUIStore();

  React.useEffect(() => {
    fetchProjects({ limit: 5 });
  }, []);

  const stats = [
    { label: 'Total Projects', value: '24', change: '+12%', trend: 'up', color: 'primary' },
    { label: 'Active Tasks', value: '156', change: '+8%', trend: 'up', color: 'success' },
    { label: 'Team Members', value: '42', change: '+3%', trend: 'up', color: 'info' },
    { label: 'Revenue (MTD)', value: '$1.2M', change: '-2%', trend: 'down', color: 'warning' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Dashboard</h1>
          <p className="text-text-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Button onClick={() => addNotification({
          type: 'info',
          title: 'Test Notification',
          message: 'This is a test notification',
          timestamp: Date.now(),
        })}>
          Test Notification
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <p className="text-sm text-text-400 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-text-100 mb-2">{stat.value}</p>
              <div className="flex items-center">
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-success' : 'text-error'
                  }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-text-400 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-100">Recent Projects</h2>
          <Link to="/work/projects" className="text-sm text-primary-400 hover:text-primary-300">
            View All →
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-12">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-400">Project</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-400">Health</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-400">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-bg-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link to={`/work/projects/${project.id}`} className="text-primary-400 hover:text-primary-300">
                        {project.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        project.status === 'active' ? 'success' :
                          project.status === 'completed' ? 'info' :
                            project.status === 'on-hold' ? 'warning' : 'default'
                      }>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        project.healthStatus === 'green' ? 'success' :
                          project.healthStatus === 'yellow' ? 'warning' : 'error'
                      }>
                        {project.healthStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-text-600">
                      {project.budget ? `$${(project.budget / 1000).toFixed(0)}K` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-text-100 mb-2">Create Project</h3>
            <p className="text-sm text-text-400 mb-4">Start a new project</p>
            <Link to="/work/projects/new">
              <Button variant="primary" size="sm">Create</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-text-100 mb-2">Add Team Member</h3>
            <p className="text-sm text-text-400 mb-4">Invite new member</p>
            <Link to="/people/employees/new">
              <Button variant="primary" size="sm">Invite</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="text-lg font-semibold text-text-100 mb-2">Create Ticket</h3>
            <p className="text-sm text-text-400 mb-4">Report an issue</p>
            <Link to="/support/tickets/new">
              <Button variant="primary" size="sm">Create</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
