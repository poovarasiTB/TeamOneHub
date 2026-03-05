import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useTaskStore, Task } from '@/store/taskStore';

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentTask, fetchTask, updateTask, isLoading, error } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    title: string;
    description: string;
    status: Task['status'];
    priority: Task['priority'];
    dueDate: string;
  }>({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentTask) {
      setEditData({
        title: currentTask.title,
        description: currentTask.description || '',
        status: currentTask.status,
        priority: currentTask.priority,
        dueDate: currentTask.dueDate ? currentTask.dueDate.split('T')[0] : '',
      });
    }
  }, [currentTask]);

  const handleSave = async () => {
    if (!id) return;
    try {
      await updateTask(id, editData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-text-100 mb-4">Task Not Found</h1>
        <Link to="/work/tasks">
          <Button variant="primary">Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    backlog: 'bg-bg-600 text-text-400',
    todo: 'bg-info/20 text-info',
    'in-progress': 'bg-warning/20 text-warning',
    review: 'bg-primary/20 text-primary-400',
    done: 'bg-success/20 text-success',
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-bg-600 text-text-400',
    medium: 'bg-info/20 text-info',
    high: 'bg-warning/20 text-warning',
    urgent: 'bg-error/20 text-error',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/work/tasks">
            <Button variant="ghost">← Back</Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text-100">{currentTask.title}</h1>
            <p className="text-text-400 text-sm">{currentTask.code}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="primary" onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Task</Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-text-100">Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm text-text-400 mb-2">Title</label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-400 mb-2">Description</label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm text-text-400 mb-1">Description</h3>
                    <p className="text-text-100">{currentTask.description || 'No description provided'}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Activity/Comments */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-text-100">Activity</h2>
            </CardHeader>
            <CardContent>
              <p className="text-text-400 text-center py-8">No activity yet</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-text-100">Properties</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-text-400 mb-2">Status</label>
                {isEditing ? (
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value as Task['status'] })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                ) : (
                  <Badge className={statusColors[currentTask.status]}>{currentTask.status}</Badge>
                )}
              </div>

              <div>
                <label className="block text-sm text-text-400 mb-2">Priority</label>
                {isEditing ? (
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value as Task['priority'] })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                ) : (
                  <Badge className={priorityColors[currentTask.priority]}>{currentTask.priority}</Badge>
                )}
              </div>

              <div>
                <label className="block text-sm text-text-400 mb-2">Due Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dueDate}
                    onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-text-100">
                    {currentTask.dueDate ? new Date(currentTask.dueDate).toLocaleDateString() : 'Not set'}
                  </p>
                )}
              </div>

              {currentTask.assigneeName && (
                <div>
                  <label className="block text-sm text-text-400 mb-2">Assignee</label>
                  <p className="text-text-100">{currentTask.assigneeName}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-text-100">Meta</h2>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-400">Created</span>
                <span className="text-text-100">{new Date(currentTask.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-400">Updated</span>
                <span className="text-text-100">{new Date(currentTask.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


