import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import toast from 'react-hot-toast';

export function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: 'Casual Leave', startDate: '2026-02-20', endDate: '2026-02-21', status: 'pending', reason: 'Personal work' },
    { id: 2, type: 'Sick Leave', startDate: '2026-01-15', endDate: '2026-01-16', status: 'approved', reason: 'Medical appointment' },
    { id: 3, type: 'Privilege Leave', startDate: '2026-03-01', endDate: '2026-03-05', status: 'pending', reason: 'Family vacation' },
  ]);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please fill all fields');
      return;
    }

    const newRequest = {
      id: leaveRequests.length + 1,
      ...formData,
      status: 'pending' as const,
    };

    setLeaveRequests([...leaveRequests, newRequest]);
    setFormData({ type: 'Casual Leave', startDate: '', endDate: '', reason: '' });
    setShowApplyForm(false);
    toast.success('Leave application submitted');
  };

  const handleApprove = (id: number) => {
    setLeaveRequests(leaveRequests.map(req =>
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
    toast.success('Leave approved');
  };

  const handleReject = (id: number) => {
    setLeaveRequests(leaveRequests.map(req =>
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ));
    toast.success('Leave rejected');
  };

  const leaveBalance = {
    casual: { total: 12, used: 3, remaining: 9 },
    sick: { total: 12, used: 2, remaining: 10 },
    privilege: { total: 18, used: 0, remaining: 18 },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Leave Management</h1>
          <p className="text-text-400 mt-1">Manage your leave applications</p>
        </div>
        <Button onClick={() => setShowApplyForm(!showApplyForm)}>
          {showApplyForm ? 'Cancel' : '+ Apply for Leave'}
        </Button>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Casual Leave</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-400">Total</span>
                <span className="text-text-100 font-semibold">{leaveBalance.casual.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-400">Used</span>
                <span className="text-warning font-semibold">{leaveBalance.casual.used}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-400">Remaining</span>
                <span className="text-success font-semibold">{leaveBalance.casual.remaining}</span>
              </div>
              <div className="w-full bg-bg-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${(leaveBalance.casual.used / leaveBalance.casual.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Sick Leave</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-400">Total</span>
                <span className="text-text-100 font-semibold">{leaveBalance.sick.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-400">Used</span>
                <span className="text-warning font-semibold">{leaveBalance.sick.used}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-400">Remaining</span>
                <span className="text-success font-semibold">{leaveBalance.sick.remaining}</span>
              </div>
              <div className="w-full bg-bg-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${(leaveBalance.sick.used / leaveBalance.sick.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Privilege Leave</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-400">Total</span>
                <span className="text-text-100 font-semibold">{leaveBalance.privilege.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-400">Used</span>
                <span className="text-warning font-semibold">{leaveBalance.privilege.used}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-400">Remaining</span>
                <span className="text-success font-semibold">{leaveBalance.privilege.remaining}</span>
              </div>
              <div className="w-full bg-bg-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${(leaveBalance.privilege.used / leaveBalance.privilege.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Apply Leave Form */}
      {showApplyForm && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Apply for Leave</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-sm text-text-400 mb-2">Leave Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Privilege Leave">Privilege Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-400 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-400 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-400 mb-2">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Reason for leave"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary">Submit Application</Button>
                <Button type="button" variant="secondary" onClick={() => setShowApplyForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Leave Requests */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Leave Requests</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-bg-800 rounded-xl">
                <div>
                  <p className="text-text-100 font-medium">{request.type}</p>
                  <p className="text-sm text-text-400">
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-text-400 mt-1">{request.reason}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    request.status === 'approved' ? 'success' :
                    request.status === 'rejected' ? 'error' : 'warning'
                  }>
                    {request.status}
                  </Badge>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="success" onClick={() => handleApprove(request.id)}>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(request.id)}>Reject</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
