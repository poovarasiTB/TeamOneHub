import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { LoadingTable } from '../../../components/Loading';
import { useAssetStore } from '../../../store/assetStore';
import toast from 'react-hot-toast';

export function DomainManager() {
  const { domains, fetchDomains, isLoading } = useAssetStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const handleRenew = (id: string, type: 'domain' | 'ssl') => {
    toast.success(`${type === 'domain' ? 'Domain' : 'SSL Certificate'} renewal initiated`);
  };

  const filteredDomains = domains.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.registrar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && domains.length === 0) {
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
        <Card className="bg-warning/10 border-warning/20">
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

        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔒</div>
              <div>
                <p className="text-text-100 font-semibold">SSL Certificates</p>
                <p className="text-text-400 text-sm">All certificates are valid</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domains Table */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text-100">Domains</h2>
            <input
              type="text"
              placeholder="Search domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
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
                {filteredDomains.map((domain) => (
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
    </div>
  );
}
