import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';

export function FinOpsDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">FinOps Dashboard</h1>
                    <p className="text-text-400 mt-1">Cloud cost monitoring and optimization (AWS/Azure/GCP)</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Sync Multi-Cloud</Button>
                    <Button variant="primary">Optimization Report</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-bg-800 border-border-12">
                    <CardContent className="p-4">
                        <p className="text-xs text-text-400 uppercase font-bold tracking-wider">Total Monthly Spend</p>
                        <p className="text-2xl font-bold text-text-100">$4,250.00</p>
                        <span className="text-[10px] text-error-400 font-bold">↑ 8% from prev month</span>
                    </CardContent>
                </Card>
                <Card className="bg-bg-800 border-border-12">
                    <CardContent className="p-4">
                        <p className="text-xs text-text-400 uppercase font-bold tracking-wider">Projected Savings</p>
                        <p className="text-2xl font-bold text-success-400">$840.00</p>
                        <span className="text-[10px] text-success-400 font-bold">Unused Reserved Instances</span>
                    </CardContent>
                </Card>
                <Card className="bg-bg-800 border-border-12">
                    <CardContent className="p-4">
                        <p className="text-xs text-text-400 uppercase font-bold tracking-wider">Zombie Resources</p>
                        <p className="text-2xl font-bold text-warning-400">12</p>
                        <span className="text-[10px] text-text-500">Idle EC2/RDS instances</span>
                    </CardContent>
                </Card>
                <Card className="bg-bg-800 border-border-12">
                    <CardContent className="p-4">
                        <p className="text-xs text-text-400 uppercase font-bold tracking-wider">Cloud Footprint</p>
                        <p className="text-2xl font-bold text-info">AWS / Azure</p>
                        <span className="text-[10px] text-text-500">2 Connected Providers</span>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h3 className="font-bold text-text-100 italic">Zombie Alerting 🧟</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-bg-800 rounded-lg border border-border-12 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-text-100">EC2 i-055a82... (t3.large)</p>
                                <p className="text-[10px] text-text-500">Idle for 14 days • Cost: $48/mo</p>
                            </div>
                            <Button variant="danger" size="sm">Terminate</Button>
                        </div>
                        <div className="p-3 bg-bg-800 rounded-lg border border-border-12 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-text-100">RDS db-prod-read-replica</p>
                                <p className="text-[10px] text-text-500">CPU &lt; 1% for 30 days • Cost: $120/mo</p>
                            </div>
                            <Button variant="warning" size="sm">Resize</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3 className="font-bold text-text-100">Spend by Project</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-text-400">Project Alpha (PRJ-001)</span>
                                <span className="text-text-100 font-bold">$1,850</span>
                            </div>
                            <div className="w-full bg-bg-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary-500 h-full w-[60%]"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-text-400">Hub & Spoke Core (PRJ-002)</span>
                                <span className="text-text-100 font-bold">$1,200</span>
                            </div>
                            <div className="w-full bg-bg-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-info h-full w-[40%]"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
