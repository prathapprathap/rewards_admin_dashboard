import { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaDownload, FaMoneyBillWave } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getWithdrawals } from '../api';
import Pagination from '../components/Pagination';
import { usePagination } from '../components/usePagination';
import WithdrawalDetailsCell from '../components/WithdrawalDetailsCell';
import { downloadWithdrawalsCsv, withinDateRange, todayStr } from '../utils/withdrawals';

// The real "paid" date is paid_at (set when the admin approves). Older records
// created before that column existed fall back to created_at.
const paidDate = (w) => w.paid_at || w.created_at;

const PaidWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selected, setSelected] = useState(() => new Set());

    useEffect(() => {
        fetchPaidWithdrawals();
    }, []);

    const fetchPaidWithdrawals = async () => {
        try {
            const data = await getWithdrawals();
            const completed = data.filter(w => w.status.toLowerCase() === 'approved');
            setWithdrawals(completed);
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter by the paid date, since that's what this page is about.
    const filtered = useMemo(
        () => withdrawals.filter(w => withinDateRange(paidDate(w), fromDate, toDate)),
        [withdrawals, fromDate, toDate]
    );

    const { currentPage, setCurrentPage, pageItems: pagedWithdrawals, total, pageSize } = usePagination(filtered);

    const setToday = () => {
        const t = todayStr();
        setFromDate(t);
        setToDate(t);
        setCurrentPage(1);
    };

    const clearFilter = () => {
        setFromDate('');
        setToDate('');
        setCurrentPage(1);
    };

    const toggleSelect = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const allFilteredSelected = filtered.length > 0 && filtered.every(w => selected.has(w.id));
    const toggleSelectAll = () => {
        setSelected(prev => {
            if (allFilteredSelected) {
                const next = new Set(prev);
                filtered.forEach(w => next.delete(w.id));
                return next;
            }
            const next = new Set(prev);
            filtered.forEach(w => next.add(w.id));
            return next;
        });
    };

    const downloadSelected = () => {
        const rows = filtered.filter(w => selected.has(w.id));
        if (rows.length === 0) {
            Swal.fire('No selection', 'Please select at least one request to download.', 'info');
            return;
        }
        downloadWithdrawalsCsv(rows, `paid-withdrawals-${rows.length}.csv`);
    };

    const downloadAllFiltered = () => {
        if (filtered.length === 0) return;
        downloadWithdrawalsCsv(filtered, `paid-withdrawals-all.csv`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const totalPaid = filtered.reduce((sum, w) => sum + parseFloat(w.amount), 0);
    const selectedCount = filtered.filter(w => selected.has(w.id)).length;

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <FaCheckCircle className="text-green-600" />
                    Paid Withdrawals
                </h2>
                <p className="text-gray-600">Successfully completed withdrawal requests</p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-6 text-white">
                <div className="flex items-center gap-4">
                    <FaMoneyBillWave size={48} />
                    <div>
                        <p className="text-green-100 text-sm">Total Paid Amount{(fromDate || toDate) ? ' (filtered)' : ''}</p>
                        <p className="text-4xl font-bold">₹{totalPaid.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Filters + download toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-end gap-4">
                <button
                    onClick={setToday}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all text-sm font-semibold"
                >
                    Today
                </button>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">Paid From</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">Paid To</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                </div>
                {(fromDate || toDate) && (
                    <button
                        onClick={clearFilter}
                        className="text-sm text-gray-500 hover:text-gray-700 underline pb-2"
                    >
                        Clear
                    </button>
                )}

                <div className="flex-1" />

                <button
                    onClick={downloadSelected}
                    disabled={selectedCount === 0}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all text-sm font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <FaDownload /> Download Selected ({selectedCount})
                </button>
                <button
                    onClick={downloadAllFiltered}
                    disabled={filtered.length === 0}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all text-sm font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <FaDownload /> Download All ({filtered.length})
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                            <tr>
                                <th className="px-4 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={allFilteredSelected}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 accent-emerald-600 cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Requested</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Paid Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {pagedWithdrawals.map((withdrawal) => (
                                <tr key={withdrawal.id} className="hover:bg-green-50/50 transition-colors">
                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selected.has(withdrawal.id)}
                                            onChange={() => toggleSelect(withdrawal.id)}
                                            className="w-4 h-4 accent-emerald-600 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{withdrawal.name}</div>
                                        <div className="text-xs text-gray-500">{withdrawal.email}</div>
                                        {withdrawal.mobile && (
                                            <div className="text-xs text-gray-400">📱 {withdrawal.mobile}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-lg text-green-600">₹{withdrawal.amount}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{withdrawal.method}</td>
                                    <td className="px-6 py-4">
                                        <WithdrawalDetailsCell method={withdrawal.method} details={withdrawal.details} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(withdrawal.created_at).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                        {new Date(paidDate(withdrawal)).toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                                            <FaCheckCircle /> Paid
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalItems={total} pageSize={pageSize} onPageChange={setCurrentPage} />
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <FaMoneyBillWave size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">
                            {withdrawals.length === 0 ? 'No paid withdrawals yet' : 'No paid withdrawals in this date range'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaidWithdrawals;
