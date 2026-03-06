import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useAssetStore } from '../../store/assetStore';
import { Link } from 'react-router-dom';

export function AssetsDashboard() {
    const { assets, fetchAssets, isLoading } = useAssetStore();

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    if (isLoading && assets.length === 0) {
        return <div className="p-12 text-center text-text-400">Loading dashboard...</div>;
    }

    const stats = {
        hardware: assets.filter(a => a.type === 'hardware').length,
        software: assets.filter(a => a.type === 'software').length,
        cloud: assets.filter(a => a.type === 'cloud').length,
        digital: assets.filter(a => a.type === 'digital').length,
        total: assets.length
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Assets Overview</h1>
                    <p className="text-text-400 mt-1">Lifecycle management for all company resources</p>
                </div>
                <Link to="/assets/inventory">
                    <Button variant="primary">Manage Inventory</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-info/10 to-transparent border-info/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 mb-1">Hardware</p>
                        <p className="text-3xl font-bold text-info">{stats.hardware}</p>
                        <div className="mt-4 text-xs text-text-500 font-medium">Laptops, Servers, Mobiles</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 mb-1">Software</p>
                        <p className="text-3xl font-bold text-primary-400">{stats.software}</p>
                        <div className="mt-4 text-xs text-text-500 font-medium">Licenses & Subscriptions</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-success/10 to-transparent border-success/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 mb-1">Cloud Services</p>
                        <p className="text-3xl font-bold text-success">{stats.cloud}</p>
                        <div className="mt-4 text-xs text-text-500 font-medium">AWS, Azure, GCP Resources</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-warning/10 to-transparent border-warning/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 mb-1">Digital Assets</p>
                        <p className="text-3xl font-bold text-warning">{stats.digital}</p>
                        <div className="mt-4 text-xs text-text-500 font-medium">Domains & SSL Certificates</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-text-100">Asset Health & Distribution</h2>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center">
                        <div className="flex items-end gap-12 h-40">
                            <div className="w-16 bg-info rounded-t-xl" style={{ height: '70%' }}></div>
                            <div className="w-16 bg-primary-500 rounded-t-xl" style={{ height: '45%' }}></div>
                            <div className="w-16 bg-success rounded-t-xl" style={{ height: '30%' }}></div>
                            <div className="w-16 bg-warning rounded-t-xl" style={{ height: '20%' }}></div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-text-100">Critical Expiries</h2>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border-12">
                            <div className="p-4 flex justify-between items-center hover:bg-bg-800/50 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-text-100 italic">Microsoft 365 License</p>
                                    <p className="text-xs text-text-400">Expires in 12 days</p>
                                </div>
                                <Badge variant="error">Critical</Badge>
                            </div>
                            <div className="p-4 flex justify-between items-center hover:bg-bg-800/50 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-text-100">teamone.io Domain</p>
                                    <p className="text-xs text-text-400">Expires in 28 days</p>
                                </div>
                                <Badge variant="warning">Soon</Badge>
                            </div>
                            <div className="p-4 flex justify-between items-center hover:bg-bg-800/50 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-text-100">MacBook Pro - Warranty</p>
                                    <p className="text-xs text-text-400">Expires in 45 days</p>
                                </div>
                                <Badge variant="info">Upcoming</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
