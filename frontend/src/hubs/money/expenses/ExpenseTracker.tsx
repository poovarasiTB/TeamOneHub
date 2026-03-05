import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import toast from 'react-hot-toast';

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Travel', description: 'Flight to NYC', amount: 450, date: '2026-02-15', status: 'approved', submitter: 'John Doe' },
    { id: 2, category: 'Meals', description: 'Client lunch meeting', amount: 85, date: '2026-02-14', status: 'pending', submitter: 'Jane Smith' },
    { id: 3, category: 'Equipment', description: 'New monitor', amount: 350, date: '2026-02-13', status: 'approved', submitter: 'Mike Johnson' },
    { id: 4, category: 'Software', description: 'Adobe Creative Cloud', amount: 55, date: '2026-02-12', status: 'approved', submitter: 'Sarah Wilson' },
    { id: 5, category: 'Travel', description: 'Hotel accommodation', amount: 280, date: '2026-02-11', status: 'rejected', submitter: 'John Doe' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Travel',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      toast.error('Please fill all fields');
      return;
    }
    const newExpense = {
      id: expenses.length + 1,
      ...formData,
      amount: parseFloat(formData.amount),
      status: 'pending' as const,
      submitter: 'Current User',
    };
    setExpenses([newExpense, ...expenses]);
    setFormData({ category: 'Travel', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
    toast.success('Expense submitted for approval');
  };

  const handleApprove = (id: number) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, status: 'approved' as const } : exp));
    toast.success('Expense approved');
  };

  const handleReject = (id: number) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, status: 'rejected' as const } : exp));
    toast.success('Expense rejected');
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses.filter(exp => exp.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Expense Tracker</h1>
          <p className="text-text-400 mt-1">Track and manage expenses</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>+ Add Expense</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-text-100">${totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Pending Approval</p>
            <p className="text-3xl font-bold text-warning">${pendingExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Approved</p>
            <p className="text-3xl font-bold text-success">${approvedExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Claims</p>
            <p className="text-3xl font-bold text-primary-400">{expenses.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Add New Expense</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-400 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Meals">Meals</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Software">Software</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-text-400 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-text-400 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Expense description"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-400 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary">Submit Expense</Button>
                <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Recent Expenses</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Description</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Submitter</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-bg-800/50 transition-colors">
                    <td className="py-4 px-6 text-text-600">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-text-600">{expense.category}</td>
                    <td className="py-4 px-6 text-text-600">{expense.description}</td>
                    <td className="py-4 px-6 text-text-600">{expense.submitter}</td>
                    <td className="py-4 px-6 text-text-100 font-semibold">${expense.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <Badge variant={
                        expense.status === 'approved' ? 'success' :
                        expense.status === 'pending' ? 'warning' : 'error'
                      }>
                        {expense.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      {expense.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="success" onClick={() => handleApprove(expense.id)}>Approve</Button>
                          <Button size="sm" variant="danger" onClick={() => handleReject(expense.id)}>Reject</Button>
                        </div>
                      )}
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
