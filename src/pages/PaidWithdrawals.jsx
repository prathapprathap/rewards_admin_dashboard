import { useEffect, useState } from 'react';
import { FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import { getWithdrawals } from '../api';

const PaidWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPaidWithdrawals();
    }, []);

    const fetchPaidWithdrawals = async () => {
        try {
            const data = await getWithdrawals();
            const completed = data.filter(w => w.status.toLowerCase() === 'completed');
            setWithdrawals(completed);
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const totalPaid = withdrawals.reduce((sum, w) => sum + parseFloat(w.amount), 0);

    return (
        <div className="p-8 min-h-screen">
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
                        <p className="text-green-100 text-sm">Total Paid Amount</p>
                        <p className="text-4xl font-bold">₹{totalPaid.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">User</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Method</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Details</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Paid Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {withdrawals.map((withdrawal) => (
                            <tr key={withdrawal.id} className="hover:bg-green-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{withdrawal.user_name}</td>
                                <td className="px-6 py-4 font-bold text-lg text-green-600">₹{withdrawal.amount}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{withdrawal.method}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{withdrawal.payment_details}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(withdrawal.completed_at || withdrawal.requested_at).toLocaleDateString('en-IN')}
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
                {withdrawals.length === 0 && (
                    <div className="text-center py-16">
                        <FaMoneyBillWave size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No paid withdrawals yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaidWithdrawals;
