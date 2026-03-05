import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

interface RouteGuardOptions {
  requireAuth?: boolean;
  requireRole?: string[];
  requirePermission?: string[];
  redirectPath?: string;
}

/**
 * RouteGuard - Protects routes based on authentication and authorization
 */
export function useRouteGuard(options: RouteGuardOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  
  const {
    requireAuth = true,
    requireRole = [],
    requirePermission = [],
    redirectPath = '/login',
  } = options;

  useEffect(() => {
    // Check authentication
    if (requireAuth && !isAuthenticated) {
      navigate(redirectPath, { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    // Check role-based access
    if (requireRole.length > 0 && user) {
      const hasRequiredRole = requireRole.some(role => 
        user.roles.includes(role)
      );
      
      if (!hasRequiredRole) {
        navigate('/401', { replace: true });
        return;
      }
    }

    // Check permission-based access
    if (requirePermission.length > 0 && user) {
      const hasRequiredPermission = requirePermission.every(permission =>
        user.roles.some(role => role.includes(permission))
      );
      
      if (!hasRequiredPermission) {
        navigate('/401', { replace: true });
        return;
      }
    }
  }, [
    isAuthenticated,
    user,
    requireAuth,
    requireRole,
    requirePermission,
    redirectPath,
    navigate,
    location.pathname,
  ]);

  return {
    isAllowed: isAuthenticated || !requireAuth,
    hasRole: requireRole.length === 0 || (user?.roles.some(r => requireRole.includes(r)) ?? false),
    hasPermission: requirePermission.length === 0,
  };
}

/**
 * useCanAccess - Check if user can access a resource
 */
export function useCanAccess(requiredRole?: string[], requiredPermission?: string[]) {
  const { user } = useAuthStore();

  if (!user) return false;

  const hasRole = !requiredRole || requiredRole.some(role => 
    user.roles.includes(role)
  );

  const hasPermission = !requiredPermission || requiredPermission.every(permission =>
    user.roles.some(role => role.includes(permission))
  );

  return hasRole && hasPermission;
}

/**
 * useRequireRole - Hook to require specific role
 */
export function useRequireRole(role: string) {
  const { user } = useAuthStore();
  return user?.roles.includes(role) ?? false;
}

/**
 * useRequirePermission - Hook to require specific permission
 */
export function useRequirePermission(permission: string) {
  const { user } = useAuthStore();
  return user?.roles.some(role => role.includes(permission)) ?? false;
}

export default {
  useRouteGuard,
  useCanAccess,
  useRequireRole,
  useRequirePermission,
};
