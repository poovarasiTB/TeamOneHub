import { Card, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

export function VisitorManagement() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Visitor Management</h1>
                    <p className="text-text-400 mt-1">Kiosk sign-in, NDA signing, and host notifications</p>
                </div>
                <Button variant="primary">Launch Kiosk Mode</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-3">
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="bg-bg-800 border-b border-border-12 text-[10px] uppercase font-bold text-text-500">
                                <tr>
                                    <th className="p-4 text-left">Visitor</th>
                                    <th className="p-4 text-left">Purpose</th>
                                    <th className="p-4 text-left">Host</th>
                                    <th className="p-4 text-left">NDA</th>
                                    <th className="p-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-12">
                                <tr className="hover:bg-bg-800/20 transition-colors group">
                                    <td className="p-4">
                                        <p className="text-sm font-bold text-text-100">Mark Cuban</p>
                                        <p className="text-[10px] text-text-500">Cuban Enterprises</p>
                                    </td>
                                    <td className="p-4 text-sm text-text-400 italic">Investment Meeting</td>
                                    <td className="p-4 text-sm text-text-100">Jane Doe (CEO)</td>
                                    <td className="p-4">
                                        <Badge variant="success">✅ Signed</Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Badge variant="success">Checked In</Badge>
                                    </td>
                                </tr>
                                <tr className="hover:bg-bg-800/20 transition-colors group">
                                    <td className="p-4">
                                        <p className="text-sm font-bold text-text-100">Pizza Delivery</p>
                                        <p className="text-[10px] text-text-500">Domino's</p>
                                    </td>
                                    <td className="p-4 text-sm text-text-400 italic">Package Drop-off</td>
                                    <td className="p-4 text-sm text-text-100">Reception</td>
                                    <td className="p-4">
                                        <Badge variant="default">N/A</Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="primary" size="sm" className="text-[10px] h-7 px-3">Print Tag</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-primary-500/10 to-transparent">
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-text-400 mb-2">Active Visitors</p>
                            <p className="text-5xl font-bold text-text-100">12</p>
                            <p className="text-[10px] text-text-500 mt-4 italic">Busiest Day: Tuesday</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h4 className="font-bold text-text-100 text-sm mb-4">Quick Actions</h4>
                            <div className="space-y-2">
                                <Button variant="secondary" className="w-full text-xs py-2">Emergency Evac List</Button>
                                <Button variant="outline" className="w-full text-xs py-2">Sync with G-Calendar</Button>
                                <Button variant="outline" className="w-full text-xs py-2">Visitor Blacklist</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
