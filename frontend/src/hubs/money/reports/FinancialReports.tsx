import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';

export function FinancialReports() {
  const revenueData = [
    { month: 'Jan', revenue: 125000, expenses: 85000, profit: 40000 },
    { month: 'Feb', revenue: 145000, expenses: 92000, profit: 53000 },
    { month: 'Mar', revenue: 138000, expenses: 88000, profit: 50000 },
    { month: 'Apr', revenue: 162000, expenses: 95000, profit: 67000 },
    { month: 'May', revenue: 178000, expenses: 102000, profit: 76000 },
    { month: 'Jun', revenue: 195000, expenses: 110000, profit: 85000 },
  ];

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, d) => sum + d.expenses, 0);
  const totalProfit = revenueData.reduce((sum, d) => sum + d.profit, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Financial Reports</h1>
          <p className="text-text-400 mt-1">Financial analytics and reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Export PDF</Button>
          <Button variant="secondary">Export Excel</Button>
          <Button variant="primary">Generate Report</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-400 mb-2">Total Revenue (6 months)</p>
            <p className="text-3xl font-bold text-success">${totalRevenue.toLocaleString()}</p>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-success">↑ 12%</span>
              <span className="text-text-400 ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-400 mb-2">Total Expenses (6 months)</p>
            <p className="text-3xl font-bold text-error">${totalExpenses.toLocaleString()}</p>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-warning">↑ 5%</span>
              <span className="text-text-400 ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-400 mb-2">Total Profit (6 months)</p>
            <p className="text-3xl font-bold text-primary-400">${totalProfit.toLocaleString()}</p>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-success">↑ 18%</span>
              <span className="text-text-400 ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Revenue Trend</h2>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-4">
            {revenueData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary-500/20 rounded-t-lg relative" style={{ height: `${(data.revenue / 200000) * 100}%` }}>
                  <div className="absolute bottom-0 w-full bg-success/20 rounded-t-lg" style={{ height: `${(data.profit / 200000) * 100}%` }}></div>
                </div>
                <span className="text-sm text-text-400">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-500/20 rounded"></div>
              <span className="text-sm text-text-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success/20 rounded"></div>
              <span className="text-sm text-text-400">Profit</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Monthly Breakdown</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Month</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Revenue</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Expenses</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Profit</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Profit Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {revenueData.map((data, index) => (
                  <tr key={index} className="hover:bg-bg-800/50 transition-colors">
                    <td className="py-4 px-6 text-text-100 font-medium">{data.month} 2026</td>
                    <td className="py-4 px-6 text-success">${data.revenue.toLocaleString()}</td>
                    <td className="py-4 px-6 text-error">${data.expenses.toLocaleString()}</td>
                    <td className="py-4 px-6 text-primary-400 font-semibold">${data.profit.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 bg-bg-700 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${(data.profit / data.revenue) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-text-600 text-sm">
                          {Math.round((data.profit / data.revenue) * 100)}%
                        </span>
                      </div>
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
