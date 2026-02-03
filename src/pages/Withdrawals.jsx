import { useEffect, useState } from 'react';
import { FaCheck, FaMoneyBillWave, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getWithdrawals, updateWithdrawalStatus } from '../api';

const Withdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const data = await getWithdrawals();
            setWithdrawals(data);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch withdrawals.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        const result = await Swal.fire({
            title: `Confirm ${status.toLowerCase()}?`,
            text: `Are you sure you want to mark this withdrawal as ${status.toLowerCase()}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: status === 'APPROVED' ? '#10b981' : '#ef4444',
            confirmButtonText: 'Yes, proceed'
        });

        if (result.isConfirmed) {
            try {
                await updateWithdrawalStatus(id, status);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: `Withdrawal ${status.toLowerCase()} successfully`,
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchWithdrawals();
            } catch (err) {
                Swal.fire('Error', `Failed to ${status.toLowerCase()} withdrawal`, 'error');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 font-sans">
            {/* Header section with Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">Financial Operations</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">PAYOUT <span className="text-indigo-600">TRACKER</span></h1>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Compiling Records...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-indigo-900">
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Transaction</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Subscriber</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Payout Value</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Protocol</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Deployment</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Authorization</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {withdrawals.map((withdrawal) => (
                                    <tr key={withdrawal.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-8 py-6 text-sm font-black text-gray-300 group-hover:text-indigo-600 transition-colors">
                                            #{String(withdrawal.id).padStart(5, '0')}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div>
                                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{withdrawal.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{withdrawal.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs font-black text-indigo-600 tracking-tighter">₹</span>
                                                <span className="text-xl font-black text-indigo-600 tracking-tighter">{withdrawal.amount}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-500 rounded-lg border border-gray-100">
                                                {withdrawal.method}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm ${withdrawal.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                                    withdrawal.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }`}>
                                                {withdrawal.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {withdrawal.status === 'PENDING' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(withdrawal.id, 'APPROVED')}
                                                        className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm"
                                                        title="Authorize"
                                                    >
                                                        <FaCheck size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(withdrawal.id, 'REJECTED')}
                                                        className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm"
                                                        title="Decline"
                                                    >
                                                        <FaTimes size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <div className="w-2 h-2 rounded-full bg-current"></div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest">Logged</p>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {withdrawals.length === 0 && (
                        <div className="text-center py-20 bg-gray-50/50">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6 shadow-sm">
                                <FaMoneyBillWave size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Clean Ledger Detected</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">No pending or historical withdrawal nodes have been identified in the system.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Withdrawals;
