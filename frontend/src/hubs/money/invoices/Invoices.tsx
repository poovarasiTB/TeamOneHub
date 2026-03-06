import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useMoneyStore } from '../../../store/moneyStore';
import { LoadingTable } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function Invoices() {
    const { invoices, fetchInvoices, isLoading } = useMoneyStore();
    const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    if (isLoading && invoices.length === 0) {
        return <LoadingTable rows={5} columns={5} />;
    }

    const filteredInvoices = filterStatus === 'all'
        ? invoices
        : invoices.filter(i => i.status === filterStatus);

    const totalOutstanding = invoices
        .filter(i => i.status !== 'paid')
        .reduce((sum, i) => sum + i.amount, 0);

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-3xl font-bold text-text-100 font-serif italic">Accounts Receivable</h1>
                    <p className="text-text-400 mt-1 italic">Manage outgoing invoices and client payments</p>
                </div>
                <Button variant="primary" onClick={() => toast.success('New invoice draft created')}>+ Create Invoice</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary-500/10 to-transparent">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-medium">Total Outstanding</p>
                        <h3 className="text-3xl font-bold text-text-100 mt-1">${totalOutstanding.toLocaleString()}</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-medium">Collection Rate</p>
                        <h3 className="text-3xl font-bold text-success mt-1">94.2%</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-medium">Avg. Pay Cycle</p>
                        <h3 className="text-3xl font-bold text-text-100 mt-1">12 Days</h3>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-2xl shadow-black/20">
                <CardHeader className="flex justify-between items-center bg-bg-800/30">
                    <h2 className="text-xl font-bold text-text-100 italic font-serif">Invoice Registry</h2>
                    <div className="flex gap-2">
                        {['all', 'pending', 'paid', 'overdue'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s as any)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterStatus === s ? 'bg-primary-500 text-white' : 'bg-bg-800 text-text-500 hover:text-text-200'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-bg-800 border-b border-border-12">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">ID / Number</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Client Entity</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Issued / Due</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Amount</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-12">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-bg-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-primary-400 font-mono text-xs">{inv.invoiceNumber}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-text-100 font-bold">{inv.clientName}</span>
                                    </td>
                                    <td className="px-6 py-4 text-text-400 text-sm">
                                        {new Date(inv.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-text-100">
                                        ${inv.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'error' : 'warning'}>
                                            {inv.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm">View PDF</Button>
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
