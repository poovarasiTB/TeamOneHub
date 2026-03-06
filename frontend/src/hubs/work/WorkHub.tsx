import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { ProjectList } from './projects/ProjectList';
import { ProjectDetail } from './projects/ProjectDetail';
import { CreateProject } from './projects/CreateProject';
import { AgileBoard } from './projects/AgileBoard';
import { GanttTimeline } from './projects/GanttTimeline';
import { ResourceHeatmap } from './projects/ResourceHeatmap';
import { CABTool } from './projects/CABTool';
import { IncidentManager } from './projects/IncidentManager';
import { TaskBoard } from './tasks/TaskBoard';
import { TaskDetail } from './tasks/TaskDetail';
import { Whiteboard } from './whiteboard/Whiteboard';
import { ManufacturingTemplate } from './templates/ManufacturingTemplate';
import { RetailTemplate } from './templates/RetailTemplate';

export function WorkHub() {
  const location = useLocation();
  const isRoot = location.pathname === '/work' || location.pathname === '/work/';

  if (isRoot) {
    return <Navigate to="/work/projects" replace />;
  }

  const navItems = [
    { path: '/work/projects', label: 'Projects' },
    { path: '/work/tasks', label: 'Tasks' },
    { path: '/work/resources', label: 'Resources' },
    { path: '/work/cab', label: 'CAB' },
    { path: '/work/incidents', label: 'Incidents' },
    { path: '/work/mfg', label: 'Mfg OEE' },
    { path: '/work/retail', label: 'Retail Ops' },
    { path: '/work/whiteboard', label: 'Whiteboard' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-6 px-8 py-4 bg-surface-800 border-b border-border-12 sticky top-0 z-10 overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `whitespace-nowrap text-sm font-bold tracking-wider uppercase transition-all duration-300 relative py-1 ${isActive
                ? 'text-primary-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-400'
                : 'text-text-400 hover:text-text-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/new" element={<CreateProject />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="projects/:id/board" element={<AgileBoard />} />
            <Route path="projects/:id/gantt" element={<GanttTimeline />} />
            <Route path="tasks" element={<TaskBoard />} />
            <Route path="tasks/:id" element={<TaskDetail />} />
            <Route path="resources" element={<ResourceHeatmap />} />
            <Route path="cab" element={<CABTool />} />
            <Route path="incidents" element={<IncidentManager />} />
            <Route path="mfg" element={<ManufacturingTemplate />} />
            <Route path="retail" element={<RetailTemplate />} />
            <Route path="whiteboard" element={<Whiteboard />} />
            <Route path="*" element={<Navigate to="projects" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
