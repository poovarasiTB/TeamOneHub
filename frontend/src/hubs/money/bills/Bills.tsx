import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useMoneyStore } from '../../../store/moneyStore';
import { LoadingTable } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function Bills() {
    const { bills, fetchBills, isLoading } = useMoneyStore();

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    if (isLoading && bills.length === 0) {
        return <LoadingTable rows={5} columns={5} />;
    }

    const totalUnpaid = bills
        .filter(b => b.status === 'unpaid')
        .reduce((sum, b) => sum + b.amount, 0);

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-3xl font-bold text-text-100 font-serif italic">Accounts Payable</h1>
                    <p className="text-text-400 mt-1 italic">Track vendor obligations and operational expenses</p>
                </div>
                <Button variant="primary" onClick={() => toast.success('Bill scanned successfully')}>+ Record Bill</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-error-500/10 to-transparent">
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-medium">Pending Obligations</p>
                        <h3 className="text-3xl font-bold text-text-100 mt-1">${totalUnpaid.toLocaleString()}</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-medium">Vendors Active</p>
                        <h3 className="text-3xl font-bold text-text-100 mt-1">18 Entities</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-text-400 font-medium">Next Group Payment</p>
                        <h3 className="text-3xl font-bold text-warning mt-1">In 3 Days</h3>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-2xl shadow-black/20">
                <CardHeader>
                    <h2 className="text-xl font-bold text-text-100 italic font-serif">Bill Queue</h2>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-bg-800 border-b border-border-12">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Vendor Entity</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Category</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Due Date</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Amount</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-12">
                            {bills.map((bill) => (
                                <tr key={bill.id} className="hover:bg-bg-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-text-100 font-bold">{bill.vendorName}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="default" className="text-[10px]">{bill.category}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-text-400 text-sm">
                                        {new Date(bill.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-text-100">
                                        ${bill.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant={bill.status === 'paid' ? 'success' : 'warning'}>
                                            {bill.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="secondary" size="sm">Pay Now</Button>
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
