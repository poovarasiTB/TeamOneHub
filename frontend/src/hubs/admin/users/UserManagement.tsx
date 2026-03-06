import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useAdminStore } from '../../../store/adminStore';
import { LoadingTable } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function UserManagement() {
  const { users, fetchUsers, updateUserRole, isLoading } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading && users.length === 0) {
    return <LoadingTable rows={5} columns={5} />;
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Identity & Access</h1>
          <p className="text-text-400 mt-1 italic">Manage platform users and their operational roles</p>
        </div>
        <Button variant="primary" onClick={() => toast.error('Creation restricted in demo')}>+ Invite User</Button>
      </div>

      <Card className="bg-bg-800/50 border-primary-500/10">
        <CardContent className="p-4 flex gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-bg-900 border border-border-12 rounded-xl px-4 py-2 text-text-100 focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex gap-2">
            <Badge variant="info">{users.length} Total</Badge>
            <Badge variant="success">{users.filter(u => u.status === 'active').length} Active</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl shadow-black/20">
        <CardHeader>
          <h2 className="text-xl font-bold text-text-100 italic font-serif">Registry</h2>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-800 border-b border-border-12">
              <tr>
                <th className="px-6 py-4 font-semibold text-text-100 italic">User Profile</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">System Role</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Last Active</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-12">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-bg-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400 font-bold border border-primary-500/20">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-text-100 font-bold leading-none">{user.name}</p>
                        <p className="text-xs text-text-400 mt-1">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="bg-bg-800 border border-border-12 rounded-lg text-xs px-2 py-1 text-text-200"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">Standard User</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-text-400 text-sm">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="text-error">Revoke</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
