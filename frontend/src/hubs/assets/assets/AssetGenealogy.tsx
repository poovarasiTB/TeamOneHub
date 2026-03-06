import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';

const assetTree = {
    id: 'L-748',
    name: 'Dell XPS 15 (Workstation)',
    type: 'Laptop',
    children: [
        { id: 'C-01', name: '32GB DDR4 RAM', type: 'Component', health: 'Good' },
        { id: 'C-02', name: '1TB NVMe SSD', type: 'Component', health: 'Critical' },
        { id: 'C-03', name: '97Wh Battery', type: 'Component', health: 'Wear: 12%' },
        { id: 'P-01', name: 'Laptop Charger 130W', type: 'Peripheral', health: 'Good' }
    ]
};

export function AssetGenealogy() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-100">Asset Genealogy</h1>
                <p className="text-text-400 mt-1">Visual Parent/Child relationship mapping for inventory</p>
            </div>

            <div className="flex justify-center p-12 bg-bg-800/20 rounded-2xl border border-border-12 relative overflow-hidden">
                <div className="z-10 flex flex-col items-center">
                    {/* Parent Node */}
                    <div className="w-80 p-5 bg-primary-500/10 border-2 border-primary-500 rounded-xl flex flex-col items-center shadow-xl">
                        <span className="text-4xl mb-3">💻</span>
                        <p className="font-bold text-text-100">{assetTree.name}</p>
                        <Badge variant="primary">{assetTree.id}</Badge>
                    </div>

                    {/* Connector Line */}
                    <div className="w-0.5 h-12 bg-border-12 my-2"></div>

                    {/* Children Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 relative">
                        {/* Horizontal branch line */}
                        <div className="absolute top-[-24px] left-[15%] right-[15%] h-0.5 bg-border-12"></div>

                        {assetTree.children.map(child => (
                            <div key={child.id} className="flex flex-col items-center group">
                                {/* Vertical branch line */}
                                <div className="w-0.5 h-6 bg-border-12"></div>
                                <Card className="w-full hover:border-primary-400 transition-colors cursor-pointer text-center">
                                    <CardContent className="p-3">
                                        <p className="text-xs font-bold text-text-100">{child.name}</p>
                                        <p className="text-[10px] text-text-500 mt-1">{child.type}</p>
                                        <Badge
                                            variant={child.health === 'Good' ? 'success' : child.health === 'Critical' ? 'error' : 'warning'}
                                            className="mt-2 text-[8px]"
                                        >
                                            {child.health}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Background Decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            </div>
        </div>
    );
}
