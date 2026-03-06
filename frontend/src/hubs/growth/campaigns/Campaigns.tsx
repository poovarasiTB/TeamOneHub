import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { useGrowthStore } from '../../../store/growthStore';
import { LoadingTable } from '../../../components/Loading';

export function Campaigns() {
  const { campaigns, fetchCampaigns, isLoading } = useGrowthStore();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (isLoading && campaigns.length === 0) {
    return <LoadingTable rows={5} columns={6} />;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-left">
        <h1 className="text-3xl font-bold text-text-100 font-serif italic">Growth Campaigns</h1>
        <p className="text-text-400 mt-1 italic">Marketing performance monitoring and lead generation metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-bg-800/80 border-info-500/20 shadow-2xl">
          <CardContent className="p-6">
            <p className="text-xs text-text-500 font-black uppercase tracking-widest">Total Reach</p>
            <h3 className="text-3xl font-bold text-text-100 mt-2">1.2M</h3>
            <p className="text-[10px] text-success mt-1">↑ 12% vs last month</p>
          </CardContent>
        </Card>
        <Card className="bg-bg-800/80 border-primary-500/20 shadow-2xl">
          <CardContent className="p-6">
            <p className="text-xs text-text-500 font-black uppercase tracking-widest">Growth Leads</p>
            <h3 className="text-3xl font-bold text-primary-400 mt-2">485</h3>
            <p className="text-[10px] text-primary-500 mt-1">74.2% MQL</p>
          </CardContent>
        </Card>
        <Card className="bg-bg-800/80 border-success-500/20 shadow-2xl">
          <CardContent className="p-6">
            <p className="text-xs text-text-500 font-black uppercase tracking-widest">Avg. CAC</p>
            <h3 className="text-3xl font-bold text-success mt-2">$24.80</h3>
            <p className="text-[10px] text-success mt-1">↓ 5% cost reduction</p>
          </CardContent>
        </Card>
        <Card className="bg-bg-800/80 border-warning-500/20 shadow-2xl">
          <CardContent className="p-6">
            <p className="text-xs text-text-500 font-black uppercase tracking-widest">Conversion</p>
            <h3 className="text-3xl font-bold text-warning mt-2">4.82%</h3>
            <p className="text-[10px] text-text-500 mt-1">Industry avg: 3.2%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-2xl shadow-black/20">
        <CardHeader>
          <h2 className="text-xl font-bold text-text-100 font-serif italic">Active Initiatives</h2>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-800 border-b border-border-12">
              <tr>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Campaign Name</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic">Platform</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-center">Budget / Spent</th>
                <th className="px-6 py-4 font-semibold text-text-100 italic text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-12">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-bg-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-text-100">{c.name}</td>
                  <td className="px-6 py-4">
                    <Badge variant="info" className="text-[10px]">{c.platform}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={c.status === 'active' ? 'success' : 'warning'}>{c.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-bold text-text-100">${c.spent.toLocaleString()}</p>
                    <p className="text-[10px] text-text-500">Alloc: ${c.budget.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-text-200">{c.leads} Leads</span>
                      <span className="text-[9px] text-text-500 uppercase tracking-tighter">ROI: {(c.leads > 0 ? (c.leads * 10) / c.spent : 0).toFixed(2)}x</span>
                    </div>
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
