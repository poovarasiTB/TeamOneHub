import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { useInvoiceStore } from '../../../store/invoiceStore';
import { useExpenseStore } from '../../../store/expenseStore';

export function FinancialDashboard() {
    const { invoices, fetchInvoices } = useInvoiceStore();
    const { expenses, fetchExpenses } = useExpenseStore();

    useEffect(() => {
        fetchInvoices();
        fetchExpenses();
    }, [fetchInvoices, fetchExpenses]);

    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
    const totalPending = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + i.totalAmount, 0);
    const totalExpenses = expenses.filter(e => e.status === 'approved' || e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Financial Overview</h1>
                    <p className="text-text-400 mt-1">Real-time financial performance tracking</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-success/10 to-transparent border-success/20">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 mb-2">Total Revenue (Paid)</p>
                        <p className="text-4xl font-bold text-success">${totalRevenue.toLocaleString()}</p>
                        <div className="mt-4 flex items-center text-sm text-success">
                            <span>↑ Active Cash Inflow</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/20">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 mb-2">Accounts Receivable</p>
                        <p className="text-4xl font-bold text-primary-400">${totalPending.toLocaleString()}</p>
                        <div className="mt-4 flex items-center text-sm text-primary-400">
                            <span>• Pending Invoices</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-error/10 to-transparent border-error/20">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 mb-2">Total Expenses</p>
                        <p className="text-4xl font-bold text-error">${totalExpenses.toLocaleString()}</p>
                        <div className="mt-4 flex items-center text-sm text-error">
                            <span>↓ Cash Outflow</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-text-100">Revenue vs. Expenses</h2>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center text-text-400">
                        {/* Chart implementation would go here */}
                        <div className="text-center">
                            <div className="flex items-end gap-8 h-48 mb-4">
                                <div className="w-16 bg-success/40 rounded-t-lg" style={{ height: '80%' }}></div>
                                <div className="w-16 bg-error/40 rounded-t-lg" style={{ height: '40%' }}></div>
                            </div>
                            <div className="flex gap-8 justify-center">
                                <span className="text-sm">Revenue</span>
                                <span className="text-sm">Expenses</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-text-100">Recent Transactions</h2>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <tbody className="divide-y divide-border-12">
                                    {[...invoices, ...expenses].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()).slice(0, 5).map((txn, idx) => (
                                        <tr key={idx} className="hover:bg-bg-800/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <p className="text-sm text-text-100 font-medium">{'invoiceNumber' in txn ? `Invoice ${txn.invoiceNumber}` : `Expense: ${txn.category}`}</p>
                                                <p className="text-xs text-text-400">{new Date(txn.createdAt || '').toLocaleDateString()}</p>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span className={`font-semibold ${'invoiceNumber' in txn ? 'text-success' : 'text-error'}`}>
                                                    {'invoiceNumber' in txn ? '+' : '-'}${('totalAmount' in txn ? txn.totalAmount : txn.amount).toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && expenses.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="py-8 text-center text-text-400">No recent transactions.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
