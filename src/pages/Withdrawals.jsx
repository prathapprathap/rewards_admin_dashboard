import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
            case 'APPROVED': return 'text-green-600 bg-green-100';
            case 'REJECTED': return 'text-red-600 bg-red-100';
            default: return 'text-yellow-600 bg-yellow-100';
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Withdrawal Requests</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {withdrawals.map((withdrawal) => (
                                <tr key={withdrawal.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{withdrawal.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{withdrawal.name}</div>
                                        <div className="text-sm text-gray-500">{withdrawal.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₹{withdrawal.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{withdrawal.method}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{withdrawal.details}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(withdrawal.status)}`}>
                                            {withdrawal.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(withdrawal.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {withdrawal.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(withdrawal.id, 'APPROVED')}
                                                    className="text-green-600 hover:text-green-800"
                                                    title="Approve"
                                                >
                                                    <FaCheck size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(withdrawal.id, 'REJECTED')}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Reject"
                                                >
                                                    <FaTimes size={18} />
                                                </button>
                                            </div>
                                        )}
                                        {withdrawal.status !== 'PENDING' && (
                                            <span className="text-gray-400">No action</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {withdrawals.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No withdrawal requests</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Withdrawals;
