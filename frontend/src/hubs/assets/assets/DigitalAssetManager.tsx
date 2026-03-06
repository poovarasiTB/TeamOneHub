import { Card, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

const brandAssets = [
    { id: 'DAM-01', name: 'TeamOne Logo (Master)', version: 'v3.2', type: 'SVG', size: '42 KB' },
    { id: 'DAM-02', name: 'Corporate Presentation', version: 'v1.0', type: 'PDF', size: '12.4 MB' },
    { id: 'DAM-03', name: 'Marketing Deck Q1', version: 'v5.4', type: 'PPTX', size: '8.2 MB' },
];

export function DigitalAssetManager() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">DAM (Digital Assets)</h1>
                    <p className="text-text-400 mt-1">Version-controlled repository for brand and corporate assets</p>
                </div>
                <Button variant="primary">+ Upload New Asset</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brandAssets.map(asset => (
                    <Card key={asset.id} className="overflow-hidden group">
                        <div className="h-32 bg-bg-800 flex items-center justify-center relative border-b border-border-12">
                            <span className="text-4xl filter group-hover:scale-110 transition-transform">
                                {asset.type === 'SVG' ? '🎨' : asset.type === 'PDF' ? '📕' : '📊'}
                            </span>
                            <div className="absolute top-2 right-2">
                                <Badge variant="primary">{asset.version}</Badge>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <p className="font-bold text-text-100 truncate">{asset.name}</p>
                            <div className="flex justify-between mt-2 text-xs text-text-400">
                                <span>{asset.type} • {asset.size}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-400 font-bold cursor-pointer">Download</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardContent className="p-6">
                    <h3 className="font-bold text-text-100 mb-4">Version History (Audit)</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-bg-800/50 rounded-lg border border-border-12">
                            <div className="flex gap-4">
                                <span className="text-xs text-text-500">2026-03-01 14:20</span>
                                <p className="text-sm text-text-100">Jane Doe updated <strong>TeamOne Logo (Master)</strong> to v3.2</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-[10px] h-7">View Diff</Button>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-bg-800/50 rounded-lg border border-border-12">
                            <div className="flex gap-4">
                                <span className="text-xs text-text-500">2026-02-28 09:15</span>
                                <p className="text-sm text-text-100">Bob Smith reverted <strong>Marketing Deck Q1</strong> to v5.3</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-[10px] h-7">View Diff</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
