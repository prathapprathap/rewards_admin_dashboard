import { useEffect, useState } from 'react';
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getWithdrawals } from '../api';

const PendingWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

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
                await updateWithdrawalStatus(id, 'COMPLETED');
                Swal.fire('Success!', 'Withdrawal approved successfully.', 'success');
                fetchPendingWithdrawals();
            } catch (error) {
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
            } catch (error) {
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

    return (
        <div className="p-8 min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <FaClock className="text-yellow-600" />
                    Pending Withdrawals
                </h2>
                <p className="text-gray-600">Withdrawal requests awaiting approval</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-yellow-50 to-orange-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">User</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Method</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Details</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {withdrawals.map((withdrawal) => (
                            <tr key={withdrawal.id} className="hover:bg-yellow-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{withdrawal.user_name}</td>
                                <td className="px-6 py-4 font-bold text-lg text-yellow-600">₹{withdrawal.amount}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{withdrawal.method}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{withdrawal.payment_details}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(withdrawal.requested_at).toLocaleDateString('en-IN')}
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
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {withdrawals.length === 0 && (
                    <div className="text-center py-16">
                        <FaClock size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No pending withdrawals</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingWithdrawals;
