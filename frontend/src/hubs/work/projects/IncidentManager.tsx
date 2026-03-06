import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

const mockIncidents = [
    { id: 'INC-2026-904', title: 'API Gateway Timeout', severity: 'critical', status: 'investigating', duration: '45m', owner: 'Edward Norton' },
    { id: 'INC-2026-899', title: 'Slow Database Queries', severity: 'major', status: 'identified', duration: '2h 15m', owner: 'Bob Smith' },
    { id: 'INC-2026-880', title: 'Frontend CSS Glitch in Safari', severity: 'minor', status: 'resolved', duration: '1h 20m', owner: 'Alice Johnson' },
];

export function IncidentManager() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Incident Manager</h1>
                    <p className="text-text-400 mt-1">Blameless post-mortems and RCA tracking</p>
                </div>
                <Button variant="danger">! Report Major Incident</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockIncidents.map(incident => (
                    <Card key={incident.id} className={`${incident.severity === 'critical' ? 'border-error-500/50 bg-error-500/5' : 'border-border-12'}`}>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant={incident.severity === 'critical' ? 'error' : incident.severity === 'major' ? 'warning' : 'default'}>
                                    {incident.severity}
                                </Badge>
                                <span className="text-xs font-mono text-text-400">{incident.id}</span>
                            </div>
                            <h3 className="text-lg font-bold text-text-100 mb-2">{incident.title}</h3>
                            <div className="space-y-2 mt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-400">Status</span>
                                    <span className="text-text-100 font-bold capitalize">{incident.status}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-400">Active Duration</span>
                                    <span className="text-text-100 font-bold">{incident.duration}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-400">Incident Lead</span>
                                    <span className="text-text-100 font-bold">{incident.owner}</span>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-2">
                                <Button variant="secondary" className="flex-1 text-xs py-2">View Logs</Button>
                                {incident.status === 'resolved' ? (
                                    <Button variant="primary" className="flex-1 text-xs py-2">Create RCA</Button>
                                ) : (
                                    <Button variant="danger" className="flex-1 text-xs py-2">Escalate</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-text-100">Root Cause Analysis (RCA) Backlog</h3>
                    <Button variant="secondary" size="sm">Filter by Service</Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-bg-800 rounded-xl border border-border-12 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-success-500/10 flex items-center justify-center text-2xl">📝</div>
                                <div>
                                    <h4 className="font-bold text-text-100 text-lg">Memory Leak in Auth Microservice</h4>
                                    <p className="text-sm text-text-400">Resolved 2 days ago • Identified: Garbage collection misconfig</p>
                                </div>
                            </div>
                            <Button variant="outline">View Post-Mortem</Button>
                        </div>

                        <div className="p-4 bg-bg-800 rounded-xl border border-border-12 flex items-center justify-between opacity-70">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center text-2xl">📝</div>
                                <div>
                                    <h4 className="font-bold text-text-100 text-lg">Batch Job Failure (Feb 20)</h4>
                                    <p className="text-sm text-text-400">Resolved 2 weeks ago • Identified: Deadlock on table 'Orders'</p>
                                </div>
                            </div>
                            <Button variant="outline">View Post-Mortem</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
