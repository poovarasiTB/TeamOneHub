import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { LoadingTable } from '../../../components/Loading';
import { useCustomerStore } from '../../../store/customerStore';

export function CustomerList() {
  const { customers, fetchCustomers, isLoading, error } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === '' || customer.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (isLoading && customers.length === 0) {
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

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

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
            <p className="text-sm text-text-400 mb-2">Avg Revenue</p>
            <p className="text-3xl font-bold text-primary-400">
              ${customers.length > 0
                ? (customers.reduce((sum, c) => sum + (c.revenue || 0), 0) / customers.length).toLocaleString(undefined, { maximumFractionDigits: 0 })
                : 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-success">${customers.reduce((sum, c) => sum + (c.revenue || 0), 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-text-100">All Customers</h2>
            <div className="flex gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
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
                {isLoading && customers.length > 0 && (
                  <tr className="bg-bg-800/20">
                    <td colSpan={7} className="py-2 px-6 text-center text-xs text-primary-400 animate-pulse">Updating...</td>
                  </tr>
                )}
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 px-6 text-center text-text-400">No customers found.</td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-bg-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <Link to={`/money/customers/${customer.id}`} className="text-primary-400 hover:text-primary-300 font-medium">
                          {customer.name}
                        </Link>
                        <p className="text-sm text-text-400">{customer.email}</p>
                      </td>
                      <td className="py-4 px-6 text-text-600 capitalize">{customer.type}</td>
                      <td className="py-4 px-6 text-text-600">{customer.phone}</td>
                      <td className="py-4 px-6 text-text-600">{customer.invoicesCount}</td>
                      <td className="py-4 px-6 text-success font-semibold">${(customer.revenue || 0).toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${customer.status === 'active' ? 'bg-success/20 text-success' : 'bg-bg-600 text-text-400'
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

