import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

export function RetailTemplate() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Retail Operations</h1>
                    <p className="text-text-400 mt-1">Multi-store inventory management and PoS synchronization</p>
                </div>
                <Button variant="primary">New Inventory Scan</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-surface-800">
                    <CardHeader>
                        <h3 className="text-sm font-bold text-text-400 uppercase tracking-widest">Inventory Health</h3>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-3xl font-bold text-text-100">92% In-Stock</p>
                        <p className="text-[10px] text-error-400 mt-1 font-bold">⚠️ 8 SKUs critically low</p>
                    </CardContent>
                </Card>
                <Card className="bg-surface-800">
                    <CardHeader>
                        <h3 className="text-sm font-bold text-text-400 uppercase tracking-widest">PoS Sync Status</h3>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-3xl font-bold text-success-400">All Stores Online</p>
                        <p className="text-[10px] text-text-400 mt-1 italic">Last sync: 2 mins ago</p>
                    </CardContent>
                </Card>
                <Card className="bg-surface-800">
                    <CardHeader>
                        <h3 className="text-sm font-bold text-text-400 uppercase tracking-widest">Today's Footfall</h3>
                        <Badge variant="info">Estimated</Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-3xl font-bold text-info">1,450 Guests</p>
                        <p className="text-[10px] text-success-400 mt-1 font-bold">↑ 15% vs Yesterday</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <h3 className="font-bold text-text-100">Store Performance Heatmap</h3>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-text-400">Store #42 - Downtown</span>
                            <div className="flex items-center gap-4">
                                <div className="w-48 h-2 bg-bg-800 rounded-full overflow-hidden">
                                    <div className="bg-success-500 h-full w-[95%]"></div>
                                </div>
                                <span className="font-bold text-text-100">$12.4k</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-text-400">Store #08 - Airport</span>
                            <div className="flex items-center gap-4">
                                <div className="w-48 h-2 bg-bg-800 rounded-full overflow-hidden">
                                    <div className="bg-warning-500 h-full w-[60%]"></div>
                                </div>
                                <span className="font-bold text-text-100">$8.1k</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
