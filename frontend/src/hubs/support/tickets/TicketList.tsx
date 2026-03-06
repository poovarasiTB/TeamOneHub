import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useSupportStore } from '../../../store/supportStore';
import { LoadingTable } from '../../../components/Loading';

export function TicketList() {
  const navigate = useNavigate();
  const { tickets, fetchTickets, isLoading } = useSupportStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  if (isLoading && tickets.length === 0) {
    return <LoadingTable rows={5} columns={6} />;
  }

  const filtered = tickets.filter(t =>
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Service Desk</h1>
          <p className="text-text-400 mt-1 italic">Resolution queues and SLA performance monitoring</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/support/tickets/new')}>+ Raise Ticket</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-bg-800/80 shadow-xl border-error-500/20">
          <CardContent className="p-6">
            <p className="text-xs text-text-500 font-black uppercase tracking-widest">Breach Risk</p>
            <h3 className="text-3xl font-bold text-error mt-2">04</h3>
            <p className="text-[10px] text-error mt-1 italic">Tickets exceeding 90% SLA window</p>
          </CardContent>
        </Card>
        <Card className="bg-bg-800/80 shadow-xl border-warning-500/20">
          <CardContent className="p-6">
            <p className="text-xs text-text-500 font-black uppercase tracking-widest">Active Resolution</p>
            <h3 className="text-3xl font-bold text-warning mt-2">{tickets.filter(t => t.status === 'in-progress').length}</h3>
            <p className="text-[10px] text-warning mt-1 italic">Currently assigned items</p>
          </CardContent>
        </Card>
        <Card className="bg-bg-800/80 shadow-xl border-success-500/20">
          <CardContent className="p-6">
            <p className="text-xs text-text-500 font-black uppercase tracking-widest">Resolved Today</p>
            <h3 className="text-3xl font-bold text-success mt-2">12</h3>
            <p className="text-[10px] text-success mt-1 italic">94% First-call resolution rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-bg-800/50 border-primary-500/10">
        <CardContent className="p-4 flex gap-4">
          <input
            type="text"
            placeholder="Search tickets by ID, subject or requester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-bg-900 border border-border-12 rounded-xl px-4 py-2 text-text-100 focus:ring-2 focus:ring-primary-500"
          />
        </CardContent>
      </Card>

      <Card className="shadow-2xl shadow-black/20 overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-800 border-b border-border-12">
              <tr>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Reference</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Subject / Category</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Outcome Status</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Urgency</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-right">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-12">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-bg-700/30 transition-colors cursor-pointer group" onClick={() => navigate(`/support/tickets/${t.id}`)}>
                  <td className="px-6 py-4 font-mono text-xs text-text-500 group-hover:text-primary-400">{t.ticketId}</td>
                  <td className="px-6 py-4">
                    <p className="text-text-100 font-bold leading-tight">{t.subject}</p>
                    <p className="text-[10px] text-text-500 mt-1 uppercase tracking-tighter">{t.category}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={t.status === 'open' ? 'error' : t.status === 'resolved' ? 'success' : 'warning'}>{t.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={t.priority === 'urgent' ? 'error' : t.priority === 'high' ? 'warning' : 'info'}>{t.priority}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-text-100 text-sm italic">{t.requesterName}</p>
                    <p className="text-[10px] text-text-600 font-mono mt-0.5">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
