import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import apiClient from '../../../lib/api';

interface AuditLogEntry {
  id: string;
  action: string;
  userId: string;
  userName?: string;
  entityType: string;
  entityId: string;
  changes?: any;
  timestamp: string;
  ipAddress?: string;
}

export function AuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({ action: '', entityType: '', dateFrom: '', dateTo: '' });

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/admin/audit-logs', { params: filter });
      setLogs(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await apiClient.get('/admin/audit-logs/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-log-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  const actionColors: Record<string, string> = {
    CREATE: 'bg-success/20 text-success',
    UPDATE: 'bg-info/20 text-info',
    DELETE: 'bg-error/20 text-error',
    LOGIN: 'bg-bg-600 text-text-400',
    LOGOUT: 'bg-bg-600 text-text-400',
  };

  if (isLoading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  const successCount = logs.filter((l) => l.action !== 'LOGIN_FAILED' && !l.action.includes('ERROR')).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Audit Log</h1>
          <p className="text-text-400 mt-1">System audit trail</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleExport}>Export Logs</Button>
          <Button variant="primary">Download Report</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Events</p>
            <p className="text-3xl font-bold text-text-100">{logs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Successful</p>
            <p className="text-3xl font-bold text-success">{successCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Failed</p>
            <p className="text-3xl font-bold text-error">{logs.length - successCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Security Events</p>
            <p className="text-3xl font-bold text-warning">{logs.filter((l) => l.entityType === 'user' || l.action.includes('LOGIN')).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-text-400 mb-2">Action</label>
              <select
                value={filter.action}
                onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="LOGIN">Login</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-400 mb-2">Entity Type</label>
              <select
                value={filter.entityType}
                onChange={(e) => setFilter({ ...filter, entityType: e.target.value })}
                className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                <option value="user">User</option>
                <option value="project">Project</option>
                <option value="invoice">Invoice</option>
                <option value="ticket">Ticket</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-400 mb-2">From Date</label>
              <input
                type="date"
                value={filter.dateFrom}
                onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
                className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm text-text-400 mb-2">To Date</label>
              <input
                type="date"
                value={filter.dateTo}
                onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
                className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Audit Events</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800 border-b border-border-12">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Timestamp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Entity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-text-400">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-bg-800/50 transition-colors">
                      <td className="px-6 py-4 text-text-400 text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={actionColors[log.action] || 'bg-bg-600 text-text-400'}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-text-100">{log.userName || log.userId}</td>
                      <td className="px-6 py-4">
                        <div className="text-text-100">{log.entityType}</div>
                        <div className="text-sm text-text-500">{log.entityId}</div>
                      </td>
                      <td className="px-6 py-4 text-text-400 text-sm">
                        {log.changes ? JSON.stringify(log.changes).slice(0, 50) + '...' : '-'}
                      </td>
                      <td className="px-6 py-4 text-text-400 text-sm font-mono">{log.ipAddress || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
