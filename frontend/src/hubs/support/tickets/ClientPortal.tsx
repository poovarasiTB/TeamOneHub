import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

export function ClientPortal() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Client Portal</h1>
                    <p className="text-text-400 mt-1">White-labeled dashboard for external stakeholders</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Email Invite</Button>
                    <Button variant="primary">Portal Settings</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h3 className="font-bold text-text-100 italic">Client View: Acme Corp</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-bg-800 rounded-xl border border-border-12">
                            <p className="text-xs text-text-400 mb-1">Open Tickets</p>
                            <p className="text-2xl font-bold text-text-100 font-mono">3 / 142</p>
                        </div>
                        <div className="p-4 bg-bg-800 rounded-xl border border-border-12">
                            <p className="text-xs text-text-400 mb-1">Pending Invoices</p>
                            <p className="text-2xl font-bold text-text-100 font-mono">$12,450.00</p>
                        </div>
                        <div className="p-4 bg-bg-800 rounded-xl border border-border-12">
                            <p className="text-xs text-text-400 mb-1">Current SLA Status</p>
                            <Badge variant="success">99.9% uptime maintained</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3 className="font-bold text-text-100">Feature Toggles</h3>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-text-100">Live Ticket Tracking</p>
                                <p className="text-xs text-text-500">Allow clients to see internal comments</p>
                            </div>
                            <div className="w-12 h-6 bg-primary-500 rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-text-100">Financial Transparency</p>
                                <p className="text-xs text-text-500">Enable invoice history and payment portal</p>
                            </div>
                            <div className="w-12 h-6 bg-primary-500 rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-text-100">Knowledge Base Access</p>
                                <p className="text-xs text-text-500">Expose documentation to client users</p>
                            </div>
                            <div className="w-12 h-6 bg-bg-500 rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute left-1"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="p-6 bg-primary-500/5 border border-primary-500/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-3xl">🧩</div>
                    <div>
                        <h4 className="font-bold text-text-100">Multi-Channel Branding</h4>
                        <p className="text-sm text-text-400">Configure custom domains (e.g. support.client.com) and CSS themes per client.</p>
                    </div>
                </div>
                <Button variant="outline">Setup Domain</Button>
            </div>
        </div>
    );
}
