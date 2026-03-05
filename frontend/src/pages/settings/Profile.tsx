import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, updateProfile } = useAuthStore();
  const { theme, setTheme } = useUIStore();

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-100 mb-6">Profile Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-800 rounded-2xl p-6 border border-border-12">
          <h2 className="text-xl font-semibold text-text-100 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-400 mb-1">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm text-text-400 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-400 cursor-not-allowed"
              />
            </div>
            <Button onClick={() => toast.success('Profile updated!')}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="bg-surface-800 rounded-2xl p-6 border border-border-12">
          <h2 className="text-xl font-semibold text-text-100 mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-400 mb-2">Theme</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-primary-700 text-white'
                      : 'bg-bg-800 text-text-400 hover:text-text-100'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-primary-700 text-white'
                      : 'bg-bg-800 text-text-400 hover:text-text-100'
                  }`}
                >
                  Light
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
