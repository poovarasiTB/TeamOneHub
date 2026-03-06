import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useAssetStore } from '../../../store/assetStore';
import { LoadingTable } from '../../../components/Loading';

export function LicenseList() {
    const { licenses, fetchLicenses, isLoading } = useAssetStore();

    useEffect(() => {
        fetchLicenses();
    }, [fetchLicenses]);

    if (isLoading && licenses.length === 0) {
        return <LoadingTable rows={5} columns={4} />;
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-3xl font-bold text-text-100 font-serif italic">Software Entitlements</h1>
                    <p className="text-text-400 mt-1 italic">Track subscriptions, perpetual licenses, and seat compliance</p>
                </div>
                <Button variant="primary">+ Register License</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {licenses.map((license) => (
                    <Card key={license.id} className="border-primary-500/10 hover:border-primary-500/30 transition-all shadow-xl hover:shadow-primary-500/5 group">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-text-100 group-hover:text-primary-400 transition-colors">{license.name}</h3>
                                <Badge variant={license.complianceStatus === 'compliant' ? 'success' : 'error'} className="text-[9px] uppercase">
                                    {license.complianceStatus}
                                </Badge>
                            </div>
                            <p className="text-xs text-text-500">{license.publisher}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-bg-900 rounded-xl p-4 border border-border-12">
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-xs text-text-500 uppercase font-black">Utilization</p>
                                    <p className="text-sm font-bold text-text-100">{license.usedSeats} / {license.totalSeats}</p>
                                </div>
                                <div className="w-full bg-bg-700 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${license.usedSeats / license.totalSeats > 0.9 ? 'bg-error' : 'bg-primary-500'}`}
                                        style={{ width: `${(license.usedSeats / license.totalSeats) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between text-[10px] text-text-400 italic">
                                <span>Renews: {license.expiryDate}</span>
                                <span className="uppercase">{license.type}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
