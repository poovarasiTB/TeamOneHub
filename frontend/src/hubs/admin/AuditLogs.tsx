import { Card, CardHeader, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';

const logs = [
    { id: 1, user: 'Admin User', action: 'Login Success', target: 'System', timestamp: '2026-03-06 10:15:22', ip: '192.168.1.1' },
    { id: 2, user: 'Bob Smith', action: 'Update Project', target: 'PRJ-001', timestamp: '2026-03-06 10:14:05', ip: '192.168.1.42' },
    { id: 3, user: 'System', action: 'Auto Rotation', target: 'DB_KEY', timestamp: '2026-03-06 09:00:00', ip: 'Internal' },
    { id: 4, user: 'Alice Johnson', action: 'Delete Task', target: 'TSK-204', timestamp: '2026-03-06 08:45:10', ip: '172.16.0.5' },
];

export function AuditLogs() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-100">Immutable Audit Logs</h1>
                <p className="text-text-400 mt-1">Compliance tracking for all system activities (ISO-27001)</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-bg-800 border-b border-border-12 text-[10px] uppercase font-bold text-text-500">
                            <tr>
                                <th className="p-4 text-left">User</th>
                                <th className="p-4 text-left">Action</th>
                                <th className="p-4 text-left">Target</th>
                                <th className="p-4 text-left">Timestamp</th>
                                <th className="p-4 text-right">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-12">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-bg-800/20 transition-colors">
                                    <td className="p-4 text-sm font-bold text-text-100">{log.user}</td>
                                    <td className="p-4">
                                        <Badge variant={log.action.includes('Delete') ? 'error' : log.action.includes('Success') ? 'success' : 'primary'}>
                                            {log.action}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-xs font-mono text-text-400">{log.target}</td>
                                    <td className="p-4 text-xs text-text-500">{log.timestamp}</td>
                                    <td className="p-4 text-right text-[10px] font-mono text-text-600">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
