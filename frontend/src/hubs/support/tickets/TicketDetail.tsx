import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTicketStore } from '../../../store/ticketStore';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { LoadingPage } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function TicketDetail() {
  const { id } = useParams();
  const { currentTicket, fetchTicket, updateTicket, addComment, isLoading } = useTicketStore();
  const [comment, setComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTicket(id);
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    setIsAddingComment(true);
    try {
      await addComment(id!, comment);
      toast.success('Comment added successfully');
      setComment('');
      fetchTicket(id!);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTicket(id!, { status: newStatus });
      toast.success('Ticket status updated');
      fetchTicket(id!);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update ticket');
    }
  };

  if (isLoading || !currentTicket) {
    return <LoadingPage message="Loading ticket..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-text-400 font-mono">{currentTicket.ticketNumber}</span>
            <Badge variant={
              currentTicket.priority === 'urgent' ? 'error' :
              currentTicket.priority === 'high' ? 'warning' :
              currentTicket.priority === 'medium' ? 'info' : 'default'
            }>
              {currentTicket.priority}
            </Badge>
            <Badge variant={
              currentTicket.status === 'resolved' ? 'success' :
              currentTicket.status === 'closed' ? 'default' :
              currentTicket.status === 'on-hold' ? 'warning' : 'info'
            }>
              {currentTicket.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-text-100">{currentTicket.subject}</h1>
        </div>
        <div className="flex gap-3">
          <select
            value={currentTicket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="new">New</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="on-hold">On Hold</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-400 mb-1">Type</p>
            <p className="text-text-100 capitalize">{currentTicket.type}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-400 mb-1">Category</p>
            <p className="text-text-100 capitalize">{currentTicket.category || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-400 mb-1">Assignee</p>
            <p className="text-text-100">{currentTicket.assigneeName || 'Unassigned'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Description</h2>
        </CardHeader>
        <CardContent>
          <p className="text-text-80 whitespace-pre-wrap">{currentTicket.description}</p>
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Comments</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comment List */}
          <div className="space-y-4">
            <div className="bg-bg-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-white text-sm font-bold">
                  {currentTicket.requesterName?.[0] || 'R'}
                </div>
                <div>
                  <p className="text-text-100 font-medium">{currentTicket.requesterName || 'Requester'}</p>
                  <p className="text-xs text-text-400">{new Date(currentTicket.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-text-80">{currentTicket.description}</p>
            </div>
          </div>

          {/* Add Comment */}
          <div className="border-t border-border-12 pt-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleAddComment}
                isLoading={isAddingComment}
                disabled={!comment.trim()}
              >
                Add Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
