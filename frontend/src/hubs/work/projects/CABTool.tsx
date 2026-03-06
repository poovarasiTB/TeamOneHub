import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

const mockChanges = [
    { id: 'CAB-2026-001', title: 'Upgrade Database Cluster', requester: 'Bob Smith', priority: 'high', status: 'pending', impact: 'high' },
    { id: 'CAB-2026-002', title: 'Deploy Auth Patch v2.1', requester: 'Alice Johnson', priority: 'medium', status: 'approved', impact: 'medium' },
    { id: 'CAB-2026-003', title: 'Scale API Gateway', requester: 'Edward Norton', priority: 'low', status: 'pending', impact: 'low' },
];

export function CABTool() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Change Advisory Board (CAB)</h1>
                    <p className="text-text-400 mt-1">Formal approval workflow for production deployments</p>
                </div>
                <Button variant="primary">+ Request Change</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-bg-800 border-border-12">
                    <CardContent className="p-4">
                        <p className="text-xs text-text-400 uppercase font-bold tracking-wider">Pending Review</p>
                        <p className="text-2xl font-bold text-text-100">5</p>
                    </CardContent>
                </Card>
                <Card className="bg-bg-800 border-border-12">
                    <CardContent className="p-4">
                        <p className="text-xs text-text-400 uppercase font-bold tracking-wider">Scheduled Today</p>
                        <p className="text-2xl font-bold text-text-100">2</p>
                    </CardContent>
                </Card>
                <Card className="bg-bg-800 border-border-12">
                    <CardContent className="p-4">
                        <p className="text-xs text-text-400 uppercase font-bold tracking-wider">Success Rate</p>
                        <p className="text-2xl font-bold text-success-400">98.5%</p>
                    </CardContent>
                </Card>
                <Card className="bg-bg-800 border-border-12">
                    <CardContent className="p-4">
                        <p className="text-xs text-text-400 uppercase font-bold tracking-wider">Emergency Changes</p>
                        <p className="text-2xl font-bold text-error-400">0</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <h3 className="text-lg font-bold text-text-100">Active Change Requests</h3>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-bg-800 border-b border-border-12">
                            <tr>
                                <th className="p-4 text-left text-xs font-bold text-text-400 uppercase">ID</th>
                                <th className="p-4 text-left text-xs font-bold text-text-400 uppercase">Change Title</th>
                                <th className="p-4 text-left text-xs font-bold text-text-400 uppercase">Requester</th>
                                <th className="p-4 text-left text-xs font-bold text-text-400 uppercase">Priority</th>
                                <th className="p-4 text-left text-xs font-bold text-text-400 uppercase">Status</th>
                                <th className="p-4 text-right text-xs font-bold text-text-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-12">
                            {mockChanges.map((change) => (
                                <tr key={change.id} className="hover:bg-bg-800/50 transition-colors group">
                                    <td className="p-4 font-mono text-xs text-primary-400">{change.id}</td>
                                    <td className="p-4">
                                        <p className="font-bold text-text-100">{change.title}</p>
                                        <p className="text-xs text-text-400">Impact: <span className="capitalize">{change.impact}</span></p>
                                    </td>
                                    <td className="p-4 text-sm text-text-300">{change.requester}</td>
                                    <td className="p-4">
                                        <Badge variant={change.priority === 'high' ? 'error' : change.priority === 'medium' ? 'warning' : 'default'}>
                                            {change.priority}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={change.status === 'approved' ? 'success' : 'default'}>
                                            {change.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="secondary" size="sm">Review</Button>
                                            {change.status === 'pending' && <Button variant="primary" size="sm">Approve</Button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="bg-primary-500/10 border border-primary-500/20 p-6 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-3xl">🛡️</div>
                    <div>
                        <h4 className="font-bold text-text-100">Two-Man Rule Enforced</h4>
                        <p className="text-sm text-text-400">Production deployments require concurrent approval by 2 distinct authorized users.</p>
                    </div>
                </div>
                <Badge variant="primary">System Active</Badge>
            </div>
        </div>
    );
}
