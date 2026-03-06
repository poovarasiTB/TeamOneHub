import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

const shifts = [
    { id: 1, name: 'Morning Shift', time: '06:00 - 14:00', employees: ['Alice Johnson', 'Bob Smith'], coverage: '90%' },
    { id: 2, name: 'Afternoon Shift', time: '14:00 - 22:00', employees: ['Charlie Davis', 'Diana Prince'], coverage: '85%' },
    { id: 3, name: 'Night Shift', time: '22:00 - 06:00', employees: ['Edward Norton'], coverage: '50%' },
];

export function ShiftRostering() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Shift Rostering</h1>
                    <p className="text-text-400 mt-1">AI-optimized scheduling for 24/7 operations</p>
                </div>
                <Button variant="primary">Generate AI Roster</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {shifts.map(shift => (
                    <Card key={shift.id}>
                        <CardHeader className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-text-100">{shift.name}</h3>
                                <p className="text-xs text-text-400 font-mono mt-1">{shift.time}</p>
                            </div>
                            <Badge variant={parseFloat(shift.coverage) < 70 ? 'error' : 'success'}>
                                {shift.coverage} Coverage
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-text-500 uppercase tracking-wider">Assigned Team</p>
                                {shift.employees.map(emp => (
                                    <div key={emp} className="flex items-center gap-3 p-2 bg-bg-800 rounded-lg border border-border-12">
                                        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xs">
                                            {emp[0]}
                                        </div>
                                        <span className="text-sm text-text-100">{emp}</span>
                                    </div>
                                ))}
                                {parseFloat(shift.coverage) < 70 && (
                                    <div className="p-3 bg-error-500/10 border border-error-500/20 rounded-lg">
                                        <p className="text-xs text-error-400 font-bold">⚠️ Staff Shortage Detected</p>
                                        <p className="text-[10px] text-error-400/80 mt-1">AI Suggestion: Reallocate 1 resource from Morning Shift.</p>
                                    </div>
                                )}
                            </div>
                            <Button variant="secondary" className="w-full mt-6 text-xs">Manual Reassign</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
