import { useAuthStore } from '../store/authStore';
import { useEffect, useCallback } from 'react';

/**
 * Auto-logout on inactivity
 */
export function useAutoLogout(timeoutMinutes: number = 30) {
  const { logout } = useAuthStore();

  const resetTimer = useCallback(() => {
    const timeout = setTimeout(() => {
      logout();
    }, timeoutMinutes * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [logout, timeoutMinutes]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const resetInactivityTimer = () => {
      resetTimer();
    };

    // Set initial timer
    const cleanup = resetTimer();

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    return () => {
      cleanup();
      events.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [resetTimer]);
}

/**
 * Session timeout warning
 */
export function useSessionWarning(warningMinutes: number = 5) {
  const { logout } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const warningTimeout = setTimeout(() => {
      setShowWarning(true);
      
      // Auto logout after warning period
      const logoutTimeout = setTimeout(() => {
        logout();
      }, warningMinutes * 60 * 1000);

      return () => clearTimeout(logoutTimeout);
    }, (30 - warningMinutes) * 60 * 1000); // Assuming 30 min session

    return () => clearTimeout(warningTimeout);
  }, [logout, warningMinutes]);

  const extendSession = useCallback(() => {
    setShowWarning(false);
    // Reset session timer (implement based on your auth system)
  }, []);

  return { showWarning, extendSession };
}

/**
 * Force HTTPS in production
 */
export function useForceHTTPS() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
      window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`;
    }
  }, []);
}

/**
 * Prevent clickjacking
 */
export function useClickJackingProtection() {
  useEffect(() => {
    if (window.self !== window.top) {
      // We're in an iframe - could be clickjacking
      document.body.innerHTML = '';
      window.location.href = window.location.href;
    }
  }, []);
}

export default {
  useAutoLogout,
  useSessionWarning,
  useForceHTTPS,
  useClickJackingProtection,
};
