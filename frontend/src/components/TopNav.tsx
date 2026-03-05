import { useAuthStore } from '@/store/authStore';

export function TopNav() {
  const { logout } = useAuthStore();

  return (
    <header className="bg-surface-800 border-b border-border-12 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search..."
            className="px-4 py-2 bg-bg-800 border border-border-12 rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-text-400 hover:text-text-100 transition-colors">
            🔔
          </button>
          <button className="p-2 text-text-400 hover:text-text-100 transition-colors">
            ❓
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-bg-800 hover:bg-bg-700 rounded-xl text-text-400 hover:text-text-100 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
