import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

const subscriptions = [
    { id: 'SUB-001', client: 'Acme Corp', service: 'SaaS Platform Support', amount: '$500.00', frequency: 'Monthly', nextBilling: '2026-04-01', status: 'active' },
    { id: 'SUB-002', client: 'Initech', service: 'Managed IT Services', amount: '$2,500.00', frequency: 'Quarterly', nextBilling: '2026-06-15', status: 'active' },
    { id: 'SUB-003', client: 'Stark Ind.', service: 'Custom Dev Retainer', amount: '$10,000.00', frequency: 'Monthly', nextBilling: '2026-04-10', status: 'warning' },
];

export function SubscriptionBilling() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Subscription Billing</h1>
                    <p className="text-text-400 mt-1">Manage recurring revenue and automated retainer invoicing</p>
                </div>
                <Button variant="primary">+ New Subscription</Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-bg-800 border-b border-border-12">
                            <tr>
                                <th className="p-4 text-left text-xs font-bold text-text-400 uppercase">Client / Service</th>
                                <th className="p-4 text-center text-xs font-bold text-text-400 uppercase">Amount</th>
                                <th className="p-4 text-center text-xs font-bold text-text-400 uppercase">Frequency</th>
                                <th className="p-4 text-center text-xs font-bold text-text-400 uppercase">Next Billing</th>
                                <th className="p-4 text-center text-xs font-bold text-text-400 uppercase">Status</th>
                                <th className="p-4 text-right text-xs font-bold text-text-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-12">
                            {subscriptions.map(sub => (
                                <tr key={sub.id} className="hover:bg-bg-800/50 transition-colors">
                                    <td className="p-4">
                                        <p className="text-sm font-bold text-text-100">{sub.client}</p>
                                        <p className="text-xs text-text-400">{sub.service}</p>
                                    </td>
                                    <td className="p-4 text-center font-bold text-text-100">{sub.amount}</td>
                                    <td className="p-4 text-center">
                                        <Badge variant="default">{sub.frequency}</Badge>
                                    </td>
                                    <td className="p-4 text-center font-mono text-xs text-text-300">{sub.nextBilling}</td>
                                    <td className="p-4 text-center">
                                        <Badge variant={sub.status === 'active' ? 'success' : 'warning'}>
                                            {sub.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="secondary" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">History</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-info/5 border-info/20">
                    <CardHeader>
                        <h3 className="font-bold text-text-100">MRR (Monthly Recurring Revenue)</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-info">$14,500.00</p>
                        <p className="text-xs text-info/70 mt-2">Projection: $18k by Q3 based on current pipe.</p>
                    </CardContent>
                </Card>
                <Card className="bg-success-500/5 border-success-500/20">
                    <CardHeader>
                        <h3 className="font-bold text-text-100">Churn Rate</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-success-500">1.2%</p>
                        <p className="text-xs text-success-500/70 mt-2">Industry benchmark: 3-5%. Performance is Excellent.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
