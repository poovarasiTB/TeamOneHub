import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

export function Taxes() {
    const taxLiabilities = [
        { type: 'Corporate Income Tax', period: 'FY 2025-26', amount: 45000, deadline: '2026-06-30', status: 'pending' },
        { type: 'Sales Tax (GST/VAT)', period: 'Q1 2026', amount: 12400, deadline: '2026-04-10', status: 'computed' },
        { type: 'Payroll Tax', period: 'March 2026', amount: 5600, deadline: '2026-03-31', status: 'paid' },
    ];

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-3xl font-bold text-text-100 font-serif italic">Tax & Compliance</h1>
                    <p className="text-text-400 mt-1 italic">Regulatory filings and statutory obligations</p>
                </div>
                <Button variant="primary" onClick={() => { }}>Generate Tax Report</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="shadow-2xl shadow-black/10">
                    <CardHeader>
                        <h2 className="text-xl font-bold text-text-100 italic">Filings Roadmap</h2>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border-12">
                            {taxLiabilities.map((tax) => (
                                <div key={tax.type} className="p-6 hover:bg-bg-800/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-text-100">{tax.type}</h3>
                                        <Badge variant={tax.status === 'paid' ? 'success' : tax.status === 'pending' ? 'error' : 'warning'}>
                                            {tax.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between text-xs text-text-400">
                                        <span>Tax Period: {tax.period}</span>
                                        <span className="font-mono">Liability: ${tax.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] text-text-500 bg-bg-800 px-2 py-1 rounded">
                                            <span>Deadline: {tax.deadline}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-primary-400">Review Data</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="bg-primary-500/5 border-primary-500/20">
                        <CardHeader>
                            <h2 className="text-lg font-bold text-text-100 italic">Compliance Checker</h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 p-3 bg-bg-800 rounded-xl">
                                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                <p className="text-sm text-text-200">KYC Status Verified</p>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-bg-800 rounded-xl border border-warning-500/20">
                                <div className="w-2 h-2 bg-warning rounded-full" />
                                <p className="text-sm text-text-200">VAT Registration Update Required</p>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-bg-800 rounded-xl">
                                <div className="w-2 h-2 bg-success rounded-full" />
                                <p className="text-sm text-text-200">Annual Audit Completed</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-bold text-text-100 italic">Archive Vault</h2>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {['Audit_Report_2024.pdf', 'Tax_Exemption_Certificate.png', 'GST_Filing_Q4.zip'].map(doc => (
                                <div key={doc} className="flex justify-between items-center p-3 hover:bg-bg-800 rounded-xl cursor-default transition-colors">
                                    <span className="text-xs text-text-400">{doc}</span>
                                    <button className="text-[10px] text-primary-400 font-bold uppercase hover:underline">Download</button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
