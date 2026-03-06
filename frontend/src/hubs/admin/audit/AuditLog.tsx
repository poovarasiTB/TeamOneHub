import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { useAdminStore } from '../../../store/adminStore';
import { LoadingTable } from '../../../components/Loading';

export function AuditLog() {
  const { auditLogs, fetchAuditLogs, isLoading } = useAdminStore();

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  if (isLoading && auditLogs.length === 0) {
    return <LoadingTable rows={8} columns={5} />;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-left">
        <h1 className="text-3xl font-bold text-text-100 font-serif italic">Security Audit Logs</h1>
        <p className="text-text-400 mt-1 italic">Immutable record of system-wide administrative actions</p>
      </div>

      <Card className="shadow-2xl shadow-black/30 border-error/5">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-100 italic font-serif">Event Stream</h2>
          <Badge variant="error" className="animate-pulse">Live Monitoring</Badge>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-800 border-b border-border-12">
              <tr>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Timestamp</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Actor</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Action Type</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Resource / Module</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-12">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-bg-800/80 transition-colors font-mono text-xs">
                  <td className="px-6 py-4 text-text-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-primary-400 font-bold">{log.userName}</span>
                    <span className="text-text-600 ml-2">ID: {log.userId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-text-100">{log.action}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="info">{log.module}</Badge>
                    <p className="text-text-500 mt-1 truncate max-w-xs">{log.details}</p>
                  </td>
                  <td className="px-6 py-4 text-text-600">
                    {log.ipAddress}
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
