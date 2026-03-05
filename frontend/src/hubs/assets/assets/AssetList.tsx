import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useAssetStore, Asset } from '../../../store/assetStore';

export function AssetList() {
  const { assets, fetchAssets, createAsset, updateAsset, deleteAsset, isLoading, error } = useAssetStore();
  const [showNewAsset, setShowNewAsset] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    code: '',
    name: '',
    type: 'hardware',
    status: 'active',
    category: '',
    location: '',
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAsset(newAsset);
      setShowNewAsset(false);
      setNewAsset({ code: '', name: '', type: 'hardware', status: 'active', category: '', location: '' });
    } catch (err) {
      console.error('Failed to create asset:', err);
    }
  };

  if (isLoading && assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading assets...</p>
        </div>
      </div>
    );
  }

  const activeCount = assets.filter((a) => a.status === 'active').length;
  const byType = {
    hardware: assets.filter((a) => a.type === 'hardware').length,
    software: assets.filter((a) => a.type === 'software').length,
    cloud: assets.filter((a) => a.type === 'cloud').length,
    digital: assets.filter((a) => a.type === 'digital').length,
  };

  const typeColors: Record<string, string> = {
    hardware: 'bg-info/20 text-info',
    software: 'bg-primary/20 text-primary-400',
    cloud: 'bg-success/20 text-success',
    digital: 'bg-warning/20 text-warning',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-success/20 text-success',
    inactive: 'bg-bg-600 text-text-400',
    maintenance: 'bg-warning/20 text-warning',
    retired: 'bg-error/20 text-error',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Assets</h1>
          <p className="text-text-400 mt-1">Manage all company assets</p>
        </div>
        <Button variant="primary" onClick={() => setShowNewAsset(true)}>+ Add Asset</Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Assets</p>
            <p className="text-3xl font-bold text-text-100">{assets.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Active</p>
            <p className="text-3xl font-bold text-success">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Hardware</p>
            <p className="text-3xl font-bold text-info">{byType.hardware}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Software</p>
            <p className="text-3xl font-bold text-primary-400">{byType.software}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Cloud/Digital</p>
            <p className="text-3xl font-bold text-warning">{byType.cloud + byType.digital}</p>
          </CardContent>
        </Card>
      </div>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">All Assets</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800 border-b border-border-12">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Assigned To</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Location</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-text-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-text-400">
                      No assets found. Add your first asset!
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-bg-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-text-400">{asset.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-text-100">{asset.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={typeColors[asset.type]}>{asset.type}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={statusColors[asset.status]}>{asset.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-text-400">{asset.assignedToName || asset.assignedTo || '-'}</td>
                      <td className="px-6 py-4 text-text-400">{asset.location || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/assets/assets/${asset.id}/edit`}
                            className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteAsset(asset.id)}
                            className="text-error hover:text-error/80 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New Asset Modal */}
      {showNewAsset && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Add New Asset</h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Asset Code</label>
                  <input
                    type="text"
                    value={newAsset.code}
                    onChange={(e) => setNewAsset({ ...newAsset, code: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="AST-2026-XXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Type</label>
                  <select
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as any })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="cloud">Cloud</option>
                    <option value="digital">Digital</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Status</label>
                  <select
                    value={newAsset.status}
                    onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Laptop, Monitor, License"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={newAsset.location}
                    onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Bangalore, AWS, GoDaddy"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">Add Asset</Button>
                <Button type="button" variant="secondary" onClick={() => setShowNewAsset(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
