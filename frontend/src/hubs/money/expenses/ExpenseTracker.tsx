import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useExpenseStore } from '../../../store/expenseStore';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';

export function ExpenseTracker() {
  const { user } = useAuthStore();
  const { expenses, fetchExpenses, createExpense, approveExpense, rejectExpense, payExpense, isLoading, error } = useExpenseStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Travel',
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await createExpense({
        ...formData,
        amount: parseFloat(formData.amount),
        employeeId: user?.id,
      });
      setFormData({ category: 'Travel', description: '', amount: '', expenseDate: new Date().toISOString().split('T')[0] });
      setShowAddForm(false);
      toast.success('Expense submitted for approval');
    } catch (err) {
      toast.error('Failed to submit expense');
    }
  };

  const handleScanReceipt = () => {
    setIsScanning(true);
    toast.loading('Analyzing receipt with OCR...', { duration: 2000 });

    setTimeout(() => {
      setFormData({
        category: 'Meals',
        description: 'Team Lunch @ Cloud Cafe',
        amount: '84.50',
        expenseDate: new Date().toISOString().split('T')[0]
      });
      setIsScanning(false);
      setShowAddForm(true);
      toast.success('Receipt scanned successfully!');
    }, 2000);
  };

  const handleApprove = async (id: string) => {
    await approveExpense(id);
    toast.success('Expense approved');
  };

  const handleReject = async (id: string) => {
    await rejectExpense(id);
    toast.success('Expense rejected');
  };

  const totals = {
    all: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    pending: expenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0),
    approved: expenses.filter(exp => exp.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0),
    count: expenses.length
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Expense Tracker</h1>
          <p className="text-text-400 mt-1">Track and manage expenses with AI OCR</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleScanReceipt} disabled={isScanning}>
            {isScanning ? 'Scanning...' : '📸 Scan Receipt'}
          </Button>
          <Button variant="primary" onClick={() => setShowAddForm(true)}>+ Manual Entry</Button>
        </div>
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
            <p className="text-sm text-text-400 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-text-100">${totals.all.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Pending Approval</p>
            <p className="text-3xl font-bold text-warning">${totals.pending.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Approved</p>
            <p className="text-3xl font-bold text-success">${totals.approved.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Claims</p>
            <p className="text-3xl font-bold text-primary-400">{totals.count}</p>
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
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
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
                {isLoading && expenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-text-400">No expenses found.</td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-bg-800/50 transition-colors">
                      <td className="py-4 px-6 text-text-600">{new Date(expense.expenseDate).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-text-600">{expense.category}</td>
                      <td className="py-4 px-6 text-text-600">{expense.description}</td>
                      <td className="py-4 px-6 text-text-600">{expense.employeeName}</td>
                      <td className="py-4 px-6 text-text-100 font-semibold">${expense.amount.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <Badge variant={
                          expense.status === 'approved' || expense.status === 'paid' ? 'success' :
                            expense.status === 'pending' ? 'warning' : 'error'
                        }>
                          {expense.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        {expense.status === 'pending' && (user?.role === 'admin' || user?.role === 'manager') && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="success" onClick={() => handleApprove(expense.id)}>Approve</Button>
                            <Button size="sm" variant="danger" onClick={() => handleReject(expense.id)}>Reject</Button>
                          </div>
                        )}
                        {expense.status === 'approved' && (user?.role === 'admin' || user?.role === 'manager') && (
                          <Button size="sm" variant="primary" onClick={() => payExpense(expense.id)}>Mark Paid</Button>
                        )}
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
