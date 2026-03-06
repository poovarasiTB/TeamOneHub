import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

export function MeetingIntelligence() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Meeting Intelligence</h1>
                    <p className="text-text-400 mt-1">AI-powered transcription and automated action item extraction</p>
                </div>
                <Button variant="primary">🎙️ Start Live Transcription</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex justify-between items-center">
                        <h3 className="font-bold text-text-100">Live Transcript: Daily Standup</h3>
                        <Badge variant="success">Recording...</Badge>
                    </CardHeader>
                    <CardContent className="h-96 overflow-y-auto space-y-4 p-6 bg-bg-900/50 flex flex-col-reverse">
                        <div className="p-3 bg-bg-800 rounded-lg border border-border-12 self-start max-w-[80%] animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-[10px] font-bold text-primary-400 mb-1">Alice Johnson (09:42)</p>
                            <p className="text-sm text-text-100">I've finished the Gantt chart implementation. Moving on to the People Hub features now.</p>
                        </div>
                        <div className="p-3 bg-bg-800 rounded-lg border border-border-12 self-end max-w-[80%]">
                            <p className="text-[10px] font-bold text-info mb-1">Bob Smith (09:41)</p>
                            <p className="text-sm text-text-100">Great, I'll take care of the database migrations for the new entities.</p>
                        </div>
                        <div className="p-3 bg-bg-800 rounded-lg border border-border-12 self-start max-w-[80%] opacity-50">
                            <p className="text-[10px] font-bold text-primary-400 mb-1">Alice Johnson (09:40)</p>
                            <p className="text-sm text-text-100">Starting the recording now for today's standup.</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <h3 className="font-bold text-text-100">AI Summary</h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-primary-500/5 border border-primary-500/20 rounded-xl">
                                <p className="text-xs font-bold text-primary-400 uppercase mb-2">Key Discussion</p>
                                <p className="text-sm text-text-100">Team status update on Work Hub completion and People Hub kick-off.</p>
                            </div>
                            <div className="p-4 bg-info/5 border border-info/20 rounded-xl">
                                <p className="text-xs font-bold text-info uppercase mb-2">Detected Action Items</p>
                                <ul className="space-y-2 mt-2">
                                    <li className="text-xs text-text-300 flex items-start gap-2">
                                        <input type="checkbox" className="mt-0.5 rounded border-border-12 bg-bg-800 text-primary-500" readOnly checked />
                                        <span>Implement Gantt chart (Alice)</span>
                                    </li>
                                    <li className="text-xs text-text-300 flex items-start gap-2">
                                        <input type="checkbox" className="mt-0.5 rounded border-border-12 bg-bg-800 text-primary-500" />
                                        <span>Run DB migrations (Bob)</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-bg-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-border-12">
                                <span className="text-2xl">🤖</span>
                            </div>
                            <h4 className="font-bold text-text-100 text-sm">Meeting Score</h4>
                            <p className="text-2xl font-bold text-success-500 mt-1">94% Efficient</p>
                            <p className="text-[10px] text-text-500 mt-2 italic">Low tangent detection; clear objective maintained.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
