import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';

const resources = [
    { id: 1, name: 'Alice Johnson', role: 'Frontend Developer', allocation: [80, 90, 100, 40, 20], skills: ['React', 'TypeScript'] },
    { id: 2, name: 'Bob Smith', role: 'Backend Developer', allocation: [100, 100, 100, 100, 100], skills: ['Node.js', 'PostgreSQL'] },
    { id: 3, name: 'Charlie Davis', role: 'UI/UX Designer', allocation: [30, 40, 50, 60, 70], skills: ['Figma', 'CSS'] },
    { id: 4, name: 'Diana Prince', role: 'Project Manager', allocation: [50, 50, 50, 50, 50], skills: ['Agile', 'Jira'] },
    { id: 5, name: 'Edward Norton', role: 'DevOps Engineer', allocation: [90, 80, 70, 60, 50], skills: ['K8s', 'Docker'] },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function ResourceHeatmap() {
    const getHeatColor = (value: number) => {
        if (value >= 100) return 'bg-error-500/80 text-white';
        if (value >= 80) return 'bg-warning-500/80 text-white';
        if (value >= 50) return 'bg-primary-500/80 text-white';
        return 'bg-success-500/80 text-white';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Resource Utilization</h1>
                    <p className="text-text-400 mt-1">Global view of team bandwidth and burnout risk</p>
                </div>
                <div className="flex gap-4 items-center text-sm">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-success-500/80"></span> &lt; 50%</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary-500/80"></span> 50-80%</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-warning-500/80"></span> 80-100%</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-error-500/80"></span> Overloaded</div>
                </div>
            </div>

            <Card>
                <CardContent className="p-0 overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-bg-800 border-b border-border-12">
                                <th className="p-4 text-left text-sm font-bold text-text-400 uppercase tracking-wider w-64">Resource</th>
                                {days.map(day => (
                                    <th key={day} className="p-4 text-center text-sm font-bold text-text-400 uppercase tracking-wider">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-12">
                            {resources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-bg-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-info flex items-center justify-center text-white font-bold text-lg">
                                                {resource.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-100">{resource.name}</p>
                                                <p className="text-xs text-text-400">{resource.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {resource.allocation.map((val, idx) => (
                                        <td key={idx} className="p-2">
                                            <div className={`h-12 flex items-center justify-center rounded-lg font-bold shadow-inner ${getHeatColor(val)}`}>
                                                {val}%
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-bold text-text-100">Bench Matrix</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {resources.filter(r => Math.min(...r.allocation) < 50).map(r => (
                                <div key={r.id} className="flex justify-between items-center p-3 bg-bg-800 rounded-lg border border-border-12">
                                    <div>
                                        <p className="font-bold text-text-100">{r.name}</p>
                                        <div className="flex gap-2 mt-1">
                                            {r.skills.map(skill => (
                                                <Badge key={skill} variant="default">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Badge variant="success">Available Now</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-bold text-text-100">Burnout Risk</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {resources.filter(r => Math.max(...r.allocation) >= 100).map(r => (
                                <div key={r.id} className="flex justify-between items-center p-3 bg-bg-800 rounded-lg border border-border-12">
                                    <div>
                                        <p className="font-bold text-text-100">{r.name}</p>
                                        <p className="text-xs text-error-400 mt-1">Critical Load Detected</p>
                                    </div>
                                    <Badge variant="error">High Risk</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
