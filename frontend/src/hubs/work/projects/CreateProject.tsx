import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../../store/projectStore';
import { Button } from '../../../components/Button';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { LoadingSpinner } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function CreateProject() {
  const navigate = useNavigate();
  const { createProject, isLoading } = useProjectStore();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    type: 'internal',
    status: 'planning',
    industryTemplate: 'software',
    billingType: 'fixed',
    hourlyRate: '',
    budget: '',
    currency: 'USD',
    dataClassification: 'internal',
    isGdprRelevant: false,
    retentionDays: '2555',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    try {
      await createProject({
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
        retentionDays: formData.retentionDays ? parseInt(formData.retentionDays, 10) : undefined,
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
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute left-0 top-1/2 w-full h-1 bg-border-12 -z-10 transform -translate-y-1/2 rounded-full"></div>
      <div
        className="absolute left-0 top-1/2 h-1 bg-primary-500 -z-10 transform -translate-y-1/2 transition-all duration-300 rounded-full"
        style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
      ></div>

      {['Basic Details', 'Settings & Finance', 'Compliance'].map((label, i) => {
        const stepNum = i + 1;
        const isActive = step >= stepNum;
        return (
          <div key={stepNum} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-bg-800 text-text-400 border-2 border-border-12'}`}>
              {stepNum}
            </div>
            <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-text-100' : 'text-text-600'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-600 mb-2">Project Name *</label>
        <input
          id="name" name="name" type="text" required
          value={formData.name} onChange={handleInputChange}
          className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
          placeholder="New Website Redesign"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-600 mb-2">Description</label>
        <textarea
          id="description" name="description" rows={4}
          value={formData.description} onChange={handleInputChange}
          className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
          placeholder="Detailed project objectives..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-text-600 mb-2">Start Date *</label>
          <input
            id="startDate" name="startDate" type="date" required
            value={formData.startDate} onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-text-600 mb-2">End Date (Target)</label>
          <input
            id="endDate" name="endDate" type="date"
            value={formData.endDate} onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="industryTemplate" className="block text-sm font-medium text-text-600 mb-2">Industry Template</label>
          <select
            id="industryTemplate" name="industryTemplate"
            value={formData.industryTemplate} onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
          >
            <option value="software">Software Development</option>
            <option value="marketing">Marketing Campaign</option>
            <option value="hr">HR Onboarding</option>
            <option value="design">Design & Creative</option>
            <option value="generic">Generic Project</option>
          </select>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-text-600 mb-2">Operating Type *</label>
          <select
            id="type" name="type"
            value={formData.type} onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
          >
            <option value="internal">Internal Team</option>
            <option value="fixed-price">Client: Fixed Price</option>
            <option value="time-materials">Client: Time & Materials</option>
            <option value="retainer">Client: Retainer</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-text-600 mb-2">Budget</label>
          <input
            id="budget" name="budget" type="number" step="0.01" min="0"
            value={formData.budget} onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
            placeholder="0.00"
          />
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-text-600 mb-2">Currency</label>
          <select
            id="currency" name="currency"
            value={formData.currency} onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div>
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-text-600 mb-2">Hourly Rate (Optional)</label>
          <input
            id="hourlyRate" name="hourlyRate" type="number" step="1" min="0"
            value={formData.hourlyRate} onChange={handleInputChange}
            className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
            placeholder="150"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label htmlFor="dataClassification" className="block text-sm font-medium text-text-600 mb-2">Data Classification *</label>
        <select
          id="dataClassification" name="dataClassification"
          value={formData.dataClassification} onChange={handleInputChange}
          className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
        >
          <option value="public">Public</option>
          <option value="internal">Internal Only</option>
          <option value="confidential">Confidential</option>
          <option value="restricted">Highly Restricted</option>
        </select>
        <p className="mt-2 text-xs text-text-600">Dictates how audit logs and access are strictly handled.</p>
      </div>

      <div className="flex items-center gap-4 bg-bg-800 p-4 border border-border-12 rounded-xl">
        <input
          id="isGdprRelevant" name="isGdprRelevant" type="checkbox"
          checked={formData.isGdprRelevant} onChange={handleInputChange}
          className="w-5 h-5 text-primary-500 bg-bg-900 border-border-12 rounded focus:ring-primary-500 focus:ring-2"
        />
        <div className="flex flex-col">
          <label htmlFor="isGdprRelevant" className="text-sm font-medium text-text-80">GDPR / Compliance Relevant</label>
          <span className="text-xs text-text-600">Check if this project touches PII. Triggers mandatory audit trails.</span>
        </div>
      </div>

      <div>
        <label htmlFor="retentionDays" className="block text-sm font-medium text-text-600 mb-2">Data Retention (Days)</label>
        <input
          id="retentionDays" name="retentionDays" type="number" min="30"
          value={formData.retentionDays} onChange={handleInputChange}
          className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:ring-2 focus:ring-primary-500"
        />
        <p className="mt-2 text-xs text-text-600">Default 2555 days (7 Years) for financial/contractual data.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-100 drop-shadow-sm">Project Setup Wizard</h1>
        <p className="text-text-400 mt-2">Let's configure your new workspace step by step</p>
      </div>

      <Card className="shadow-2xl shadow-bg-900/50 border border-border-12 overflow-hidden bg-bg-900/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="bg-bg-900/80 border-b border-border-12 pb-6 px-8 pt-8">
            {renderStepIndicator()}
          </CardHeader>

          <CardContent className="p-8 min-h-[400px]">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </CardContent>

          <div className="px-8 py-5 bg-bg-900/80 border-t border-border-12 flex justify-between items-center">
            <Button
              type="button"
              variant="secondary"
              onClick={() => step === 1 ? navigate('/work/projects') : setStep(step - 1)}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>

            <Button type="submit" variant="primary" isLoading={isLoading} className="shadow-lg shadow-primary-500/20">
              {isLoading ? (
                <><LoadingSpinner size="sm" className="mr-2" /> Saving...</>
              ) : step === totalSteps ? (
                'Launch Project 🚀'
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </form>
      </Card>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
