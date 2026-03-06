import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useAssetStore } from '../../../store/assetStore';
import { LoadingTable } from '../../../components/Loading';

export function MaintenanceList() {
    const { maintenanceRecords, fetchMaintenance, isLoading } = useAssetStore();

    useEffect(() => {
        fetchMaintenance();
    }, [fetchMaintenance]);

    if (isLoading && maintenanceRecords.length === 0) {
        return <LoadingTable rows={8} columns={4} />;
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-3xl font-bold text-text-100 font-serif italic">Maintenance Registry</h1>
                    <p className="text-text-400 mt-1 italic">Immutable history of resource servicing and repairs</p>
                </div>
                <Button variant="primary">Log Event</Button>
            </div>

            <Card className="shadow-2xl shadow-black/20 overflow-hidden border-none bg-surface-800">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-bg-800 border-b border-border-12">
                                <tr>
                                    <th className="px-6 py-5 font-semibold text-text-100 italic">Scheduled / Logged</th>
                                    <th className="px-6 py-5 font-semibold text-text-100 italic">Asset Impacted</th>
                                    <th className="px-6 py-5 font-semibold text-text-100 italic">Service Details</th>
                                    <th className="px-6 py-5 font-semibold text-text-100 italic text-center">Operational Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-12">
                                {maintenanceRecords.map((m) => (
                                    <tr key={m.id} className="hover:bg-bg-700/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="text-text-100 font-bold">{m.scheduledDate}</p>
                                            <p className="text-[10px] text-text-500 uppercase">Provider: {m.vendor}</p>
                                        </td>
                                        <td className="px-6 py-5 text-primary-400 font-medium">
                                            {m.assetName}
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-text-100 text-sm leading-snug">{m.description}</p>
                                            <p className="text-[10px] text-text-500 mt-1">Cost incurred: ${m.cost}</p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <Badge variant={m.status === 'completed' ? 'success' : 'warning'}>
                                                {m.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
