import { useEffect } from 'react';
import { Card, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useAssetStore } from '../../../store/assetStore';
import { LoadingTable } from '../../../components/Loading';

export function MaintenanceTracker() {
    const { maintenanceRecords, fetchMaintenance, isLoading } = useAssetStore();

    useEffect(() => {
        fetchMaintenance();
    }, [fetchMaintenance]);

    if (isLoading && maintenanceRecords.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-text-100">Asset Maintenance</h1>
                <LoadingTable rows={5} columns={6} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Maintenance Logs</h1>
                    <p className="text-text-400 mt-1">Schedule and track hardware maintenance history</p>
                </div>
                <Button variant="primary">+ Schedule Maintenance</Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-bg-800/50 text-text-400 uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="py-4 px-6 text-left">Asset</th>
                                    <th className="py-4 px-6 text-left">Type</th>
                                    <th className="py-4 px-6 text-left">Scheduled Date</th>
                                    <th className="py-4 px-6 text-left">Vendor</th>
                                    <th className="py-4 px-6 text-left">Status</th>
                                    <th className="py-4 px-6 text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-12 text-sm text-text-100">
                                {maintenanceRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-bg-800/30 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="font-semibold">{record.assetName || 'Unknown Asset'}</p>
                                            <p className="text-xs text-text-400 truncate max-w-xs">{record.description}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge variant="info" size="sm">{record.maintenanceType}</Badge>
                                        </td>
                                        <td className="py-4 px-6 text-text-400">
                                            {new Date(record.scheduledDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-text-400">{record.vendor}</td>
                                        <td className="py-4 px-6">
                                            <Badge
                                                variant={
                                                    record.status === 'completed' ? 'success' :
                                                        record.status === 'in-progress' ? 'warning' :
                                                            record.status === 'scheduled' ? 'info' : 'default'
                                                }
                                                size="sm"
                                            >
                                                {record.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-right font-mono">
                                            ${record.cost.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {maintenanceRecords.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-text-400 italic">
                                            No maintenance records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
