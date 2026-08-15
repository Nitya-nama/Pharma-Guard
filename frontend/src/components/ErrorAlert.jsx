import React from 'react';
import { HiExclamationCircle, HiRefresh } from 'react-icons/hi';

export default function ErrorAlert({ title = 'An error occurred', message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start space-x-3">
        <HiExclamationCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-red-900">{title}</h4>
          <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
            {message || 'Unable to communicate with the backend server. Please verify your connection or VITE_API_URL.'}
          </p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <HiRefresh className="w-4 h-4 mr-1.5" />
          Retry Request
        </button>
      )}
    </div>
  );
}
