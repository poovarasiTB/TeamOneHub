import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useMoneyStore } from '../../../store/moneyStore';
import { LoadingTable } from '../../../components/Loading';

export function Treasury() {
    const { transactions, fetchTransactions, isLoading } = useMoneyStore();

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    if (isLoading && transactions.length === 0) {
        return <LoadingTable rows={5} columns={4} />;
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-3xl font-bold text-text-100 font-serif italic">Treasury & Cash Flow</h1>
                    <p className="text-text-400 mt-1 italic">Monitor liquid assets and banking operations</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => { }}>Bank Sync</Button>
                    <Button variant="primary" onClick={() => { }}>Add Entry</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-bg-800/80 border-primary-500/20">
                    <CardContent className="p-6">
                        <p className="text-xs text-text-500 uppercase font-black">Main Operating</p>
                        <h3 className="text-2xl font-bold text-text-100 mt-1">$142,500.00</h3>
                        <p className="text-[10px] text-success mt-1">↑ 2.4% vs last week</p>
                    </CardContent>
                </Card>
                <Card className="bg-bg-800/80 border-info-500/20">
                    <CardContent className="p-6">
                        <p className="text-xs text-text-500 uppercase font-black">Reserve Savings</p>
                        <h3 className="text-2xl font-bold text-text-100 mt-1">$450,000.00</h3>
                        <p className="text-[10px] text-text-500 mt-1">No change</p>
                    </CardContent>
                </Card>
                <Card className="bg-bg-800/80 border-warning-500/20">
                    <CardContent className="p-6">
                        <p className="text-xs text-text-500 uppercase font-black">Projected Inflow</p>
                        <h3 className="text-2xl font-bold text-primary-400 mt-1">$84,000.00</h3>
                        <p className="text-[10px] text-text-400 mt-1">Next 30 days</p>
                    </CardContent>
                </Card>
                <Card className="bg-bg-800/80 border-error-500/20">
                    <CardContent className="p-6">
                        <p className="text-xs text-text-500 uppercase font-black">Burn Rate</p>
                        <h3 className="text-2xl font-bold text-error mt-1">$32,400.00</h3>
                        <p className="text-[10px] text-text-400 mt-1">Monthly average</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-2xl shadow-black/20">
                <CardHeader>
                    <h2 className="text-xl font-bold text-text-100 italic font-serif">Recent Ledger Activity</h2>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-bg-800 border-b border-border-12">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Event Date</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Counterparty / Description</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic">Category</th>
                                <th className="px-6 py-4 font-semibold text-text-100 italic text-right">Net Impact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-12">
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-bg-800/50 transition-colors">
                                    <td className="px-6 py-4 text-text-400 font-mono">
                                        {t.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-text-100 font-medium">{t.description}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <Badge variant="default">{t.category}</Badge>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                                        {t.type === 'income' ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
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
