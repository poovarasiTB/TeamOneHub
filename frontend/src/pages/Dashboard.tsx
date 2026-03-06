import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';
import { useMoneyStore } from '@/store/moneyStore';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent } from '@/components/Card';

export function Dashboard() {
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { invoices, fetchInvoices } = useMoneyStore();

  useEffect(() => {
    fetchProjects({ limit: 5 });
    fetchTasks();
    fetchInvoices();
  }, [fetchProjects, fetchTasks, fetchInvoices]);

  const stats = [
    { label: 'Active Streams', value: projects.length.toString(), change: '+2', trend: 'up', color: 'primary' },
    { label: 'Orchestrated Tasks', value: tasks.length.toString(), change: '+14%', trend: 'up', color: 'success' },
    { label: 'Pending Revenue', value: `$${invoices.reduce((sum, inv) => sum + (inv.status === 'pending' ? inv.amount : 0), 0).toLocaleString()}`, change: '+8%', trend: 'up', color: 'info' },
    { label: 'SLA Health', value: '98.4%', change: '+0.2%', trend: 'up', color: 'warning' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-text-100 font-serif italic tracking-tight">Executive Overview</h1>
          <p className="text-text-500 mt-2 italic font-medium">Real-time intelligence across the TeamOne enterprise hub</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="info" className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-info/30 bg-info/5 animate-pulse">System Live</Badge>
          <Button variant="primary" size="sm" className="shadow-2xl shadow-primary-500/20">Operational Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-bg-800/40 backdrop-blur-xl border-border-12 hover:border-primary-500/30 transition-all group overflow-hidden shadow-2xl">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="text-6xl font-black italic">{stat.label.charAt(0)}</div>
              </div>
              <p className="text-xs text-text-600 font-black uppercase tracking-widest mb-4 italic">{stat.label}</p>
              <div className="flex items-baseline gap-4">
                <h3 className="text-4xl font-bold text-text-100 tracking-tighter">{stat.value}</h3>
                <span className={`text-[10px] font-black flex items-center gap-1 ${stat.trend === 'up' ? 'text-success' : 'text-error'}`}>
                  {stat.trend === 'up' ? '▲' : '▼'} {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Workstreams */}
        <Card className="lg:col-span-2 shadow-2xl border-none bg-surface-800">
          <CardHeader className="flex justify-between items-center border-b border-border-12 p-6">
            <h2 className="text-lg font-bold text-text-100 italic font-serif">Critical Workstreams</h2>
            <Link to="/work/projects" className="text-[10px] font-black text-primary-400 uppercase tracking-widest hover:text-primary-300 transition-colors">
              Portfolio View →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-bg-900/50">
                  <tr>
                    <th className="py-4 px-8 text-[10px] font-black text-text-500 uppercase italic">Stream Name</th>
                    <th className="py-4 px-8 text-[10px] font-black text-text-500 uppercase italic">Velocity</th>
                    <th className="py-4 px-8 text-[10px] font-black text-text-500 uppercase italic text-center">Outcome</th>
                    <th className="py-4 px-8 text-[10px] font-black text-text-500 uppercase italic text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-12">
                  {projects.slice(0, 5).map((project) => (
                    <tr key={project.id} className="hover:bg-bg-800/50 transition-colors">
                      <td className="py-5 px-8">
                        <Link to={`/work/projects/${project.id}`} className="text-text-100 font-bold hover:text-primary-400 transition-colors">
                          {project.name}
                        </Link>
                        <p className="text-[9px] text-text-600 font-mono mt-0.5 uppercase tracking-widest">{project.code}</p>
                      </td>
                      <td className="py-5 px-8">
                        <div className="w-24 bg-bg-900 h-1 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500" style={{ width: '65%' }} />
                        </div>
                      </td>
                      <td className="py-5 px-8 text-center">
                        <Badge variant={project.status === 'active' ? 'success' : 'default'} className="text-[8px] uppercase">{project.status}</Badge>
                      </td>
                      <td className="py-5 px-8 text-right text-text-200 font-mono text-sm font-bold">
                        ${(project.budget || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Rapid Actions */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary-600 to-indigo-700 border-none shadow-2xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold italic font-serif">Accelerate Delivery</h3>
            <p className="text-sm text-white/70 mt-2 mb-8 italic">Initiate a new cross-functional hub workstream instantly.</p>
            <Link to="/work/projects/new">
              <Button variant="secondary" className="bg-white text-indigo-700 hover:bg-white/90 border-none shadow-xl font-black uppercase text-[10px] tracking-widest py-3 px-8">Launch Wizard</Button>
            </Link>
          </Card>

          <Card className="bg-bg-800/50 border-border-12 shadow-2xl">
            <CardHeader className="p-6 pb-2">
              <h3 className="text-xs font-black text-text-500 uppercase tracking-widest italic">Rapid Entry</h3>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
              {[
                { label: 'Register Asset', path: '/assets/inventory', icon: '💻' },
                { label: 'Disburse Payroll', path: '/people/payroll', icon: '💰' },
                { label: 'Audit Security', path: '/admin/audit', icon: '🛡️' },
                { label: 'Strategy Map', path: '/work/whiteboard', icon: '🎨' },
              ].map(action => (
                <Link key={action.label} to={action.path} className="flex items-center justify-between p-4 bg-bg-900 border border-border-12 rounded-2xl hover:border-primary-500/50 hover:bg-bg-800 transition-all group">
                  <div className="flex items-center gap-4">
                    <span className="text-lg">{action.icon}</span>
                    <span className="text-sm font-bold text-text-200 group-hover:text-text-100 transition-colors uppercase tracking-tight">{action.label}</span>
                  </div>
                  <span className="text-text-600 font-black">→</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
