import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { usePeopleStore } from '../../../store/peopleStore';
import { useAuthStore } from '../../../store/authStore';
import { LoadingTable } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function LeaveManagement() {
  const { user } = useAuthStore();
  const { leaveRequests, fetchLeaveRequests, isLoading } = usePeopleStore();
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  if (isLoading && leaveRequests.length === 0) {
    return <LoadingTable rows={5} columns={4} />;
  }

  const balances = [
    { type: 'Vacation', allocated: 22, used: 5, remaining: 17 },
    { type: 'Sick Leave', allocated: 10, used: 2, remaining: 8 },
    { type: 'Personal', allocated: 5, used: 1, remaining: 4 },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Time Off Management</h1>
          <p className="text-text-400 mt-1 italic">Track your leave balances and requests</p>
        </div>
        <Button variant="primary" onClick={() => setShowApplyForm(true)}>+ New Application</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {balances.map((b) => (
          <Card key={b.type} className="border-primary-500/10 hover:border-primary-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-text-100">{b.type}</h3>
                <Badge variant="info">2026</Badge>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-text-400">Remaining</p>
                  <p className="text-4xl font-black text-primary-400">{b.remaining}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-500">Allocated: {b.allocated}</p>
                  <p className="text-xs text-text-500">Used: {b.used}</p>
                </div>
              </div>
              <div className="mt-4 w-full bg-bg-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(b.used / b.allocated) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-2xl shadow-black/20">
        <CardHeader>
          <h2 className="text-xl font-bold text-text-100 italic font-serif">Request History</h2>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-800 border-b border-border-12">
              <tr>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Employee</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Type</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Duration</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-12">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-bg-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xs">
                        {req.employeeName[0]}
                      </div>
                      <span className="text-text-100 font-medium">{req.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default" className="capitalize">{req.type}</Badge>
                  </td>
                  <td className="px-6 py-4 text-text-200">
                    {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'}>
                      {req.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">Details</Button>
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
