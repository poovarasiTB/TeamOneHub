import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useSupportStore } from '../../../store/supportStore';
import toast from 'react-hot-toast';

export function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTicket, fetchTicket, updateTicket, isLoading, error } = useSupportStore();
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (id) fetchTicket(id);
  }, [id, fetchTicket]);

  const handleStatusChange = async (status: any) => {
    if (id) {
      await updateTicket(id, { status });
      toast.success(`Ticket status updated to ${status}`);
    }
  };

  const handleSendReply = () => {
    if (!reply.trim()) return;
    toast.success('Reply sent successfully');
    setReply('');
  };

  if (isLoading) {
    return <div className="p-12 text-center text-text-400">Loading ticket details...</div>;
  }

  if (error || !currentTicket) {
    return (
      <div className="p-12 text-center text-error">
        <p>{error || 'Ticket not found'}</p>
        <Button variant="secondary" onClick={() => navigate('/support/tickets')} className="mt-4">
          Back to Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => navigate('/support/tickets')}>
            ← Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-100">{currentTicket.subject}</h1>
              <Badge variant="info">{currentTicket.ticketId}</Badge>
            </div>
            <p className="text-text-400 mt-1">Requested by {currentTicket.requesterName} • {new Date(currentTicket.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={currentTicket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-text-100">Description</h2>
            </CardHeader>
            <CardContent>
              <p className="text-text-200 whitespace-pre-wrap">{currentTicket.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-text-100">Conversation</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full h-32 px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
                <div className="flex justify-end">
                  <Button variant="primary" onClick={handleSendReply}>Send Reply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-text-100">Ticket Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-text-400 uppercase font-semibold">Priority</p>
                <Badge
                  className="mt-1"
                  variant={
                    currentTicket.priority === 'urgent' || currentTicket.priority === 'high' ? 'error' :
                      currentTicket.priority === 'medium' ? 'warning' : 'info'
                  }
                >
                  {currentTicket.priority}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-text-400 uppercase font-semibold">Category</p>
                <p className="text-text-100 mt-1">{currentTicket.category}</p>
              </div>
              <div>
                <p className="text-xs text-text-400 uppercase font-semibold">Assignee</p>
                <p className="text-text-100 mt-1">{currentTicket.assigneeName || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-text-400 uppercase font-semibold">SLA Deadline</p>
                <p className={`mt-1 font-medium ${new Date(currentTicket.slaDeadline) < new Date() ? 'text-error' : 'text-text-100'}`}>
                  {new Date(currentTicket.slaDeadline).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
