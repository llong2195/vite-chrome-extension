/**
 * Toast notification component - wrapper around sonner
 * This component is kept for backwards compatibility but we'll use sonner's toast() function directly
 */

import React, { useEffect } from 'react';
import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

/**
 * Legacy Toast component - use toast() from sonner directly instead
 * This is kept for backwards compatibility with existing code
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    // Show toast using sonner
    const toastId = sonnerToast[type](message, {
      duration,
      onDismiss: onClose,
      onAutoClose: onClose,
    });

    return () => {
      sonnerToast.dismiss(toastId);
    };
  }, [message, type, duration, onClose]);

  // Return null as sonner handles the rendering
  return null;
};

export default Toast;

// Export toast function for direct use
// eslint-disable-next-line react-refresh/only-export-components
export { toast } from 'sonner';
