import React, { useState, useMemo } from 'react';
import { 
  HiSearch, 
  HiChevronLeft, 
  HiChevronRight, 
  HiEye, 
  HiTrash, 
  HiSelector,
  HiChevronUp,
  HiChevronDown
} from 'react-icons/hi';
import { formatDate } from '../utils/calculations';

export default function HistoryTable({ historyData = [], onView, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState('prediction_id');
  const [sortDirection, setSortDirection] = useState('desc');

  // Risk level badge mapping
  const getRiskBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900';
      case 'high':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'moderate':
        return 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900';
      case 'safe':
      default:
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
    }
  };

  // Search filtering
  const filteredData = useMemo(() => {
    return historyData.filter((item) => {
      const term = searchTerm.toLowerCase();
      const idStr = String(item.id || item.prediction_id || '').toLowerCase();
      const riskStr = String(item.risk_level || item.prediction || '').toLowerCase();
      const geneStr = String(item.patient?.primary_gene || item.primary_gene || '').toLowerCase();
      const nameStr = String(item.patient?.patient_name || item.patient_name || '').toLowerCase();
      return idStr.includes(term) || riskStr.includes(term) || geneStr.includes(term) || nameStr.includes(term);
    });
  }, [historyData, searchTerm]);

  // Sorting
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aVal = a[sortField] ?? a.prediction_id ?? a.id;
      let bVal = b[sortField] ?? b.prediction_id ?? b.id;

      if (sortField === 'confidence') {
        aVal = parseFloat(a.confidence || 0);
        bVal = parseFloat(b.confidence || 0);
      } else if (sortField === 'created_at' || sortField === 'timestamp') {
        aVal = new Date(a.created_at || a.timestamp || 0).getTime();
        bVal = new Date(b.created_at || b.timestamp || 0).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <HiSelector className="w-4 h-4 text-slate-400 ml-1 inline" />;
    return sortDirection === 'asc' ? (
      <HiChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-1 inline" />
    ) : (
      <HiChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-1 inline" />
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
      
      {/* Table Header Toolbar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Prediction Logs</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Historical records of generated patient risk evaluations</p>
        </div>

        <div className="relative w-full sm:w-72">
          <HiSearch className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="history-table-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search ID, risk, gene, name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th 
                onClick={() => handleSort('prediction_id')} 
                className="px-6 py-3.5 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors"
              >
                Prediction ID {renderSortIcon('prediction_id')}
              </th>
              <th 
                onClick={() => handleSort('risk_level')} 
                className="px-6 py-3.5 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors"
              >
                Risk Level {renderSortIcon('risk_level')}
              </th>
              <th 
                onClick={() => handleSort('confidence')} 
                className="px-6 py-3.5 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors"
              >
                Confidence {renderSortIcon('confidence')}
              </th>
              <th 
                onClick={() => handleSort('created_at')} 
                className="px-6 py-3.5 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors"
              >
                Timestamp {renderSortIcon('created_at')}
              </th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => {
                const id = row.id || row.prediction_id;
                const risk = row.risk_level || row.prediction || 'Unknown';
                const confidence = row.confidence ? (row.confidence * 100).toFixed(1) + '%' : 'N/A';
                const dateStr = formatDate(row.created_at || row.timestamp);

                return (
                  <tr key={id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      #{id}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadge(risk)}`}>
                        {risk}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-semibold">
                      {confidence}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {dateStr}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        id={`history-view-btn-${id}`}
                        onClick={() => onView(id)}
                        className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title="View Prediction Details"
                      >
                        <HiEye className="w-4 h-4" />
                      </button>

                      <button
                        id={`history-delete-btn-${id}`}
                        onClick={() => onDelete(id)}
                        className="p-2 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        title="Delete Record"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-400 dark:text-slate-500">
                  No prediction records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{paginatedData.length}</span> of{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredData.length}</span> records
        </p>

        <div className="flex items-center space-x-2">
          <button
            id="history-prev-page-btn"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            id="history-next-page-btn"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
}
