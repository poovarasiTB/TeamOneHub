import { Card, CardHeader, CardContent } from '../../../components/Card';

export function CallCenterAnalytics() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-100">Call Center Analytics</h1>
                <p className="text-text-400 mt-1">Real-time KPI monitoring (AHT, FCR, CSAT)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/20">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">AHT</span>
                            <span className="text-xs text-success-400">↑ 12% Efficient</span>
                        </div>
                        <p className="text-sm text-text-400 mb-1">Avg. Handle Time</p>
                        <p className="text-3xl font-bold text-text-100">4m 12s</p>
                        <div className="mt-4 h-1 w-full bg-bg-800 rounded-full">
                            <div className="bg-primary-500 h-full w-[85%]"></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-info/10 to-transparent border-info/20">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-info uppercase tracking-widest">FCR</span>
                            <span className="text-xs text-success-400">↑ 5% Better</span>
                        </div>
                        <p className="text-sm text-text-400 mb-1">First Call Resolution</p>
                        <p className="text-3xl font-bold text-text-100">92.4%</p>
                        <div className="mt-4 h-1 w-full bg-bg-800 rounded-full">
                            <div className="bg-info h-full w-[92%]"></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-success-500/10 to-transparent border-success-500/20">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-success-400 uppercase tracking-widest">CSAT</span>
                            <span className="text-xs text-text-400">Stable</span>
                        </div>
                        <p className="text-sm text-text-400 mb-1">Customer Satisfaction</p>
                        <p className="text-3xl font-bold text-text-100">4.8 / 5.0</p>
                        <div className="mt-4 flex gap-1 items-center">
                            {['⭐', '⭐', '⭐', '⭐', '⭐'].map((s, i) => <span key={i} className="text-xs">{s}</span>)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <h3 className="font-bold text-text-100 italic">Live Operator Performance</h3>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-bg-800 border-b border-border-12 text-[10px] uppercase font-bold text-text-500">
                            <tr>
                                <th className="p-4 text-left">Operator Name</th>
                                <th className="p-4 text-center">Active Calls</th>
                                <th className="p-4 text-center">Avg. Rating</th>
                                <th className="p-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-12">
                            <tr className="hover:bg-bg-800/50 transition-colors">
                                <td className="p-4">
                                    <p className="text-sm font-bold text-text-100">Alice Johnson</p>
                                    <p className="text-[10px] text-text-500">Tier 2 Support</p>
                                </td>
                                <td className="p-4 text-center text-sm font-mono text-text-100">12</td>
                                <td className="p-4 text-center text-sm font-bold text-success-400">4.9</td>
                                <td className="p-4 text-right">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-success-400 bg-success-500/10 px-2 py-1 rounded-full border border-success-500/20">
                                        <span className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse"></span>
                                        Available
                                    </span>
                                </td>
                            </tr>
                            <tr className="hover:bg-bg-800/50 transition-colors">
                                <td className="p-4">
                                    <p className="text-sm font-bold text-text-100">Bob Smith</p>
                                    <p className="text-[10px] text-text-500">Enterprise Desk</p>
                                </td>
                                <td className="p-4 text-center text-sm font-mono text-text-100">8</td>
                                <td className="p-4 text-center text-sm font-bold text-text-100">4.6</td>
                                <td className="p-4 text-right">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-warning-400 bg-warning-500/10 px-2 py-1 rounded-full border border-warning-500/20">
                                        <span className="w-1.5 h-1.5 bg-warning-500 rounded-full"></span>
                                        On Call
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
