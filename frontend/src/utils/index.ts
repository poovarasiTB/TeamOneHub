import DOMPurify from 'dompurify';
import { sanitizeHtml, sanitizeText, sanitizeUrl, isValidEmail, isPasswordStrong } from '../utils/sanitizer';
import { ErrorBoundary } from './ErrorBoundary';
import { RetryBoundary } from './RetryBoundary';

// Re-export all safety utilities
export {
  DOMPurify,
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  isValidEmail,
  isPasswordStrong,
  ErrorBoundary,
  RetryBoundary,
};

// Export hooks
export {
  useRouteGuard,
  useCanAccess,
  useRequireRole,
  useRequirePermission,
} from './hooks/routeGuard';

export {
  useAutoLogout,
  useSessionWarning,
} from './hooks/session';

export {
  useOnlineStatus,
  useVisibilityChange,
  useBeforeUnload,
  useKeyboardShortcut,
  useIsMobile,
  useClipboard,
  useLocalStorage,
} from './hooks/safety';
