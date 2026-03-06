import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useAssetStore } from '../../../store/assetStore';
import { LoadingTable } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function AssetList() {
  const { assets, fetchAssets, isLoading } = useAssetStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  if (isLoading && assets.length === 0) {
    return <LoadingTable rows={5} columns={5} />;
  }

  const filteredAssets = assets.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Hardware Inventory</h1>
          <p className="text-text-400 mt-1 italic">Lifecycle management for physical computing resources</p>
        </div>
        <Button variant="primary" onClick={() => toast.success('New asset wizard launched')}>+ Register Asset</Button>
      </div>

      <Card className="bg-bg-800/50 border-primary-500/10">
        <CardContent className="p-4 flex gap-4">
          <input
            type="text"
            placeholder="Search by name or serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-bg-900 border border-border-12 rounded-xl px-4 py-2 text-text-100 focus:ring-2 focus:ring-primary-500"
          />
          <Badge variant="info">{assets.length} Total items</Badge>
        </CardContent>
      </Card>

      <Card className="shadow-2xl shadow-black/20">
        <CardHeader>
          <h2 className="text-xl font-bold text-text-100 italic font-serif">Resource Registry</h2>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-800 border-b border-border-12">
              <tr>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Asset Description</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Type / Category</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Lifecycle Status</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-right">Custodian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-12">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-500 italic">No assets registered in the current view</td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-bg-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-text-100 font-bold leading-none">{asset.name}</p>
                        <p className="text-[10px] text-text-500 mt-1 font-mono uppercase tracking-widest">{asset.serialNumber || asset.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">{asset.type}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={asset.status === 'active' ? 'success' : asset.status === 'maintenance' ? 'warning' : 'error'}>
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-text-400 text-sm italic">{asset.assignedToName || 'Unassigned'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
