import React from 'react';
import { HiShieldCheck } from 'react-icons/hi';

export default function LoadingSpinner({ message = 'Loading PharmaGuard AI data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <HiShieldCheck className="w-7 h-7 text-blue-600 absolute" />
      </div>
      <p className="text-sm font-semibold text-slate-600 animate-pulse">{message}</p>
    </div>
  );
}
