import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCheck, FaMoneyBillWave, FaTimes } from 'react-icons/fa';

const API_URL = 'https://rewards-backend-zkhh.onrender.com/api/admin';

const Withdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/withdrawals`);
            setWithdrawals(response.data);
        } catch (err) {
            setError('Failed to fetch withdrawals');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${API_URL}/withdrawals/${id}`, { status });
            setSuccess(`Withdrawal ${status.toLowerCase()} successfully`);
            fetchWithdrawals();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(`Failed to ${status.toLowerCase()} withdrawal`);
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
        <div className="p-8 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Withdrawal Requests</h2>
                <p className="text-gray-600">Review and manage user withdrawal requests</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm animate-pulse">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6 shadow-sm animate-pulse">
                    <p className="font-medium">{success}</p>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Method</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {withdrawals.map((withdrawal) => (
                                    <tr key={withdrawal.id} className="hover:bg-indigo-50/50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{withdrawal.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">{withdrawal.name}</div>
                                            <div className="text-xs text-gray-500">{withdrawal.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-lg font-bold text-indigo-600">₹{withdrawal.amount}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                                {withdrawal.method}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{withdrawal.details}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${getStatusColor(withdrawal.status)}`}>
                                                {withdrawal.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(withdrawal.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {withdrawal.status === 'PENDING' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(withdrawal.id, 'APPROVED')}
                                                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200"
                                                        title="Approve"
                                                    >
                                                        <FaCheck size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(withdrawal.id, 'REJECTED')}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                                                        title="Reject"
                                                    >
                                                        <FaTimes size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {withdrawals.length === 0 && (
                        <div className="text-center py-16">
                            <FaMoneyBillWave size={64} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">No withdrawal requests</p>
                            <p className="text-gray-400 text-sm mt-2">Requests will appear here when users submit them</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Withdrawals;
