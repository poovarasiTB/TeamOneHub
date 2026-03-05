import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';

export function FinancialReports() {
  const [financialData, setFinancialData] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    accountsReceivable: 0,
    accountsPayable: 0,
    cashFlow: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2026-Q1');

  useEffect(() => {
    // Fetch financial data from API
    const fetchFinancialData = async () => {
      try {
        // Simulating API call - replace with actual API call
        // const response = await apiClient.get('/money/reports', { params: { period: selectedPeriod } });
        // setFinancialData(response.data);

        // Mock data for now
        setFinancialData({
          revenue: 125000,
          expenses: 78000,
          profit: 47000,
          accountsReceivable: 32000,
          accountsPayable: 18000,
          cashFlow: 29000,
        });
      } catch (error) {
        console.error('Failed to fetch financial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, [selectedPeriod]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading financial reports...</p>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: 'Total Revenue', value: financialData.revenue, color: 'text-success', trend: '+12.5%' },
    { label: 'Total Expenses', value: financialData.expenses, color: 'text-error', trend: '+5.2%' },
    { label: 'Net Profit', value: financialData.profit, color: 'text-primary-400', trend: '+28.3%' },
    { label: 'Accounts Receivable', value: financialData.accountsReceivable, color: 'text-info', trend: '-3.1%' },
    { label: 'Accounts Payable', value: financialData.accountsPayable, color: 'text-warning', trend: '+1.8%' },
    { label: 'Cash Flow', value: financialData.cashFlow, color: 'text-success', trend: '+15.7%' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-100">Financial Reports</h1>
        <p className="text-text-400 mt-1">Overview of financial performance</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="2026-Q1">Q1 2026</option>
          <option value="2025-Q4">Q4 2025</option>
          <option value="2025-Q3">Q3 2025</option>
          <option value="2025-Q2">Q2 2025</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-text-400 mb-1">{metric.label}</p>
                  <p className={`text-3xl font-bold ${metric.color}`}>${metric.value.toLocaleString()}</p>
                </div>
                <Badge variant={metric.trend.startsWith('+') ? 'success' : 'warning'}>{metric.trend}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Revenue vs Expenses</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center bg-bg-800 rounded-lg">
              <p className="text-text-400">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Cash Flow Trend</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center bg-bg-800 rounded-lg">
              <p className="text-text-400">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Detailed Breakdown</h2>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-bg-800 border-b border-border-12">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Category</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-text-100">Amount</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-text-100">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-12">
              <tr className="hover:bg-bg-800/50">
                <td className="px-6 py-4 text-text-100">Revenue</td>
                <td className="px-6 py-4 text-right text-success">${financialData.revenue.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-text-400">100%</td>
              </tr>
              <tr className="hover:bg-bg-800/50">
                <td className="px-6 py-4 text-text-100">Expenses</td>
                <td className="px-6 py-4 text-right text-error">${financialData.expenses.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-text-400">62.4%</td>
              </tr>
              <tr className="hover:bg-bg-800/50 bg-success/10">
                <td className="px-6 py-4 font-semibold text-text-100">Net Profit</td>
                <td className="px-6 py-4 text-right text-success font-semibold">${financialData.profit.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-success font-semibold">37.6%</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
