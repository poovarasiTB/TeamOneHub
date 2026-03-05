import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../../../store/invoiceStore';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { LoadingPage } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentInvoice, fetchInvoice, deleteInvoice, sendInvoice, recordPayment, isLoading } = useInvoiceStore();

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(id!);
        toast.success('Invoice deleted successfully');
        navigate('/money/invoices');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete invoice');
      }
    }
  };

  const handleSend = async () => {
    try {
      await sendInvoice(id!);
      toast.success('Invoice sent successfully');
      fetchInvoice(id!);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send invoice');
    }
  };

  const handleRecordPayment = async () => {
    try {
      await recordPayment(id!, {
        amount: currentInvoice?.totalAmount,
        paymentDate: new Date().toISOString(),
        paymentMethod: 'bank_transfer',
      });
      toast.success('Payment recorded successfully');
      fetchInvoice(id!);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    }
  };

  if (isLoading || !currentInvoice) {
    return <LoadingPage message="Loading invoice..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-text-400 font-mono">{currentInvoice.invoiceNumber}</span>
            <Badge variant={
              currentInvoice.status === 'paid' ? 'success' :
              currentInvoice.status === 'overdue' ? 'error' :
              currentInvoice.status === 'sent' ? 'info' : 'default'
            }>
              {currentInvoice.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-text-100">Invoice Details</h1>
        </div>
        <div className="flex gap-3">
          {currentInvoice.status === 'draft' && (
            <Button variant="primary" onClick={handleSend}>Send Invoice</Button>
          )}
          {currentInvoice.status !== 'paid' && (
            <Button variant="success" onClick={handleRecordPayment}>Record Payment</Button>
          )}
          <Button variant="secondary" onClick={() => navigate(`/money/invoices/${id}/edit`)}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Customer</h2>
          </CardHeader>
          <CardContent>
            <p className="text-text-100 text-lg">{currentInvoice.customerName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Dates</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-text-400">Issued Date</dt>
                <dd className="text-text-100">{new Date(currentInvoice.issuedDate).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-400">Due Date</dt>
                <dd className="text-text-100">{new Date(currentInvoice.dueDate).toLocaleDateString()}</dd>
              </div>
              {currentInvoice.paidAt && (
                <div>
                  <dt className="text-sm text-text-400">Paid Date</dt>
                  <dd className="text-text-100">{new Date(currentInvoice.paidAt).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Amount Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Amount Summary</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-text-400 mb-1">Subtotal</p>
              <p className="text-2xl font-bold text-text-100">${(currentInvoice.totalAmount - currentInvoice.taxAmount).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-text-400 mb-1">Tax</p>
              <p className="text-2xl font-bold text-text-100">${currentInvoice.taxAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-text-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-text-100">${currentInvoice.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Timeline */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Link to={`/money/invoices/${id}/edit`}>
              <Button variant="secondary" className="w-full">Edit Invoice</Button>
            </Link>
            <Link to={`/money/invoices/${id}/duplicate`}>
              <Button variant="secondary" className="w-full">Duplicate Invoice</Button>
            </Link>
            <Button variant="secondary" className="w-full" onClick={() => window.print()}>
              Print Invoice
            </Button>
            <Button variant="secondary" className="w-full">
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
