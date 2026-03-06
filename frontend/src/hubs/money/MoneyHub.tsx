import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { Invoices } from './invoices/Invoices';
import { Bills } from './bills/Bills';
import { Treasury } from './treasury/Treasury';
import { Taxes } from './taxes/Taxes';
import { FinOpsDashboard } from './reports/FinOpsDashboard';
import { SubscriptionBilling } from './invoices/SubscriptionBilling';
import { ExpenseTracker } from './expenses/ExpenseTracker';

export function MoneyHub() {
  const location = useLocation();
  const isRoot = location.pathname === '/money' || location.pathname === '/money/';

  if (isRoot) {
    return <Navigate to="/money/invoices" replace />;
  }

  const navItems = [
    { path: '/money/invoices', label: 'Invoices' },
    { path: '/money/subscriptions', label: 'Subscriptions' },
    { path: '/money/bills', label: 'Bills' },
    { path: '/money/expenses', label: 'Expenses (OCR)' },
    { path: '/money/treasury', label: 'Treasury' },
    { path: '/money/finops', label: 'FinOps' },
    { path: '/money/taxes', label: 'Tax' },
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
            <Route path="invoices" element={<Invoices />} />
            <Route path="subscriptions" element={<SubscriptionBilling />} />
            <Route path="bills" element={<Bills />} />
            <Route path="expenses" element={<ExpenseTracker />} />
            <Route path="treasury" element={<Treasury />} />
            <Route path="finops" element={<FinOpsDashboard />} />
            <Route path="taxes" element={<Taxes />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
