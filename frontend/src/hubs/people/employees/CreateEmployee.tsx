import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeStore } from '../../../store/employeeStore';
import { Button } from '../../../components/Button';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { validateForm, createEmployeeSchema } from '../../../utils/validation';
import { LoadingSpinner } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function CreateEmployee() {
  const navigate = useNavigate();
  const { createEmployee, isLoading } = useEmployeeStore();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const validation = validateForm(createEmployeeSchema, formData);
    
    if (!validation.success) {
      setValidationErrors(validation.errors || {});
      return;
    }

    try {
      await createEmployee(formData);
      toast.success('Employee created successfully!');
      navigate('/people/employees');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <h1 className="text-3xl font-bold text-text-100">Add New Employee</h1>
        <p className="text-text-400 mt-1">Fill in the employee details</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-xl font-semibold text-text-100">Personal Information</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-text-600 mb-2">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.firstName ? 'border-error' : 'border-border-12'
                  }`}
                  placeholder="John"
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-error">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-text-600 mb-2">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.lastName ? 'border-error' : 'border-border-12'
                  }`}
                  placeholder="Doe"
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-error">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-600 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.email ? 'border-error' : 'border-border-12'
                  }`}
                  placeholder="john.doe@company.com"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-error">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-600 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.phone ? 'border-error' : 'border-border-12'
                  }`}
                  placeholder="+1 234 567 8900"
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-error">{validationErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-text-600 mb-2">
                  Department *
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.department ? 'border-error' : 'border-border-12'
                  }`}
                  placeholder="Engineering"
                />
                {validationErrors.department && (
                  <p className="mt-1 text-sm text-error">{validationErrors.department}</p>
                )}
              </div>

              <div>
                <label htmlFor="designation" className="block text-sm font-medium text-text-600 mb-2">
                  Designation *
                </label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  required
                  value={formData.designation}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    validationErrors.designation ? 'border-error' : 'border-border-12'
                  }`}
                  placeholder="Software Engineer"
                />
                {validationErrors.designation && (
                  <p className="mt-1 text-sm text-error">{validationErrors.designation}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="joinDate" className="block text-sm font-medium text-text-600 mb-2">
                  Join Date *
                </label>
                <input
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  required
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
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
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                  <option value="resigned">Resigned</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-600 mb-2">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Bangalore Office"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Employee'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/people/employees')}
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
