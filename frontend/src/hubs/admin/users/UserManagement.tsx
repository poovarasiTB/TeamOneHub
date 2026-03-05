import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useUserStore, User } from '../../../store/userStore';
import toast from 'react-hot-toast';

export function UserManagement() {
  const { users, fetchUsers, createUser, updateUser, deleteUser, suspendUser, activateUser, isLoading, error } = useUserStore();
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user',
    status: 'pending',
    department: '',
    jobTitle: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      toast.success('User created successfully');
      setShowNewUser(false);
      setNewUser({ name: '', email: '', role: 'user', status: 'pending', department: '', jobTitle: '' });
    } catch (err) {
      toast.error('Failed to create user');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: User['status']) => {
    try {
      if (currentStatus === 'active') {
        await suspendUser(id);
        toast.success('User suspended');
      } else {
        await activateUser(id);
        toast.success('User activated');
      }
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading users...</p>
        </div>
      </div>
    );
  }

  const activeCount = users.filter((u) => u.status === 'active').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">User Management</h1>
          <p className="text-text-400 mt-1">Manage system users</p>
        </div>
        <Button variant="primary" onClick={() => setShowNewUser(true)}>+ Add User</Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Users</p>
            <p className="text-3xl font-bold text-text-100">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Active</p>
            <p className="text-3xl font-bold text-success">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Suspended</p>
            <p className="text-3xl font-bold text-warning">{suspendedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Pending</p>
            <p className="text-3xl font-bold text-info">{users.filter((u) => u.status === 'pending').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">All Users</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800 border-b border-border-12">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-text-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-text-400">
                      No users found. Add your first user!
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-bg-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-text-100">{user.name}</div>
                          {user.jobTitle && <div className="text-sm text-text-500">{user.jobTitle}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={user.role === 'Admin' ? 'error' : user.role === 'Manager' ? 'primary' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-text-400">{user.department || '-'}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            user.status === 'active'
                              ? 'success'
                              : user.status === 'suspended'
                              ? 'warning'
                              : user.status === 'inactive'
                              ? 'secondary'
                              : 'info'
                          }
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className="text-primary-400 hover:text-primary-300"
                          >
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-error hover:text-error/80"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New User Modal */}
      {showNewUser && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Add New User</h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={newUser.jobTitle}
                    onChange={(e) => setNewUser({ ...newUser, jobTitle: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">Create User</Button>
                <Button type="button" variant="secondary" onClick={() => setShowNewUser(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
