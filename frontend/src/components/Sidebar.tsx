import { useAuthStore } from '@/store/authStore';

export function Sidebar() {
  const { user } = useAuthStore();

  const navItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '📋', label: 'Work', path: '/work' },
    { icon: '👥', label: 'People', path: '/people' },
    { icon: '💰', label: 'Money', path: '/money' },
    { icon: '🖥️', label: 'Assets', path: '/assets' },
    { icon: '🎧', label: 'Support', path: '/support' },
    { icon: '🌱', label: 'Growth', path: '/growth' },
    { icon: '⚙️', label: 'Admin', path: '/admin' },
  ];

  return (
    <aside className="w-64 bg-surface-800 border-r border-border-12 flex flex-col">
      <div className="p-6 border-b border-border-12">
        <h1 className="text-2xl font-bold text-text-100">TeamOne</h1>
        <p className="text-xs text-text-400 mt-1">Adaptive Digital Core</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-600 hover:bg-bg-800 hover:text-text-100 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-border-12">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-semibold">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-100 truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
            <p className="text-xs text-text-400 truncate">{user?.email || 'user@company.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
