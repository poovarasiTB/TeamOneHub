import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

const candidates = [
    { id: 'CAN-001', name: 'John Doe', role: 'Senior React Dev', stage: 'Technical Interview', experience: '8 years', source: 'LinkedIn' },
    { id: 'CAN-002', name: 'Jane Smith', role: 'DevOps Architect', stage: 'Screening', experience: '12 years', source: 'Referral' },
    { id: 'CAN-003', name: 'Mike Ross', role: 'Product Designer', stage: 'Offer Sent', experience: '5 years', source: 'Hired.com' },
    { id: 'CAN-004', name: 'Rachel Zane', role: 'QA Lead', stage: 'Background Check', experience: '7 years', source: 'Internal' },
];

const stages = ['Screening', 'Technical Interview', 'HR Round', 'Offer Sent', 'Background Check'];

export function RecruitmentATS() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Recruitment ATS</h1>
                    <p className="text-text-400 mt-1">Manage candidate pipeline and hiring workflow</p>
                </div>
                <Button variant="primary">+ Add Candidate</Button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
                {stages.map(stage => (
                    <div key={stage} className="min-w-[300px] flex-shrink-0">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-bold text-text-400 uppercase tracking-wider text-xs">{stage}</h3>
                            <Badge variant="default">{candidates.filter(c => c.stage === stage).length}</Badge>
                        </div>
                        <div className="space-y-4 min-h-[500px] bg-bg-800/30 rounded-xl p-3 border border-dashed border-border-12">
                            {candidates.filter(c => c.stage === stage).map(candidate => (
                                <Card key={candidate.id} className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-mono text-primary-400">{candidate.id}</span>
                                            <Badge variant="secondary">{candidate.source}</Badge>
                                        </div>
                                        <p className="text-text-100 font-bold">{candidate.name}</p>
                                        <p className="text-xs text-text-400 mb-4">{candidate.role}</p>
                                        <div className="flex justify-between items-center pt-3 border-t border-border-12/50">
                                            <span className="text-[10px] text-text-500">{candidate.experience} exp</span>
                                            <Button variant="secondary" size="sm" className="text-[10px] px-2 py-1 h-auto">Details</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
