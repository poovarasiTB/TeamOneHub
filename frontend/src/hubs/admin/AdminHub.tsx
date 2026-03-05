import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserManagement } from './users/UserManagement';
import { RolesPermissions } from './roles/RolesPermissions';
import { AuditLog } from './audit/AuditLog';
import { SystemSettings } from './settings/SystemSettings';

export function AdminHub() {
  return (
    <div className="admin-hub">
      <Routes>
        <Route path="/users" element={<UserManagement />} />
        <Route path="/roles" element={<RolesPermissions />} />
        <Route path="/audit" element={<AuditLog />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Routes>
    </div>
  );
}
