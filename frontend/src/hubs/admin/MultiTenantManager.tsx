import { Card, CardHeader, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

const tenants = [
    { id: 'T-001', name: 'Acme Corp (Enterprise)', users: 1420, status: 'healthy', region: 'us-east-1' },
    { id: 'T-002', name: 'Initech (Standard)', users: 45, status: 'warning', region: 'eu-west-1' },
    { id: 'T-003', name: 'Stark Industries (Premium)', users: 890, status: 'healthy', region: 'us-east-1' },
];

export function MultiTenantManager() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Multi-Tenant Manager</h1>
                    <p className="text-text-400 mt-1">Isolate and manage customer organizations</p>
                </div>
                <Button variant="primary">+ Provision New Tenant</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tenants.map(tenant => (
                    <Card key={tenant.id} className="relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full ${tenant.status === 'healthy' ? 'bg-success-500' : 'bg-warning-500'}`}></div>
                        <CardHeader className="pb-0">
                            <div className="flex justify-between items-start">
                                <Badge variant="primary">{tenant.id}</Badge>
                                <Badge variant={tenant.status === 'healthy' ? 'success' : 'warning'}>{tenant.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <h3 className="font-bold text-text-100 text-lg mb-2">{tenant.name}</h3>
                            <div className="space-y-3 mt-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-400">Total Users</span>
                                    <span className="font-bold text-text-100">{tenant.users}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-400">Region</span>
                                    <span className="font-mono text-text-100">{tenant.region}</span>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-2">
                                <Button variant="secondary" className="flex-1 text-xs py-2">Manage</Button>
                                <Button variant="outline" className="flex-1 text-xs py-2">Stats</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-bg-800/50 border-dashed border-2 border-border-12">
                <CardContent className="p-12 text-center">
                    <div className="text-4xl mb-4 text-text-500">🏢</div>
                    <h3 className="text-xl font-bold text-text-100">Tenant Isolation Logic</h3>
                    <p className="text-text-500 max-w-lg mx-auto mt-2">
                        All tenants are physically isolated at the database schema level.
                        Zero cross-tenant data leakage guaranteed by the Hub & Spoke architecture.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
