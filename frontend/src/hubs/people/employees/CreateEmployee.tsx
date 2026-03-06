import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePeopleStore } from '../../../store/peopleStore';
import { Button } from '../../../components/Button';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import toast from 'react-hot-toast';

export function CreateEmployee() {
  const navigate = useNavigate();
  const { createEmployee, isLoading } = usePeopleStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active' as const,
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee(formData);
      toast.success('Employee onboarded successfully!');
      navigate('/people/employees');
    } catch (error: any) {
      toast.error('Failed to create employee record');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-100">Onboard Employee</h1>
        <p className="text-text-400 mt-1">Create a new profile in the organization directory</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-primary-500/10 shadow-xl shadow-primary-500/5">
          <CardHeader>
            <h2 className="text-xl font-bold text-text-100">Primary Details</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100 italic">First Name</label>
                <input
                  required name="firstName" value={formData.firstName} onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100 italic">Last Name</label>
                <input
                  required name="lastName" value={formData.lastName} onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100 italic">Official Email</label>
                <input
                  required type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100 italic">Phone Number</label>
                <input
                  name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100 italic">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100">
                  <option value="">Select Dept</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">Human Resources</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-text-100 italic">Job Position</label>
                <input
                  required name="position" value={formData.position} onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100 italic">Joining Date</label>
                <input
                  type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100 italic">Work Location</label>
                <input
                  name="location" value={formData.location} onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Remote / HQ"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate('/people/employees')} type="button">Discard</Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>Save Profile</Button>
        </div>
      </form>
    </div>
  );
}
