import React from 'react';
import { useInvoiceStore } from '../../../store/invoiceStore';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card, CardContent } from '../../../components/Card';

export function InvoiceList() {
  const { invoices, fetchInvoices, isLoading } = useInvoiceStore();

  React.useEffect(() => {
    fetchInvoices();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Invoices</h1>
          <p className="text-text-400 mt-1">Manage all invoices</p>
        </div>
        <Link to="/money/invoices/new">
          <Button variant="primary">+ Create Invoice</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Invoice #</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Due Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-bg-800/50 transition-colors">
                    <td className="py-4 px-6 text-text-100 font-mono">{invoice.invoiceNumber}</td>
                    <td className="py-4 px-6 text-text-100">{invoice.customerName}</td>
                    <td className="py-4 px-6 text-text-100">${invoice.totalAmount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <Badge variant={
                        invoice.status === 'paid' ? 'success' :
                        invoice.status === 'overdue' ? 'error' :
                        invoice.status === 'sent' ? 'info' : 'default'
                      }>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-text-400">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/money/invoices/${invoice.id}`}
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
