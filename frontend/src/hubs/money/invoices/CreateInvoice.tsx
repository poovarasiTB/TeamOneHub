import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../../../store/invoiceStore';
import { Button } from '../../../components/Button';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { validateForm, createInvoiceSchema } from '../../../utils/validation';
import { LoadingSpinner } from '../../../components/Loading';
import toast from 'react-hot-toast';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export function CreateInvoice() {
  const navigate = useNavigate();
  const { createInvoice, isLoading } = useInvoiceStore();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    customerId: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0, taxRate: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, taxRate: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const subtotal = item.quantity * item.unitPrice;
      const tax = subtotal * (item.taxRate / 100);
      return total + subtotal + tax;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate items
    const hasEmptyItems = items.some(item => !item.description);
    if (hasEmptyItems) {
      setValidationErrors({ items: 'All items must have a description' });
      return;
    }

    try {
      await createInvoice({
        ...formData,
        items,
        totalAmount: calculateTotal(),
      });
      toast.success('Invoice created successfully!');
      navigate('/money/invoices');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-100">Create New Invoice</h1>
        <p className="text-text-400 mt-1">Create a new invoice for your customer</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-xl font-semibold text-text-100">Invoice Details</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium text-text-600 mb-2">
                Customer *
              </label>
              <select
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  validationErrors.customerId ? 'border-error' : 'border-border-12'
                }`}
              >
                <option value="">Select Customer</option>
                <option value="customer-1">Acme Corp</option>
                <option value="customer-2">TechStart Inc</option>
                <option value="customer-3">Global Ltd</option>
              </select>
              {validationErrors.customerId && (
                <p className="mt-1 text-sm text-error">{validationErrors.customerId}</p>
              )}
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-text-600 mb-2">
                Due Date *
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Line Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-100">Line Items</h3>
                <Button type="button" variant="secondary" size="sm" onClick={addItem}>
                  + Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-5">
                      <label className="block text-sm text-text-400 mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-text-400 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-text-400 mb-1">Unit Price</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-text-400 mb-1">Tax Rate (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.taxRate}
                        onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {validationErrors.items && (
                <p className="mt-2 text-sm text-error">{validationErrors.items}</p>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-border-12 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-text-100">Total Amount</span>
                <span className="text-2xl font-bold text-text-100">${calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-text-600 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Additional notes or payment instructions"
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
                  'Create Invoice'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/money/invoices')}
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
