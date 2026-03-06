import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { LoadingTable } from '../../../components/Loading';
import { useAssetStore } from '../../../store/assetStore';
import toast from 'react-hot-toast';

export function LicenseManager() {
  const { licenses, fetchLicenses, isLoading } = useAssetStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  const handleRenew = (id: string) => {
    toast.success('License renewal initiated');
  };

  const filteredLicenses = licenses.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.publisher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const complianceSummary = {
    compliant: licenses.filter(l => l.complianceStatus === 'compliant').length,
    overallocated: licenses.filter(l => l.complianceStatus === 'overallocated').length,
    expiringSoon: licenses.filter(l => l.complianceStatus === 'expiring-soon').length,
    expired: licenses.filter(l => l.complianceStatus === 'expired').length,
  };

  if (isLoading && licenses.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-100">Software Licenses</h1>
            <p className="text-text-400 mt-1">Manage software licenses and compliance</p>
          </div>
          <Button variant="primary">+ Add License</Button>
        </div>
        <LoadingTable rows={5} columns={7} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Software Licenses</h1>
          <p className="text-text-400 mt-1">Manage software licenses and compliance</p>
        </div>
        <Button variant="primary">+ Add License</Button>
      </div>

      {/* Compliance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-bg-800/50 border-border-12">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Compliant</p>
            <p className="text-3xl font-bold text-success">{complianceSummary.compliant}</p>
          </CardContent>
        </Card>
        <Card className="bg-bg-800/50 border-border-12">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Over-allocated</p>
            <p className="text-3xl font-bold text-error">{complianceSummary.overallocated}</p>
          </CardContent>
        </Card>
        <Card className="bg-bg-800/50 border-border-12">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Expiring Soon</p>
            <p className="text-3xl font-bold text-warning">{complianceSummary.expiringSoon}</p>
          </CardContent>
        </Card>
        <Card className="bg-bg-800/50 border-border-12">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Expired</p>
            <p className="text-3xl font-bold text-text-300">{complianceSummary.expired}</p>
          </CardContent>
        </Card>
      </div>

      {/* Licenses Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text-100">All Licenses</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search licenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">License</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Publisher</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Seats</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Usage</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Expiry</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Compliance</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {filteredLicenses.map((license) => (
                  <tr key={license.id} className="hover:bg-bg-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="text-text-100 font-medium">{license.name}</p>
                      <p className="text-sm text-text-400">{license.type}</p>
                    </td>
                    <td className="py-4 px-6 text-text-600">{license.publisher}</td>
                    <td className="py-4 px-6 text-text-600">
                      {license.usedSeats} / {license.totalSeats}
                    </td>
                    <td className="py-4 px-6">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-400">{Math.round((license.usedSeats / license.totalSeats) * 100)}%</span>
                        </div>
                        <div className="w-full bg-bg-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${(license.usedSeats / license.totalSeats) > 0.9 ? 'bg-error' :
                                (license.usedSeats / license.totalSeats) > 0.7 ? 'bg-warning' : 'bg-success'
                              }`}
                            style={{ width: `${(license.usedSeats / license.totalSeats) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-600">
                      {new Date(license.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={
                        license.complianceStatus === 'compliant' ? 'success' :
                          license.complianceStatus === 'overallocated' ? 'error' :
                            license.complianceStatus === 'expiring-soon' ? 'warning' : 'default'
                      }>
                        {license.complianceStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleRenew(license.id)}>
                          Renew
                        </Button>
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
