import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import HistoryTable from '../components/HistoryTable';
import DeleteModal from '../components/DeleteModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { HiClipboardList, HiRefresh } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function History() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);

  // Deletion modal state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistory();
      setHistoryData(data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch prediction history.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/history/${id}`);
  };

  const handleDeletePrompt = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteHistory(deleteId);
      toast.success(`Prediction #${deleteId} deleted.`);
      setHistoryData((prev) => prev.filter((item) => (item.id || item.prediction_id) !== deleteId));
      setDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete prediction record.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-8 pb-16"
    >
      
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-900 mb-2">
            <HiClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Historical Clinical Audit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Prediction History
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Audit logs of generated pharmacogenomic risk predictions, confidence scores, and timestamps.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0"
        >
          <HiRefresh className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
          Refresh Table
        </button>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchHistory} />}

      {loading ? (
        <LoadingSpinner message="Retrieving prediction logs from backend repository..." />
      ) : (
        <HistoryTable
          historyData={historyData}
          onView={handleViewDetails}
          onDelete={handleDeletePrompt}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        predictionId={deleteId}
        isDeleting={isDeleting}
      />

    </motion.div>
  );
}
