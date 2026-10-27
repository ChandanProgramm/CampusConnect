import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="toast-banner" onClick={onClose} role="alert">
      {type === 'success' ? (
        <CheckCircle2 size={18} color="#22C55E" />
      ) : (
        <AlertCircle size={18} color="#F59E0B" />
      )}
      <span>{message}</span>
    </div>
  );
}
