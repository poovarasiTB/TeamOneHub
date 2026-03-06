import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../../store/projectStore';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import toast from 'react-hot-toast';

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, fetchProject, updateProject, deleteProject, isLoading } = useProjectStore();

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id!);
        toast.success('Project deleted successfully');
        navigate('/work/projects');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  if (isLoading || !currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-text-400 font-mono">{currentProject.code}</span>
            <Badge variant={
              currentProject.status === 'active' ? 'success' :
                currentProject.status === 'completed' ? 'info' : 'default'
            }>
              {currentProject.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-text-100">{currentProject.name}</h1>
          {currentProject.description && (
            <p className="text-text-400 mt-2">{currentProject.description}</p>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(`/work/projects/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Project Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-400 mb-1">Health Status</p>
            <Badge variant={
              currentProject.healthStatus === 'green' ? 'success' :
                currentProject.healthStatus === 'yellow' ? 'warning' : 'error'
            }>
              {currentProject.healthStatus}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-400 mb-1">Budget</p>
            <p className="text-2xl font-bold text-text-100">
              {currentProject.budget ? `$${currentProject.budget.toLocaleString()}` : 'Not set'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-400 mb-1">Timeline</p>
            <p className="text-text-100">
              {new Date(currentProject.startDate).toLocaleDateString()}
              {currentProject.endDate && ` - ${new Date(currentProject.endDate).toLocaleDateString()}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-text-100">Project Details</h2>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm text-text-400 mb-1">Project Type</dt>
              <dd className="text-text-100 capitalize">{currentProject.type}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-400 mb-1">Currency</dt>
              <dd className="text-text-100">{currentProject.currency}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-400 mb-1">Start Date</dt>
              <dd className="text-text-100">{new Date(currentProject.startDate).toLocaleDateString()}</dd>
            </div>
            {currentProject.endDate && (
              <div>
                <dt className="text-sm text-text-400 mb-1">End Date</dt>
                <dd className="text-text-100">{new Date(currentProject.endDate).toLocaleDateString()}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-text-400 mb-1">Industry</dt>
              <dd className="text-text-100 capitalize">{(currentProject as any).industryTemplate || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-400 mb-1">Data Classification</dt>
              <dd className="text-text-100 capitalize">
                <Badge variant={(currentProject as any).dataClassification === 'public' ? 'success' : 'warning'}>
                  {(currentProject as any).dataClassification || 'Internal'}
                </Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to={`/work/projects/${id}/board`}>
          <Card className="hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-bg-800 to-bg-900 border-border-12">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3 drop-shadow-md">📋</div>
              <h3 className="text-lg font-bold text-text-100">Agile Board</h3>
              <p className="text-sm text-text-400 mt-1">Kanban & Scrum</p>
            </CardContent>
          </Card>
        </Link>
        <Link to={`/work/projects/${id}/gantt`}>
          <Card className="hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-bg-800 to-bg-900 border-border-12">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3 drop-shadow-md">📈</div>
              <h3 className="text-lg font-bold text-text-100">Timeline</h3>
              <p className="text-sm text-text-400 mt-1">Interactive Gantt</p>
            </CardContent>
          </Card>
        </Link>
        <Link to={`/work/projects/${id}/whiteboard`}>
          <Card className="hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-bg-800 to-bg-900 border-border-12">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3 drop-shadow-md">🎨</div>
              <h3 className="text-lg font-bold text-text-100">Whiteboard</h3>
              <p className="text-sm text-text-400 mt-1">Design visually</p>
            </CardContent>
          </Card>
        </Link>
        <Link to={`/work/projects/${id}/reports`}>
          <Card className="hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-bg-800 to-bg-900 border-border-12">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3 drop-shadow-md">📊</div>
              <h3 className="text-lg font-bold text-text-100">Analytics</h3>
              <p className="text-sm text-text-400 mt-1">Project Reports</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
