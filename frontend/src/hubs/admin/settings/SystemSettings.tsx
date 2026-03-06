import { useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { useAdminStore } from '../../../store/adminStore';
import { LoadingTable } from '../../../components/Loading';
import toast from 'react-hot-toast';

export function SystemSettings() {
  const { settings, fetchSettings, updateSetting, isLoading } = useAdminStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (isLoading && settings.length === 0) {
    return <LoadingTable rows={5} columns={2} />;
  }

  const categories = ['general', 'security', 'appearance', 'email'];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Global Configuration</h1>
          <p className="text-text-400 mt-1 italic">Fine-tune platform parameters and system behavior</p>
        </div>
        <Button variant="primary" onClick={() => toast.success('All settings synced')}>Sync Configuration</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="border-primary-500/10 hover:border-primary-500/30 transition-all shadow-xl shadow-primary-500/5">
            <CardHeader>
              <h2 className="text-xl font-bold text-text-100 italic">Platform Profile</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.filter(s => s.category === 'general').map((s) => (
                <div key={s.key} className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-text-100 italic uppercase tracking-wider">{s.key.replace(/_/g, ' ')}</label>
                    <span className="text-[10px] text-text-500">ID: {s.key}</span>
                  </div>
                  <input
                    type="text"
                    value={s.value}
                    onChange={(e) => updateSetting(s.key, e.target.value)}
                    className="w-full bg-bg-800 border border-border-12 rounded-xl px-4 py-3 text-text-100 focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-text-400">{s.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-warning-500/10">
            <CardHeader>
              <h2 className="text-xl font-bold text-text-100 italic">Operation Status</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-bg-800/50 rounded-2xl border border-border-12">
                <div>
                  <p className="text-text-100 font-bold">API Gateway Status</p>
                  <p className="text-xs text-success">Healthy • v2.4.0</p>
                </div>
                <div className="w-3 h-3 bg-success rounded-full animate-ping" />
              </div>
              <div className="flex items-center justify-between p-4 bg-bg-800/50 rounded-2xl border border-border-12 opacity-50">
                <div>
                  <p className="text-text-100 font-bold">Maintenance Mode</p>
                  <p className="text-xs text-text-400">Offline status for non-admins</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-bg-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warning"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-info-500/10">
            <CardHeader>
              <h2 className="text-xl font-bold text-text-100 italic">Storage & Environment</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100 italic uppercase">Public Storage Region</label>
                <select className="w-full bg-bg-800 border border-border-12 rounded-xl px-4 py-3 text-text-100">
                  <option>AWS us-east-1 (Primary)</option>
                  <option>GCP europe-west3</option>
                  <option>Azure India South</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-100 italic uppercase">Log Retention Policy</label>
                <div className="grid grid-cols-4 gap-2">
                  {['7d', '30d', '90d', '365d'].map(d => (
                    <button key={d} className={`py-2 rounded-lg border text-xs font-bold ${d === '90d' ? 'bg-primary-500/20 border-primary-500 text-primary-400' : 'bg-bg-800 border-border-12 text-text-500'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-error-500/5 to-transparent border-error-500/20">
            <CardHeader>
              <h2 className="text-xl font-bold text-error italic">Zone of Caution</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-text-400">Destructive actions cannot be reversed. Proceed with extreme caution.</p>
              <Button variant="danger" className="w-full" onClick={() => toast.error('Action blocked by system guard')}>
                Purge Temporary Cache
              </Button>
              <Button variant="ghost" className="w-full text-error border border-error/20 hover:bg-error/10">
                Reset System State
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
