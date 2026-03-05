import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../../store/projectStore';
import { Button } from '../../../components/Button';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { validateForm, createProjectSchema } from '../../../utils/validation';
import { LoadingSpinner } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function CreateProject() {
  const navigate = useNavigate();
  const { createProject, isLoading } = useProjectStore();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'internal',
    status: 'planning',
    budget: '',
    currency: 'USD',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    healthStatus: 'green',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate form
    const validation = validateForm(createProjectSchema, {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
    });

    if (!validation.success) {
      setValidationErrors(validation.errors || {});
      return;
    }

    try {
      await createProject({
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      });
      toast.success('Project created successfully!');
      navigate('/work/projects');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation error
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
        <h1 className="text-3xl font-bold text-text-100">Create New Project</h1>
        <p className="text-text-400 mt-1">Fill in the details to create a new project</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-xl font-semibold text-text-100">Basic Information</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-600 mb-2">
                Project Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  validationErrors.name ? 'border-error' : 'border-border-12'
                }`}
                placeholder="Enter project name"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-error">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-600 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Project description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-text-600 mb-2">
                  Project Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="fixed-price">Fixed Price</option>
                  <option value="time-materials">Time & Materials</option>
                  <option value="retainer">Retainer</option>
                  <option value="internal">Internal</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-text-600 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-text-600 mb-2">
                  Budget
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.budget ? 'border-error' : 'border-border-12'
                  }`}
                  placeholder="0.00"
                />
                {validationErrors.budget && (
                  <p className="mt-1 text-sm text-error">{validationErrors.budget}</p>
                )}
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-text-600 mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-text-600 mb-2">
                  Start Date *
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-text-600 mb-2">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/work/projects')}
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
