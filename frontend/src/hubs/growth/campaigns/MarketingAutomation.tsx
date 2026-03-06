import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

const campaigns = [
    { id: 'CAMP-01', name: 'Spring Product Launch', channel: 'Email', status: 'scheduled', reach: '5.2k', opens: '1.4k' },
    { id: 'CAMP-02', name: 'Feature Announcement v4.0', channel: 'LinkedIn', status: 'active', reach: '12k', opens: '420' },
    { id: 'CAMP-03', name: 'Webinar: SaaS Scaling', channel: 'Twitter', status: 'draft', reach: '-', opens: '-' },
];

export function MarketingAutomation() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Marketing Automation</h1>
                    <p className="text-text-400 mt-1">Design and schedule multi-channel campaigns</p>
                </div>
                <Button variant="primary">+ Create Campaign</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {campaigns.map(camp => (
                    <Card key={camp.id} className="group hover:border-primary-500/50 transition-colors">
                        <CardHeader className="pb-0 flex justify-between">
                            <Badge variant={camp.channel === 'Email' ? 'primary' : 'secondary'}>{camp.channel}</Badge>
                            <Badge variant={camp.status === 'active' ? 'success' : camp.status === 'scheduled' ? 'warning' : 'default'}>
                                {camp.status}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-6">
                            <h3 className="font-bold text-text-100 text-lg mb-4 truncate">{camp.name}</h3>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-12/50 mt-4">
                                <div>
                                    <p className="text-[10px] text-text-500 uppercase font-bold">Projected Reach</p>
                                    <p className="text-sm font-bold text-text-100">{camp.reach}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-text-500 uppercase font-bold">Engagement</p>
                                    <p className="text-sm font-bold text-text-100">{camp.opens}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 text-xs py-2">Edit Flow</Button>
                                <Button variant="secondary" size="sm" className="flex-1 text-xs py-2">Analytics</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <h3 className="font-bold text-text-100">Email Builder (Visual flow)</h3>
                </CardHeader>
                <CardContent className="p-12 bg-bg-900 rounded-xl m-6 border-2 border-dashed border-border-12 flex flex-col items-center justify-center">
                    <div className="flex gap-8 items-center mb-8">
                        <div className="p-4 bg-bg-800 border border-primary-500 rounded-xl text-center w-32 shadow-xl">
                            <p className="text-xs font-bold text-text-100">Trigger</p>
                            <p className="text-[10px] text-text-400">Signup Event</p>
                        </div>
                        <div className="w-12 h-0.5 bg-primary-500"></div>
                        <div className="p-4 bg-bg-800 border border-primary-500 rounded-xl text-center w-32 shadow-xl">
                            <p className="text-xs font-bold text-text-100">Send Email</p>
                            <p className="text-[10px] text-text-400">Welcome v2.1</p>
                        </div>
                        <div className="w-12 h-0.5 bg-border-12"></div>
                        <div className="p-4 bg-bg-800 border border-border-12 rounded-xl text-center w-32 opacity-50">
                            <p className="text-xs font-bold text-text-100 italic">Delay</p>
                            <p className="text-[10px] text-text-400">24 Hours</p>
                        </div>
                    </div>
                    <p className="text-sm text-text-500 italic">Drag and drop components to build the customer journey.</p>
                </CardContent>
            </Card>
        </div>
    );
}
