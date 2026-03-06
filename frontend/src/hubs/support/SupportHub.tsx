import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { TicketList } from './tickets/TicketList';
import { TicketDetail } from './tickets/TicketDetail';
import { CreateTicket } from './tickets/CreateTicket';
import { KnowledgeBase } from './knowledge/KnowledgeBase';
import { ClientPortal } from './tickets/ClientPortal';
import { CallCenterAnalytics } from './tickets/CallCenterAnalytics';
import { VisitorManagement } from './tickets/VisitorManagement';

export function SupportHub() {
  const location = useLocation();
  const isRoot = location.pathname === '/support' || location.pathname === '/support/';

  if (isRoot) {
    return <Navigate to="/support/tickets" replace />;
  }

  const navItems = [
    { path: '/support/tickets', label: 'Tickets' },
    { path: '/support/portal', label: 'Client Portal' },
    { path: '/support/analytics', label: 'Analytics' },
    { path: '/support/visitor', label: 'Visitor Mgmt' },
    { path: '/support/knowledge', label: 'Knowledge' },
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
            <Route path="tickets" element={<TicketList />} />
            <Route path="tickets/new" element={<CreateTicket />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
            <Route path="portal" element={<ClientPortal />} />
            <Route path="analytics" element={<CallCenterAnalytics />} />
            <Route path="visitor" element={<VisitorManagement />} />
            <Route path="knowledge" element={<KnowledgeBase />} />
            <Route path="*" element={<Navigate to="tickets" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
