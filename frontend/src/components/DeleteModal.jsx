import React from 'react';
import { HiExclamation, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteModal({ isOpen, onClose, onConfirm, predictionId, isDeleting }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <HiExclamation className="w-6 h-6" />
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Delete Prediction Record?
            </h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to delete prediction <span className="font-semibold text-slate-800">#{predictionId}</span>? This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-red-500/20 disabled:opacity-50 transition-all flex items-center"
            >
              {isDeleting ? 'Deleting...' : 'Delete Record'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
