import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { LoadingTable } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function DomainManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [domains, setDomains] = useState([
    { id: 1, name: 'teamone.local', registrar: 'GoDaddy', registrationDate: '2020-01-15', expiryDate: '2027-01-15', autoRenew: true, status: 'active' },
    { id: 2, name: 'teamone.com', registrar: 'Namecheap', registrationDate: '2020-01-15', expiryDate: '2027-01-15', autoRenew: true, status: 'active' },
    { id: 3, name: 'teamone.io', registrar: 'Google Domains', registrationDate: '2021-03-20', expiryDate: '2026-03-20', autoRenew: false, status: 'expiring-soon' },
    { id: 4, name: 'teamone.dev', registrar: 'GoDaddy', registrationDate: '2022-06-10', expiryDate: '2026-06-10', autoRenew: true, status: 'active' },
    { id: 5, name: 'teamone.app', registrar: 'Namecheap', registrationDate: '2023-01-05', expiryDate: '2026-01-05', autoRenew: true, status: 'expiring-soon' },
  ]);

  const [sslCertificates, setSslCertificates] = useState([
    { id: 1, domain: 'teamone.local', issuer: 'Let\'s Encrypt', issuedDate: '2026-01-01', expiryDate: '2026-04-01', status: 'valid' },
    { id: 2, domain: 'teamone.com', issuer: 'DigiCert', issuedDate: '2025-06-01', expiryDate: '2027-06-01', status: 'valid' },
    { id: 3, domain: 'teamone.io', issuer: 'Let\'s Encrypt', issuedDate: '2026-01-15', expiryDate: '2026-04-15', status: 'valid' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRenew = (id: number, type: 'domain' | 'ssl') => {
    toast.success(`${type === 'domain' ? 'Domain' : 'SSL Certificate'} renewal initiated`);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-100">Domains & SSL</h1>
            <p className="text-text-400 mt-1">Manage domains and SSL certificates</p>
          </div>
          <Button variant="primary">+ Add Domain</Button>
        </div>
        <LoadingTable rows={5} columns={6} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Domains & SSL</h1>
          <p className="text-text-400 mt-1">Manage domains and SSL certificates</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">+ Add SSL Certificate</Button>
          <Button variant="primary">+ Add Domain</Button>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⚠️</div>
              <div>
                <p className="text-text-100 font-semibold">Domains Expiring Soon</p>
                <p className="text-text-400 text-sm">{domains.filter(d => d.status === 'expiring-soon').length} domains expiring in next 60 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔒</div>
              <div>
                <p className="text-text-100 font-semibold">SSL Certificates</p>
                <p className="text-text-400 text-sm">{sslCertificates.filter(c => c.status === 'valid').length}/{sslCertificates.length} certificates valid</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domains Table */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">Domains</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Domain</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Registrar</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Registered</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Expires</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Auto Renew</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {domains.map((domain) => (
                  <tr key={domain.id} className="hover:bg-bg-800/50 transition-colors">
                    <td className="py-4 px-6 text-text-100 font-medium">{domain.name}</td>
                    <td className="py-4 px-6 text-text-600">{domain.registrar}</td>
                    <td className="py-4 px-6 text-text-600">{new Date(domain.registrationDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-text-600">{new Date(domain.expiryDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <Badge variant={domain.autoRenew ? 'success' : 'default'}>
                        {domain.autoRenew ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={domain.status === 'active' ? 'success' : 'warning'}>
                        {domain.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Button size="sm" variant="secondary" onClick={() => handleRenew(domain.id, 'domain')}>
                        Renew
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SSL Certificates Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">SSL Certificates</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Domain</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Issuer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Issued</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Expires</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {sslCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-bg-800/50 transition-colors">
                    <td className="py-4 px-6 text-text-100 font-medium">{cert.domain}</td>
                    <td className="py-4 px-6 text-text-600">{cert.issuer}</td>
                    <td className="py-4 px-6 text-text-600">{new Date(cert.issuedDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-text-600">{new Date(cert.expiryDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <Badge variant={cert.status === 'valid' ? 'success' : 'error'}>
                        {cert.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Button size="sm" variant="secondary" onClick={() => handleRenew(cert.id, 'ssl')}>
                        Renew
                      </Button>
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
