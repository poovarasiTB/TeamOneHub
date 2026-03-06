import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useGrowthStore } from '../../../store/growthStore';
import { LoadingTable } from '../../../components/Loading';

export function MeetingsCalendar() {
  const { meetings, fetchMeetings, isLoading } = useGrowthStore();

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  if (isLoading && meetings.length === 0) {
    return <LoadingTable rows={5} columns={4} />;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Strategic Sessions</h1>
          <p className="text-text-400 mt-1 italic">Calendaring, agendas, and actionable meeting outcomes</p>
        </div>
        <Button variant="primary">+ Schedule Meeting</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1 border-r border-border-12 h-fit">
          <CardHeader>
            <h3 className="text-sm font-black text-text-500 uppercase tracking-widest">Active Filters</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Strategy', 'Engineering', 'Client', 'Internal'].map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-border-12 group-hover:border-primary-500 transition-colors" />
                <span className="text-sm text-text-400 group-hover:text-text-100 transition-colors">{cat}</span>
              </label>
            ))}
            <div className="pt-4 border-t border-border-12">
              <p className="text-[10px] text-text-600 uppercase mb-4">Integrations</p>
              <Button variant="secondary" size="sm" className="w-full text-[10px] py-1">Connect G-Suite</Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {meetings.map((m) => (
            <Card key={m.id} className="hover:border-info-500/30 transition-all group overflow-hidden">
              <div className="flex">
                <div className="w-2 bg-info-500" />
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-text-100 group-hover:text-info-400 transition-colors">{m.title}</h3>
                      <p className="text-xs text-text-500 mt-1">{m.description}</p>
                    </div>
                    <Badge variant="info">{m.status}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-t border-border-12 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-bg-800 flex items-center justify-center text-[10px] text-text-400">📅</div>
                      <div>
                        <p className="text-[10px] text-text-600 uppercase font-black tracking-tighter">Timeline</p>
                        <p className="text-xs text-text-200">{new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-bg-800 flex items-center justify-center text-[10px] text-text-400">📍</div>
                      <div>
                        <p className="text-[10px] text-text-600 uppercase font-black tracking-tighter">Logistics</p>
                        <p className="text-xs text-text-200 truncate max-w-[100px]">{m.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-bg-800 flex items-center justify-center text-[10px] text-text-400">👥</div>
                      <div>
                        <p className="text-[10px] text-text-600 uppercase font-black tracking-tighter">Quorum</p>
                        <p className="text-xs text-text-200">{m.attendees.length} Attendees</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
