import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/Card';
import { Button } from '../../../components/Button';
import toast from 'react-hot-toast';
import apiClient from '../../../lib/api';

interface SystemSettings {
  systemName: string;
  systemUrl: string;
  supportEmail: string;
  maxUploadSize: string;
  sessionTimeout: string;
  enableMFA: boolean;
  enableAuditLog: boolean;
  enableNotifications: boolean;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultRole: string;
}

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: 'TeamOne',
    systemUrl: 'https://teamone.local',
    supportEmail: 'support@teamone.local',
    maxUploadSize: '50',
    sessionTimeout: '30',
    enableMFA: true,
    enableAuditLog: true,
    enableNotifications: true,
    maintenanceMode: false,
    allowRegistration: false,
    defaultRole: 'user',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/admin/settings');
      setSettings({ ...settings, ...response.data });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.patch('/admin/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">System Settings</h1>
          <p className="text-text-400 mt-1">Configure system-wide settings</p>
        </div>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">General Settings</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-text-400 mb-2">System Name</label>
              <input
                type="text"
                value={settings.systemName}
                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm text-text-400 mb-2">System URL</label>
              <input
                type="url"
                value={settings.systemUrl}
                onChange={(e) => setSettings({ ...settings, systemUrl: e.target.value })}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm text-text-400 mb-2">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">Security Settings</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-100 font-medium">Multi-Factor Authentication (MFA)</h3>
                <p className="text-sm text-text-400">Require MFA for all users</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enableMFA: !settings.enableMFA })}
                className={`w-14 h-7 rounded-full transition-colors ${
                  settings.enableMFA ? 'bg-primary-500' : 'bg-bg-700'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.enableMFA ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm text-text-400 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm text-text-400 mb-2">Default User Role</label>
              <select
                value={settings.defaultRole}
                onChange={(e) => setSettings({ ...settings, defaultRole: e.target.value })}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-100">System Configuration</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-100 font-medium">Audit Logging</h3>
                <p className="text-sm text-text-400">Log all system activities</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enableAuditLog: !settings.enableAuditLog })}
                className={`w-14 h-7 rounded-full transition-colors ${
                  settings.enableAuditLog ? 'bg-primary-500' : 'bg-bg-700'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.enableAuditLog ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-100 font-medium">Notifications</h3>
                <p className="text-sm text-text-400">Enable system notifications</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                className={`w-14 h-7 rounded-full transition-colors ${
                  settings.enableNotifications ? 'bg-primary-500' : 'bg-bg-700'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.enableNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-text-100 font-medium">Maintenance Mode</h3>
                <p className="text-sm text-text-400">Disable access for regular users</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`w-14 h-7 rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-warning' : 'bg-bg-700'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm text-text-400 mb-2">Max Upload Size (MB)</label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
                className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
