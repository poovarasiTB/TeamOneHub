import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useCampaignStore, Campaign } from '../../../store/campaignStore';

export function Campaigns() {
  const { campaigns, fetchCampaigns, createCampaign, isLoading, error } = useCampaignStore();
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: '',
    type: 'email',
    status: 'draft',
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCampaign(newCampaign);
      setShowNewCampaign(false);
      setNewCampaign({ name: '', type: 'email', status: 'draft' });
    } catch (err) {
      console.error('Failed to create campaign:', err);
    }
  };

  if (isLoading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  const activeCount = campaigns.filter((c) => c.status === 'active').length;
  const totalSent = campaigns.reduce((sum, c) => sum + (c.metrics?.sent || 0), 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.metrics?.revenue || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Marketing Campaigns</h1>
          <p className="text-text-400 mt-1">Manage marketing campaigns</p>
        </div>
        <Button variant="primary" onClick={() => setShowNewCampaign(true)}>+ New Campaign</Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Active Campaigns</p>
            <p className="text-3xl font-bold text-success">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Sent</p>
            <p className="text-3xl font-bold text-primary-400">{totalSent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-success">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-text-400 mb-2">Total Campaigns</p>
            <p className="text-3xl font-bold text-text-100">{campaigns.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-100">All Campaigns</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-800 border-b border-border-12">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Sent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Revenue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-100">Period</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-text-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-12">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-text-400">
                      No campaigns found. Create your first campaign!
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-bg-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-text-100 font-medium">{campaign.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={campaign.type === 'email' ? 'info' : 'primary'}>{campaign.type}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            campaign.status === 'active'
                              ? 'success'
                              : campaign.status === 'completed'
                              ? 'secondary'
                              : campaign.status === 'draft'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-text-400">
                        {campaign.metrics?.sent?.toLocaleString() || '-'}
                      </td>
                      <td className="px-6 py-4 text-success">
                        ${campaign.metrics?.revenue?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 text-text-400 text-sm">
                        {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-primary-400 hover:text-primary-300">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Create New Campaign</h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-400 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value as any })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="email">Email</option>
                    <option value="social">Social Media</option>
                    <option value="multi-channel">Multi-Channel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-400 mb-1">Status</label>
                  <select
                    value={newCampaign.status}
                    onChange={(e) => setNewCampaign({ ...newCampaign, status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-bg-800 border border-border-12 rounded-lg text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">Create Campaign</Button>
                <Button type="button" variant="secondary" onClick={() => setShowNewCampaign(false)}>
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
