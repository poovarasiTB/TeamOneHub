import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useAdminStore } from '../../../store/adminStore';
import { LoadingTable } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function RolesPermissions() {
  const { roles, fetchRoles, updatePermissions, isLoading } = useAdminStore();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0].id);
    }
  }, [roles, selectedRole]);

  if (isLoading && roles.length === 0) {
    return <LoadingTable rows={5} columns={3} />;
  }

  const modules = [
    { name: 'Core Dashboard', slug: 'dashboard' },
    { name: 'Work Hub (Projects)', slug: 'projects' },
    { name: 'People Hub (HR)', slug: 'people' },
    { name: 'Money Hub (Finance)', slug: 'finance' },
    { name: 'Growth Hub (CRM)', slug: 'growth' },
    { name: 'Asset Hub', slug: 'assets' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Access Control Matrix</h1>
          <p className="text-text-400 mt-1 italic">Define granular permissions for organizational roles</p>
        </div>
        <Button variant="primary" onClick={() => toast.error('Role creation disabled')}>+ Create New Role</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-text-400 uppercase tracking-widest pl-2">System Roles</h3>
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${selectedRole === role.id
                  ? 'bg-primary-500/10 border-primary-500 shadow-lg shadow-primary-500/5'
                  : 'bg-bg-800 border-border-12 hover:border-text-600'
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className={`font-bold ${selectedRole === role.id ? 'text-primary-400' : 'text-text-100'}`}>{role.name}</p>
                <Badge variant="info" className="text-[10px]">{role.userCount}</Badge>
              </div>
              <p className="text-xs text-text-500 leading-relaxed">{role.description}</p>
            </div>
          ))}
        </div>

        <Card className="lg:col-span-3 shadow-2xl shadow-black/20">
          <CardHeader className="flex justify-between items-center bg-bg-800/30">
            <h2 className="text-xl font-bold text-text-100 italic font-serif">Permissions Configuration</h2>
            <Button variant="primary" size="sm" onClick={() => toast.success('Policy updated')}>Save Changes</Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-800 border-b border-border-12">
                <tr>
                  <th className="px-6 py-4 font-semibold text-text-100 italic">Module Functional Area</th>
                  <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Read</th>
                  <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Write</th>
                  <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Delete</th>
                  <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {modules.map((m) => (
                  <tr key={m.slug} className="hover:bg-bg-800/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-text-100 font-medium">{m.name}</p>
                      <p className="text-[10px] text-text-500 uppercase tracking-tighter">ID: platform.module.{m.slug}</p>
                    </td>
                    {['read', 'write', 'delete', 'admin'].map((perm) => (
                      <td key={perm} className="px-6 py-5 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={selectedRole === 'r1'} className="sr-only peer" />
                          <div className="w-10 h-5 bg-bg-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
