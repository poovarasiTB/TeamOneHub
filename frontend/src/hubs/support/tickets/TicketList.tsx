import React from 'react';
import { useTicketStore } from '../../../store/ticketStore';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card, CardContent } from '../../../components/Card';

export function TicketList() {
  const { tickets, fetchTickets, isLoading } = useTicketStore();

  React.useEffect(() => {
    fetchTickets();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Support Tickets</h1>
          <p className="text-text-400 mt-1">Manage all support tickets</p>
        </div>
        <Link to="/support/tickets/new">
          <Button variant="primary">+ New Ticket</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Ticket #</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Subject</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Priority</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Assignee</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-bg-800/50 transition-colors">
                    <td className="py-4 px-6 text-text-100 font-mono">{ticket.ticketNumber}</td>
                    <td className="py-4 px-6 text-text-100">{ticket.subject}</td>
                    <td className="py-4 px-6">
                      <Badge variant={
                        ticket.priority === 'urgent' ? 'error' :
                        ticket.priority === 'high' ? 'warning' :
                        ticket.priority === 'medium' ? 'info' : 'default'
                      }>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={
                        ticket.status === 'resolved' ? 'success' :
                        ticket.status === 'closed' ? 'default' :
                        ticket.status === 'on-hold' ? 'warning' : 'info'
                      }>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-text-400">{ticket.assigneeName || 'Unassigned'}</td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/support/tickets/${ticket.id}`}
                        className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
