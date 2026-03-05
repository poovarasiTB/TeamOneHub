import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { usePayrollStore } from '../../../store/payrollStore';
import toast from 'react-hot-toast';

export function PayrollView() {
  const { records, fetchPayroll, generatePayroll, approvePayroll, markPaid, isLoading, error } = usePayrollStore();
  const [selectedMonth, setSelectedMonth] = useState('2026-02');

  useEffect(() => {
    fetchPayroll({ month: selectedMonth });
  }, [selectedMonth]);

  const handleProcessPayroll = async () => {
    try {
      await generatePayroll({
        payPeriodStart: `${selectedMonth}-01`,
        payPeriodEnd: `${selectedMonth}-28`,
        payDate: `${selectedMonth}-28`,
        status: 'draft',
      });
      toast.success('Payroll generated successfully');
    } catch (err) {
      toast.error('Failed to generate payroll');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approvePayroll(id);
      toast.success('Payroll approved');
    } catch (err) {
      toast.error('Failed to approve payroll');
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await markPaid(id);
      toast.success('Payroll marked as paid');
    } catch (err) {
      toast.error('Failed to mark as paid');
    }
  };

  if (isLoading && records.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading payroll...</p>
        </div>
      </div>
    );
  }

  const totalGross = records.reduce((sum, r) => sum + (r.grossPay || 0), 0);
  const totalNet = records.reduce((sum, r) => sum + (r.netPay || 0), 0);
  const processedCount = records.filter((r) => r.status === 'paid').length;
  const pendingCount = records.filter((r) => r.status === 'draft' || r.status === 'approved').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Payroll</h1>
          <p className="text-text-400 mt-1">Manage employee payroll</p>
        </div>
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button variant="primary" onClick={handleProcessPayroll}>Generate Payroll</Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Records</p>
            <p className="text-3xl font-bold text-text-100">{records.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Processed</p>
            <p className="text-3xl font-bold text-success">{processedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Pending</p>
            <p className="text-3xl font-bold text-warning">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Net Pay</p>
            <p className="text-3xl font-bold text-primary-400">${totalNet.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Payroll Records</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800 border-b border-border-12">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Employee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Pay Period</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Gross Pay</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Deductions</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Net Pay</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-text-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-text-400">
                      No payroll records found. Generate payroll for the selected month.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-bg-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-text-100">{record.employeeName || 'Employee'}</div>
                      </td>
                      <td className="px-6 py-4 text-text-400 text-sm">
                        {record.payPeriodStart ? new Date(record.payPeriodStart).toLocaleDateString() : '-'} -{' '}
                        {record.payPeriodEnd ? new Date(record.payPeriodEnd).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-text-100 font-medium">
                        ${record.grossPay?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 text-error">
                        -${((record.deductions?.tax || 0) + (record.deductions?.insurance || 0) + (record.deductions?.retirement || 0)).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-success font-semibold">
                        ${record.netPay?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            record.status === 'paid'
                              ? 'success'
                              : record.status === 'approved'
                              ? 'info'
                              : 'warning'
                          }
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {record.status === 'draft' && (
                            <Button variant="primary" size="sm" onClick={() => handleApprove(record.id)}>
                              Approve
                            </Button>
                          )}
                          {record.status === 'approved' && (
                            <Button variant="success" size="sm" onClick={() => handleMarkPaid(record.id)}>
                              Mark Paid
                            </Button>
                          )}
                          {record.status === 'paid' && (
                            <Button variant="ghost" size="sm" className="text-text-400">
                              Paid
                            </Button>
                          )}
                        </div>
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
