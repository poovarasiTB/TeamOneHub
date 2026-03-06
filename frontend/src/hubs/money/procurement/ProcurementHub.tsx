import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { VendorList } from './VendorList';

export function ProcurementHub() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4 border-b border-border-12 pb-2">
                <NavLink
                    to="vendors"
                    className={({ isActive }) =>
                        `text-sm font-medium transition-colors ${isActive ? 'text-primary-400 border-b-2 border-primary-400 pb-2 -mb-2.5' : 'text-text-400 hover:text-text-100'}`
                    }
                >
                    Vendors
                </NavLink>
                <NavLink
                    to="purchase-orders"
                    className={({ isActive }) =>
                        `text-sm font-medium transition-colors ${isActive ? 'text-primary-400 border-b-2 border-primary-400 pb-2 -mb-2.5' : 'text-text-400 hover:text-text-100'}`
                    }
                >
                    Purchase Orders
                </NavLink>
            </div>

            <Routes>
                <Route path="vendors" element={<VendorList />} />
                <Route path="purchase-orders" element={<div className="p-12 text-center text-text-400 border-2 border-dashed border-border-12 rounded-2xl">Purchase Orders module coming soon...</div>} />
                <Route path="*" element={<Navigate to="vendors" replace />} />
            </Routes>
        </div>
    );
}
