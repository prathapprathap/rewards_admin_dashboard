import { useEffect, useMemo, useState } from 'react';
import { FaCheck, FaClock, FaDownload, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getWithdrawals, updateWithdrawalStatus } from '../api';
import Pagination from '../components/Pagination';
import { usePagination } from '../components/usePagination';
import WithdrawalDetailsCell from '../components/WithdrawalDetailsCell';
import { downloadWithdrawalsCsv, withinDateRange, todayStr } from '../utils/withdrawals';

const PendingWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selected, setSelected] = useState(() => new Set());

    useEffect(() => {
        fetchPendingWithdrawals();
    }, []);

    const fetchPendingWithdrawals = async () => {
        try {
            const data = await getWithdrawals();
            const pending = data.filter(w => w.status.toLowerCase() === 'pending');
            setWithdrawals(pending);
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(
        () => withdrawals.filter(w => withinDateRange(w.created_at, fromDate, toDate)),
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

    const downloadOne = (w) => downloadWithdrawalsCsv([w], `withdrawal-${w.id}.csv`);

    const downloadSelected = () => {
        const rows = filtered.filter(w => selected.has(w.id));
        if (rows.length === 0) {
            Swal.fire('No selection', 'Please select at least one request to download.', 'info');
            return;
        }
        downloadWithdrawalsCsv(rows, `pending-withdrawals-${rows.length}.csv`);
    };

    const downloadAllFiltered = () => {
        if (filtered.length === 0) return;
        downloadWithdrawalsCsv(filtered, `pending-withdrawals-all.csv`);
    };

    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: 'Approve Payment?',
            text: "Have you processed the payment to this user?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Approved!'
        });

        if (result.isConfirmed) {
            try {
                await updateWithdrawalStatus(id, 'APPROVED');
                Swal.fire('Success!', 'Withdrawal approved successfully.', 'success');
                fetchPendingWithdrawals();
            } catch {
                Swal.fire('Error!', 'Failed to approve withdrawal.', 'error');
            }
        }
    };

    const handleReject = async (id) => {
        const result = await Swal.fire({
            title: 'Reject Request?',
            text: "Are you sure you want to reject this withdrawal?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Reject!'
        });

        if (result.isConfirmed) {
            try {
                await updateWithdrawalStatus(id, 'REJECTED');
                Swal.fire('Rejected', 'Withdrawal has been rejected.', 'info');
                fetchPendingWithdrawals();
            } catch {
                Swal.fire('Error!', 'Failed to reject withdrawal.', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const selectedCount = filtered.filter(w => selected.has(w.id)).length;

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <FaClock className="text-yellow-600" />
                    Pending Withdrawals
                </h2>
                <p className="text-gray-600">Withdrawal requests awaiting approval</p>
            </div>

            {/* Filters + download toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-end gap-4">
                <button
                    onClick={setToday}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all text-sm font-semibold"
                >
                    Today
                </button>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">From</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">To</label>
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
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all text-sm font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
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
                        <thead className="bg-gradient-to-r from-yellow-50 to-orange-50">
                            <tr>
                                <th className="px-4 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={allFilteredSelected}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Date Requested</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {pagedWithdrawals.map((withdrawal) => (
                                <tr key={withdrawal.id} className="hover:bg-yellow-50/50 transition-colors">
                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selected.has(withdrawal.id)}
                                            onChange={() => toggleSelect(withdrawal.id)}
                                            className="w-4 h-4 accent-indigo-600 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{withdrawal.name}</div>
                                        <div className="text-xs text-gray-500">{withdrawal.email}</div>
                                        {withdrawal.mobile && (
                                            <div className="text-xs text-gray-400">📱 {withdrawal.mobile}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-lg text-yellow-600">₹{withdrawal.amount}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{withdrawal.method}</td>
                                    <td className="px-6 py-4">
                                        <WithdrawalDetailsCell method={withdrawal.method} details={withdrawal.details} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(withdrawal.created_at).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(withdrawal.id)}
                                                className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-all flex items-center gap-1 text-sm"
                                            >
                                                <FaCheck /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(withdrawal.id)}
                                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all flex items-center gap-1 text-sm"
                                            >
                                                <FaTimes /> Reject
                                            </button>
                                            <button
                                                onClick={() => downloadOne(withdrawal)}
                                                title="Download this request"
                                                className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-all flex items-center gap-1 text-sm"
                                            >
                                                <FaDownload />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalItems={total} pageSize={pageSize} onPageChange={setCurrentPage} />
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <FaClock size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">
                            {withdrawals.length === 0 ? 'No pending withdrawals' : 'No requests in this date range'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingWithdrawals;
