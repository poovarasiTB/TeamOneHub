import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { LoadingTable } from '../../../components/Loading';

export function CustomerList() {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Acme Corp', email: 'contact@acme.com', phone: '+1 234 567 8900', type: 'Enterprise', status: 'active', invoices: 12, revenue: 125000 },
    { id: 2, name: 'TechStart Inc', email: 'hello@techstart.io', phone: '+1 234 567 8901', type: 'SMB', status: 'active', invoices: 8, revenue: 45000 },
    { id: 3, name: 'Global Ltd', email: 'info@global.com', phone: '+1 234 567 8902', type: 'Enterprise', status: 'active', invoices: 15, revenue: 230000 },
    { id: 4, name: 'Local Shop', email: 'owner@localshop.com', phone: '+1 234 567 8903', type: 'Small Business', status: 'inactive', invoices: 3, revenue: 8000 },
    { id: 5, name: 'StartupXYZ', email: 'founders@startupxyz.com', phone: '+1 234 567 8904', type: 'Startup', status: 'active', invoices: 5, revenue: 25000 },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-100">Customers</h1>
            <p className="text-text-400 mt-1">Manage customer relationships</p>
          </div>
          <Button variant="primary">+ Add Customer</Button>
        </div>
        <LoadingTable rows={5} columns={7} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Customers</h1>
          <p className="text-text-400 mt-1">Manage customer relationships</p>
        </div>
        <Button variant="primary">+ Add Customer</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-text-100">{customers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Active Customers</p>
            <p className="text-3xl font-bold text-success">{customers.filter(c => c.status === 'active').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Invoices</p>
            <p className="text-3xl font-bold text-primary-400">{customers.reduce((sum, c) => sum + c.invoices, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-success">${customers.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text-100">All Customers</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search customers..."
                className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Types</option>
                <option value="Enterprise">Enterprise</option>
                <option value="SMB">SMB</option>
                <option value="Small Business">Small Business</option>
                <option value="Startup">Startup</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Contact</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Invoices</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Revenue</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-bg-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <Link to={`/money/customers/${customer.id}`} className="text-primary-400 hover:text-primary-300 font-medium">
                        {customer.name}
                      </Link>
                      <p className="text-sm text-text-400">{customer.email}</p>
                    </td>
                    <td className="py-4 px-6 text-text-600">{customer.type}</td>
                    <td className="py-4 px-6 text-text-600">{customer.phone}</td>
                    <td className="py-4 px-6 text-text-600">{customer.invoices}</td>
                    <td className="py-4 px-6 text-success font-semibold">${customer.revenue.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'active' ? 'bg-success/20 text-success' : 'bg-bg-600 text-text-400'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/money/customers/${customer.id}`}
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
