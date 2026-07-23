'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function SimpleModal({ isOpen, onClose, size = 'md', children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[size] || 'max-w-md';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl w-full ${sizeClass} max-h-[90vh] overflow-y-auto shadow-xl`}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export function SimpleModalHeader({ children }) {
  return <div className="px-6 pt-6 pb-2"><h3 className="text-lg font-semibold text-gray-900">{children}</h3></div>;
}

export function SimpleModalBody({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function SimpleModalFooter({ children }) {
  return <div className="px-6 pb-6 pt-2 flex justify-end gap-2">{children}</div>;
}
