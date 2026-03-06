import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

export function ManufacturingTemplate() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Factory Dashboard (OEE)</h1>
                    <p className="text-text-400 mt-1">Lean manufacturing and real-time shop floor monitoring</p>
                </div>
                <Badge variant="success">Production Line 1: Active</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-bg-800 border-border-12 p-6 text-center">
                    <p className="text-xs text-text-400 uppercase font-bold">OEE Score</p>
                    <p className="text-4xl font-bold text-success-500">84.2%</p>
                </Card>
                <Card className="bg-bg-800 border-border-12 p-6 text-center">
                    <p className="text-xs text-text-400 uppercase font-bold">Cycle Time</p>
                    <p className="text-4xl font-bold text-text-100">42s</p>
                </Card>
                <Card className="bg-bg-800 border-border-12 p-6 text-center">
                    <p className="text-xs text-text-400 uppercase font-bold">Defect Rate</p>
                    <p className="text-4xl font-bold text-error-400">0.8%</p>
                </Card>
                <Card className="bg-bg-800 border-border-12 p-6 text-center">
                    <p className="text-xs text-text-400 uppercase font-bold">Units Produced</p>
                    <p className="text-4xl font-bold text-info">1,240</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h3 className="font-bold text-text-100 italic">Maintenance Schedule (Preventive)</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-bg-800 rounded-lg">
                                <div>
                                    <p className="text-sm font-bold text-text-100">Hydraulic Press A-1</p>
                                    <p className="text-[10px] text-text-500">Oil change due in 48 operating hours</p>
                                </div>
                                <Button variant="outline" size="sm">Schedule</Button>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-bg-800 rounded-lg">
                                <div>
                                    <p className="text-sm font-bold text-text-100">Conveyor Belt B-4</p>
                                    <p className="text-[10px] text-text-500">Last inspected: 2026-03-01</p>
                                </div>
                                <Badge variant="success">Healthy</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3 className="font-bold text-text-100">Shift Handover (Gemba)</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-bg-900 border border-border-12 rounded-xl h-48 flex items-center justify-center italic text-text-500 text-sm text-center">
                            Add Shift Notes / Voice Memo Transcription...
                        </div>
                        <Button variant="primary" className="w-full mt-4">Confirm Handover</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
