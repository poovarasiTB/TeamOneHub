import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useAssetStore } from '../../../store/assetStore';
import { LoadingTable } from '../../../components/Loading';

export function DomainList() {
    const { domains, fetchDomains, isLoading } = useAssetStore();

    useEffect(() => {
        fetchDomains();
    }, [fetchDomains]);

    if (isLoading && domains.length === 0) {
        return <LoadingTable rows={5} columns={4} />;
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-3xl font-bold text-text-100 font-serif italic">Domain Portfolio</h1>
                    <p className="text-text-400 mt-1 italic">Centralized management of digital web identities</p>
                </div>
                <Button variant="primary">+ Register Domain</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {domains.map((d) => (
                    <Card key={d.id} className={`border-l-4 ${d.status === 'active' ? 'border-success' : 'border-warning'} shadow-lg hover:-translate-y-1 transition-transform`}>
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-black text-text-100">{d.name}</span>
                                <Badge variant={d.status === 'active' ? 'success' : 'warning'}>{d.status}</Badge>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-text-500 uppercase tracking-widest mb-1">Registrar</p>
                                    <p className="text-sm font-bold text-text-200">{d.registrar}</p>
                                </div>
                                <div className="pt-4 border-t border-border-12 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] text-text-500 uppercase">Expiry Date</p>
                                        <p className={`text-xs font-bold ${d.status === 'expiring-soon' ? 'text-error' : 'text-text-400'}`}>{d.expiryDate}</p>
                                    </div>
                                    {d.autoRenew && (
                                        <Badge variant="info" className="text-[8px] animate-pulse">Auto-Renew</Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
