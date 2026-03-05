import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AssetList } from './assets/AssetList';
import { AssetDetail } from './assets/AssetDetail';
import { LicenseManager } from './licenses/LicenseManager';
import { DomainManager } from './domains/DomainManager';

export function AssetsHub() {
  return (
    <div className="assets-hub">
      <Routes>
        <Route path="/assets" element={<AssetList />} />
        <Route path="/assets/:id" element={<AssetDetail />} />
        <Route path="/licenses" element={<LicenseManager />} />
        <Route path="/domains" element={<DomainManager />} />
      </Routes>
    </div>
  );
}
