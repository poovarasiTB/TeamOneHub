import React from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { AssetList } from './assets/AssetList';
import { LicenseList } from './licenses/LicenseList';
import { DomainList } from './domains/DomainList';
import { MaintenanceList } from './maintenance/MaintenanceList';
import { AssetGenealogy } from './assets/AssetGenealogy';
import { DigitalAssetManager } from './assets/DigitalAssetManager';
import { CloudSecretsVault } from './assets/CloudSecretsVault';

export function AssetsHub() {
  const location = useLocation();
  const isRoot = location.pathname === '/assets' || location.pathname === '/assets/';

  if (isRoot) {
    return <Navigate to="/assets/inventory" replace />;
  }

  const navItems = [
    { path: '/assets/inventory', label: 'Hardware' },
    { path: '/assets/genealogy', label: 'Genealogy' },
    { path: '/assets/licenses', label: 'Licenses' },
    { path: '/assets/domains', label: 'Domains' },
    { path: '/assets/maintenance', label: 'Maintenance' },
    { path: '/assets/dam', label: 'DAM' },
    { path: '/assets/secrets', label: 'Secrets Vault' },
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
            <Route path="inventory" element={<AssetList />} />
            <Route path="genealogy" element={<AssetGenealogy />} />
            <Route path="licenses" element={<LicenseList />} />
            <Route path="domains" element={<DomainList />} />
            <Route path="maintenance" element={<MaintenanceList />} />
            <Route path="dam" element={<DigitalAssetManager />} />
            <Route path="secrets" element={<CloudSecretsVault />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
