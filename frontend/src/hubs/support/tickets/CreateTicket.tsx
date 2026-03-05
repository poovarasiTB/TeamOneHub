import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicketStore } from '../../../store/ticketStore';
import { Button } from '../../../components/Button';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { validateForm, createTicketSchema } from '../../../utils/validation';
import { LoadingSpinner } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function CreateTicket() {
  const navigate = useNavigate();
  const { createTicket, isLoading } = useTicketStore();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'incident',
    category: '',
    priority: 'medium',
    assigneeId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const validation = validateForm(createTicketSchema, formData);
    
    if (!validation.success) {
      setValidationErrors(validation.errors || {});
      return;
    }

    try {
      await createTicket(formData);
      toast.success('Ticket created successfully!');
      navigate('/support/tickets');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-100">Create New Ticket</h1>
        <p className="text-text-400 mt-1">Report an issue or request support</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-xl font-semibold text-text-100">Ticket Information</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-text-600 mb-2">
                Subject *
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  validationErrors.subject ? 'border-error' : 'border-border-12'
                }`}
                placeholder="Brief summary of the issue"
              />
              {validationErrors.subject && (
                <p className="mt-1 text-sm text-error">{validationErrors.subject}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-text-600 mb-2">
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="incident">Incident</option>
                  <option value="service-request">Service Request</option>
                  <option value="problem">Problem</option>
                  <option value="change">Change</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-text-600 mb-2">
                  Priority *
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-600 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing</option>
                <option value="account">Account</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-600 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={8}
                className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  validationErrors.description ? 'border-error' : 'border-border-12'
                }`}
                placeholder="Detailed description of the issue..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-error">{validationErrors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="assigneeId" className="block text-sm font-medium text-text-600 mb-2">
                Assign To
              </label>
              <select
                id="assigneeId"
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Unassigned</option>
                <option value="agent-1">John Doe</option>
                <option value="agent-2">Jane Smith</option>
                <option value="agent-3">Mike Johnson</option>
              </select>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Ticket'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/support/tickets')}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
