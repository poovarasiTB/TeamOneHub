import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';

const secrets = [
    { id: 'SEC-01', name: 'DB_PRODUCTION_KEY', type: 'AWS Secret Manager', rotated: '2 days ago', status: 'secure' },
    { id: 'SEC-02', name: 'PAYPAL_API_CERT', type: 'PEM Key', rotated: '15 days ago', status: 'secure' },
    { id: 'SEC-03', name: 'JWT_SIGNING_SECRET', type: 'HMAC-256', rotated: 'Never', status: 'warning' },
];

export function CloudSecretsVault() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-100">Cloud Secrets Vault</h1>
                    <p className="text-text-400 mt-1">Encrypted secret management with auto-rotation (Zero-Trust)</p>
                </div>
                <Button variant="primary">🛡️ Rotate All Keys</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h3 className="font-bold text-text-100">Active Secrets</h3>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="bg-bg-800 border-b border-border-12 text-[10px] uppercase font-bold text-text-500">
                                <tr>
                                    <th className="p-4 text-left">Secret Name</th>
                                    <th className="p-4 text-center">Last Rotated</th>
                                    <th className="p-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-12">
                                {secrets.map(sec => (
                                    <tr key={sec.id} className="hover:bg-bg-800/50">
                                        <td className="p-4">
                                            <p className="text-sm font-mono text-primary-400">{sec.name}</p>
                                            <p className="text-[10px] text-text-500">{sec.type}</p>
                                        </td>
                                        <td className="p-4 text-center text-xs text-text-400">{sec.rotated}</td>
                                        <td className="p-4 text-right">
                                            <Badge variant={sec.status === 'secure' ? 'success' : 'warning'}>
                                                {sec.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3 className="font-bold text-text-100">VPC Mapping (Infra)</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 bg-bg-900 rounded-xl border border-border-12 relative flex items-center justify-center">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/AmazonWebServices_Logo.svg/1200px-AmazonWebServices_Logo.svg.png')] bg-no-repeat bg-center bg-contain scale-50"></div>

                            <div className="flex gap-8 relative z-10">
                                <div className="p-3 bg-bg-800 border-2 border-primary-500/50 rounded-lg text-center">
                                    <p className="text-[10px] font-bold text-primary-500 mb-1">Public Subnet</p>
                                    <div className="flex gap-2">
                                        <span className="w-4 h-4 bg-primary-500 rounded-sm"></span>
                                        <span className="w-4 h-4 bg-primary-500 rounded-sm"></span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-12 h-0.5 bg-dashed border-t-2 border-border-12"></div>
                                </div>
                                <div className="p-3 bg-bg-800 border-2 border-error-500/50 rounded-lg text-center">
                                    <p className="text-[10px] font-bold text-error-500 mb-1">Private Subnet</p>
                                    <div className="flex gap-2">
                                        <span className="w-4 h-4 bg-error-500 rounded-sm"></span>
                                        <span className="w-4 h-4 bg-error-500 rounded-sm opacity-50"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-text-500 mt-4 text-center">Real-time VPC visual topology for 10.0.0.0/16</p>
                    </CardContent>
                </Card>
            </div>

            <div className="p-6 bg-error-500/5 border border-error-500/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-3xl text-error-400">🚨</div>
                    <div>
                        <h4 className="font-bold text-text-100">Compliance Warning</h4>
                        <p className="text-sm text-text-400">JWT Signing Secret has not been rotated for 365+ days. This violates ISO-27001 requirements.</p>
                    </div>
                </div>
                <Button variant="danger">Resolve</Button>
            </div>
        </div>
    );
}
