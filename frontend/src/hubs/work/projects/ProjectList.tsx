import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { useProjectStore } from '../../../store/projectStore';
import { LoadingTable } from '../../../components/Loading';

export function ProjectList() {
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (isLoading && projects.length === 0) {
    return <LoadingTable rows={5} columns={5} />;
  }

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-text-100 font-serif italic">Project Portfolio</h1>
          <p className="text-text-400 mt-1 italic">Enterprise project governance and delivery monitoring</p>
        </div>
        <Link to="/work/projects/new">
          <Button variant="primary">+ Initiate Project</Button>
        </Link>
      </div>

      <Card className="bg-bg-800/50 border-primary-500/10">
        <CardContent className="p-4 flex gap-4">
          <input
            type="text"
            placeholder="Search projects by name, code or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-bg-900 border border-border-12 rounded-xl px-4 py-2 text-text-100 focus:ring-2 focus:ring-primary-500"
          />
          <Badge variant="info">{projects.length} Active Workstreams</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((project) => (
          <Card key={project.id} className="hover:border-primary-500/30 transition-all group overflow-hidden shadow-2xl">
            <div className={`h-1.5 w-full ${project.healthStatus === 'green' ? 'bg-success' :
                project.healthStatus === 'yellow' ? 'bg-warning' : 'bg-error'
              }`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-text-500 uppercase tracking-widest">{project.code}</span>
                <Badge variant={project.status === 'active' ? 'success' : 'default'}>{project.status}</Badge>
              </div>
              <Link to={`/work/projects/${project.id}`} className="block mt-2">
                <h3 className="text-xl font-bold text-text-100 group-hover:text-primary-400 transition-colors truncate">{project.name}</h3>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-400 line-clamp-2 mb-6 h-10">{project.description || 'No description provided for this workstream.'}</p>

              <div className="flex justify-between items-end border-t border-border-12 pt-4">
                <div>
                  <p className="text-[10px] text-text-600 uppercase font-black">Timeline</p>
                  <p className="text-xs text-text-200">{project.startDate} — {project.endDate || 'TBD'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-text-600 uppercase font-black">Budget Utilization</p>
                  <p className="text-sm font-bold text-text-100">${project.budget?.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
