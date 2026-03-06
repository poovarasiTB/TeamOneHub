import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

const vendors = [
    { id: 'V-101', name: 'Global Talent Corp', submissions: 142, hires: 12, rate: '8.4%', status: 'active' },
    { id: 'V-102', name: 'Elite Tech Search', submissions: 85, hires: 15, rate: '17.6%', status: 'active' },
    { id: 'V-103', name: 'Creative Minds Agency', submissions: 45, hires: 2, rate: '4.4%', status: 'warning' },
];

export function VendorPortal() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Vendor Portal</h1>
                    <p className="text-text-400 mt-1">External recruitment agency collaboration hub</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Invite Agency</Button>
                    <Button variant="primary">Performance Report</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary-500/10 to-transparent">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-bold uppercase mb-2">Total Submissions</p>
                        <p className="text-3xl font-bold text-text-100">272</p>
                        <div className="mt-4 flex items-center gap-2 text-success-400 text-xs">
                            <span>↑ 12% from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-success-500/10 to-transparent">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-bold uppercase mb-2">Total Hires</p>
                        <p className="text-3xl font-bold text-text-100">29</p>
                        <div className="mt-4 flex items-center gap-2 text-success-400 text-xs">
                            <span>↑ 5% from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-info/10 to-transparent">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-bold uppercase mb-2">Avg. Conversion</p>
                        <p className="text-3xl font-bold text-text-100">10.6%</p>
                        <div className="mt-4 flex items-center gap-2 text-warning-400 text-xs">
                            <span>↓ 2% from last month</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <h3 className="text-xl font-bold text-text-100">Partner Agencies</h3>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-bg-800 border-b border-border-12">
                            <tr>
                                <th className="p-4 text-left text-xs font-bold text-text-400 uppercase">Agency Name</th>
                                <th className="p-4 text-center text-xs font-bold text-text-400 uppercase">Submissions</th>
                                <th className="p-4 text-center text-xs font-bold text-text-400 uppercase">Hires</th>
                                <th className="p-4 text-center text-xs font-bold text-text-400 uppercase">Conversion</th>
                                <th className="p-4 text-center text-xs font-bold text-text-400 uppercase">Status</th>
                                <th className="p-4 text-right text-xs font-bold text-text-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-12">
                            {vendors.map(vendor => (
                                <tr key={vendor.id} className="hover:bg-bg-800/50 transition-colors group">
                                    <td className="p-4">
                                        <p className="font-bold text-text-100">{vendor.name}</p>
                                        <p className="text-[10px] font-mono text-text-500">{vendor.id}</p>
                                    </td>
                                    <td className="p-4 text-center font-bold text-text-100">{vendor.submissions}</td>
                                    <td className="p-4 text-center font-bold text-text-100">{vendor.hires}</td>
                                    <td className="p-4 text-center">
                                        <div className="inline-flex items-center gap-2">
                                            <span className={`text-sm font-bold ${parseFloat(vendor.rate) > 10 ? 'text-success-400' : 'text-text-100'}`}>
                                                {vendor.rate}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Badge variant={vendor.status === 'active' ? 'success' : 'warning'}>
                                            {vendor.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="secondary" size="sm">Manage API Key</Button>
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
