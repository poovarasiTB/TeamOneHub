import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import toast from 'react-hot-toast';
import apiClient from '../../../lib/api';

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: string[];
}

interface Permission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
}

export function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([
    { module: 'Dashboard', read: true, write: true, delete: false },
    { module: 'Projects', read: true, write: true, delete: false },
    { module: 'Tasks', read: true, write: true, delete: true },
    { module: 'Team', read: true, write: true, delete: false },
    { module: 'Reports', read: true, write: false, delete: false },
    { module: 'Settings', read: false, write: false, delete: false },
    { module: 'Users', read: false, write: false, delete: false },
    { module: 'Billing', read: false, write: false, delete: false },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await apiClient.get('/admin/roles');
      setRoles(response.data);
      if (response.data.length > 0) {
        setSelectedRole(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    setIsSaving(true);
    try {
      await apiClient.patch(`/admin/roles/${selectedRole}/permissions`, { permissions });
      toast.success('Permissions updated successfully');
    } catch (error) {
      toast.error('Failed to update permissions');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePermission = (module: string, type: 'read' | 'write' | 'delete') => {
    setPermissions(
      permissions.map((p) =>
        p.module === module ? { ...p, [type]: !p[type] } : p
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Roles & Permissions</h1>
          <p className="text-text-400 mt-1">Manage user roles and permissions</p>
        </div>
        <Button variant="primary">+ Create Role</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Roles</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roles.length === 0 ? (
                <p className="text-center text-text-400 py-8">No roles found</p>
              ) : (
                roles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-colors ${
                      selectedRole === role.id
                        ? 'bg-primary-500/20 border border-primary-500'
                        : 'bg-bg-800 hover:bg-bg-750'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-text-100 font-semibold">{role.name}</h3>
                      <Badge variant="info">{role.users} users</Badge>
                    </div>
                    <p className="text-sm text-text-400">{role.description}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permissions Matrix */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-text-100">
                Permissions {selectedRole ? `- ${roles.find((r) => r.id === selectedRole)?.name}` : ''}
              </h2>
              <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-800 border-b border-border-12">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Module</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-text-100">Read</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-text-100">Write</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-text-100">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-12">
                  {permissions.map((perm) => (
                    <tr key={perm.module} className="hover:bg-bg-800/50 transition-colors">
                      <td className="px-6 py-4 text-text-100 font-medium">{perm.module}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePermission(perm.module, 'read')}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            perm.read ? 'bg-success' : 'bg-bg-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              perm.read ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePermission(perm.module, 'write')}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            perm.write ? 'bg-primary-500' : 'bg-bg-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              perm.write ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePermission(perm.module, 'delete')}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            perm.delete ? 'bg-error' : 'bg-bg-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              perm.delete ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permission Summary */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Permission Summary</h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-bg-800 rounded-lg">
              <p className="text-3xl font-bold text-success">
                {permissions.filter((p) => p.read).length}
              </p>
              <p className="text-sm text-text-400 mt-1">Read Permissions</p>
            </div>
            <div className="text-center p-4 bg-bg-800 rounded-lg">
              <p className="text-3xl font-bold text-primary-400">
                {permissions.filter((p) => p.write).length}
              </p>
              <p className="text-sm text-text-400 mt-1">Write Permissions</p>
            </div>
            <div className="text-center p-4 bg-bg-800 rounded-lg">
              <p className="text-3xl font-bold text-error">
                {permissions.filter((p) => p.delete).length}
              </p>
              <p className="text-sm text-text-400 mt-1">Delete Permissions</p>
            </div>
            <div className="text-center p-4 bg-bg-800 rounded-lg">
              <p className="text-3xl font-bold text-text-100">
                {permissions.length * 3}
              </p>
              <p className="text-sm text-text-400 mt-1">Total Permissions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
