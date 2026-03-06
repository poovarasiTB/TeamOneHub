import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { usePeopleStore } from '../../../store/peopleStore';
import { LoadingTable } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function PayrollView() {
  const { payslips, fetchPayslips, isLoading } = usePeopleStore();
  const [selectedMonth, setSelectedMonth] = useState('2026-03');

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  if (isLoading && payslips.length === 0) {
    return <LoadingTable rows={5} columns={6} />;
  }

  const totalNet = payslips.reduce((sum, r) => sum + r.netAmount, 0);
  const paidCount = payslips.filter(r => r.status === 'paid').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Payroll Management</h1>
          <p className="text-text-400 mt-1">Review and process team compensation</p>
        </div>
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-100"
          />
          <Button variant="primary" onClick={() => toast.success('Payroll generation queued')}>Run Payroll</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-success-500/10 to-transparent">
          <CardContent className="p-6">
            <p className="text-sm text-text-400 font-medium">Monthly Disbursement</p>
            <h3 className="text-3xl font-bold text-text-100 mt-1">${totalNet.toLocaleString()}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-400 font-medium">Processed Status</p>
            <h3 className="text-3xl font-bold text-success mt-1">{paidCount} / {payslips.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-400 font-medium">Next Pay Date</p>
            <h3 className="text-3xl font-bold text-text-100 mt-1">2026-03-31</h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Payroll Records</h2>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-800 border-b border-border-12">
              <tr>
                <th className="px-6 py-4 font-semibold text-text-100">Pay Period</th>
                <th className="px-6 py-4 font-semibold text-text-100">Base Salary</th>
                <th className="px-6 py-4 font-semibold text-text-100">Deductions</th>
                <th className="px-6 py-4 font-semibold text-text-100">Net Pay</th>
                <th className="px-6 py-4 font-semibold text-text-100">Status</th>
                <th className="px-6 py-4 font-semibold text-text-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-12">
              {payslips.map((record) => (
                <tr key={record.id} className="hover:bg-bg-800/50 transition-colors">
                  <td className="px-6 py-4 text-text-100 font-medium">{record.period}</td>
                  <td className="px-6 py-4 text-text-200">${record.baseAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-error">-${(record.deductions || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-success font-bold">${record.netAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant={record.status === 'paid' ? 'success' : 'warning'}>
                      {record.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" size="sm">View PDF</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
