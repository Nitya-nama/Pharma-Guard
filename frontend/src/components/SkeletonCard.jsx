import React from 'react';

export default function SkeletonCard({ count = 1 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
          <div className="h-8 bg-slate-200 rounded-lg w-2/3"></div>
          <div className="h-4 bg-slate-100 rounded-md w-full"></div>
          <div className="h-4 bg-slate-100 rounded-md w-4/5"></div>
        </div>
      ))}
    </div>
  );
}
