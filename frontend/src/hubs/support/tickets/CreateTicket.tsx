import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { useSupportStore } from '../../../store/supportStore';
import toast from 'react-hot-toast';

export function CreateTicket() {
  const navigate = useNavigate();
  const { createTicket, isLoading } = useSupportStore();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium' as const,
    category: 'General',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createTicket(formData);
      toast.success('Ticket created successfully');
      navigate('/support/tickets');
    } catch (err) {
      toast.error('Failed to create ticket');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/support/tickets')}>
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-text-100">Create Support Ticket</h1>
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-100">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Brief summary of the issue"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-sans"
                >
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Network">Network</option>
                  <option value="Access">Access / Account</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-100">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-48 px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Detailed description of the problem..."
                required
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="secondary" onClick={() => navigate('/support/tickets')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" isLoading={isLoading}>
                Create Ticket
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
