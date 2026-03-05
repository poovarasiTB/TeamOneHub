import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { LoadingTable } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function LicenseManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [licenses, setLicenses] = useState([
    { id: 1, name: 'Microsoft 365 Business', publisher: 'Microsoft', type: 'subscription', totalSeats: 100, usedSeats: 85, expiryDate: '2026-12-31', status: 'active', complianceStatus: 'compliant' },
    { id: 2, name: 'Adobe Creative Cloud', publisher: 'Adobe', type: 'subscription', totalSeats: 50, usedSeats: 48, expiryDate: '2026-06-30', status: 'active', complianceStatus: 'compliant' },
    { id: 3, name: 'JetBrains All Products', publisher: 'JetBrains', type: 'subscription', totalSeats: 75, usedSeats: 75, expiryDate: '2026-03-31', status: 'active', complianceStatus: 'overallocated' },
    { id: 4, name: 'Slack Pro', publisher: 'Slack', type: 'subscription', totalSeats: 200, usedSeats: 156, expiryDate: '2027-01-31', status: 'active', complianceStatus: 'compliant' },
    { id: 5, name: 'Zoom Pro', publisher: 'Zoom', type: 'subscription', totalSeats: 100, usedSeats: 78, expiryDate: '2026-08-31', status: 'active', complianceStatus: 'compliant' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRenew = (id: number) => {
    toast.success('License renewal initiated');
  };

  const complianceSummary = {
    compliant: licenses.filter(l => l.complianceStatus === 'compliant').length,
    overallocated: licenses.filter(l => l.complianceStatus === 'overallocated').length,
    expiringSoon: licenses.filter(l => l.complianceStatus === 'expiring-soon').length,
    expired: licenses.filter(l => l.complianceStatus === 'expired').length,
  };

  if (isLoading) {
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
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Compliant</p>
            <p className="text-3xl font-bold text-success">{complianceSummary.compliant}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Over-allocated</p>
            <p className="text-3xl font-bold text-error">{complianceSummary.overallocated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Expiring Soon</p>
            <p className="text-3xl font-bold text-warning">{complianceSummary.expiringSoon}</p>
          </CardContent>
        </Card>
        <Card>
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
                className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Compliance</option>
                <option value="compliant">Compliant</option>
                <option value="overallocated">Over-allocated</option>
                <option value="expiring-soon">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
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
                {licenses.map((license) => (
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
                            className={`h-2 rounded-full ${
                              (license.usedSeats / license.totalSeats) > 0.9 ? 'bg-error' :
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
