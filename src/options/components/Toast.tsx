/**
 * Toast notification component
 */

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success:
      'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  };

  const textColor = {
    success: 'text-green-800 dark:text-green-200',
    error: 'text-red-800 dark:text-red-200',
    info: 'text-blue-800 dark:text-blue-200',
  };

  const icon = {
    success: '✓',
    error: '✗',
    info: 'ℹ',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColor[type]} ${textColor[type]} animate-slide-up`}
      role="alert"
    >
      <span className="text-lg font-bold">{icon[type]}</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-xl leading-none hover:opacity-70"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
