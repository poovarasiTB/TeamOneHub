import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { LoadingTable } from '../../../components/Loading';
import { useAssetStore } from '../../../store/assetStore';

export function CloudManager() {
    const { assets, fetchAssets, isLoading } = useAssetStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAssets({ type: 'cloud' });
    }, [fetchAssets]);

    const cloudAssets = assets.filter(a => a.type === 'cloud');
    const filteredAssets = cloudAssets.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading && cloudAssets.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-100">Cloud Assets</h1>
                        <p className="text-text-400 mt-1">AWS, Azure & Google Cloud resources</p>
                    </div>
                    <Button variant="primary">+ Connect Cloud</Button>
                </div>
                <LoadingTable rows={5} columns={6} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Cloud Assets</h1>
                    <p className="text-text-400 mt-1">Manage your cloud infrastructure resources</p>
                </div>
                <Button variant="primary">+ Connect Cloud</Button>
            </div>

            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search cloud resources (name, region, service)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-bg-800/50 text-text-400 uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="py-4 px-6 text-left">Resource Name</th>
                                    <th className="py-4 px-6 text-left">Service/Type</th>
                                    <th className="py-4 px-6 text-left">Region/Location</th>
                                    <th className="py-4 px-6 text-left">Status</th>
                                    <th className="py-4 px-6 text-left">Cost (Est. Monthly)</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-12 text-sm">
                                {filteredAssets.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-bg-800/30 transition-colors">
                                        <td className="py-4 px-6 font-medium text-text-100">{asset.name}</td>
                                        <td className="py-4 px-6">
                                            <Badge variant="info" size="sm" className="bg-info/10 text-info border-info/20">
                                                {asset.category || 'Cloud Resource'}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-text-400">{asset.location || 'Global'}</td>
                                        <td className="py-4 px-6">
                                            <Badge variant={asset.status === 'active' ? 'success' : 'default'} size="sm">
                                                {asset.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-text-100">
                                            ${asset.purchaseCost ? asset.purchaseCost.toFixed(2) : '0.00'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="text-primary-400 hover:text-primary-300 font-medium">Verify →</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAssets.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-text-400 italic">
                                            No cloud assets found. Link your AWS/Azure/GCP accounts to sync resources.
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
