import React from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { UserManagement } from './users/UserManagement';
import { RolesPermissions } from './roles/RolesPermissions';
import { AuditLogs } from './AuditLogs';
import { SystemSettings } from './settings/SystemSettings';
import { MultiTenantManager } from './MultiTenantManager';

export function AdminHub() {
  const location = useLocation();
  const isRoot = location.pathname === '/admin';

  if (isRoot) {
    return <Navigate to="/admin/users" replace />;
  }

  const navItems = [
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/roles', label: 'Permissions' },
    { path: '/admin/tenants', label: 'Multi-Tenancy' },
    { path: '/admin/audit', label: 'Audit Logs' },
    { path: '/admin/settings', label: 'System Settings' },
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
            <Route path="users" element={<UserManagement />} />
            <Route path="roles" element={<RolesPermissions />} />
            <Route path="tenants" element={<MultiTenantManager />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="settings" element={<SystemSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
