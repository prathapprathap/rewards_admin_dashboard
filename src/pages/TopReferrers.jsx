import { useEffect, useState } from 'react';
import { FaCrown, FaPen, FaTrophy } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getTopReferrers, updateReferralCount } from '../api';

const TopReferrers = () => {
    const [referrers, setReferrers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTopReferrers = async () => {
        try {
            const data = await getTopReferrers();
            setReferrers(data);
        } catch (error) {
            console.error('Error fetching top referrers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopReferrers();
    }, []);

    const handleEditCount = async (user) => {
        const { value } = await Swal.fire({
            title: 'Edit Referral Count',
            html: `<div class="text-sm text-gray-500 mb-2">${user.name || user.email}</div>
                   <div class="text-xs text-gray-400">Real referrals: <b>${user.real_referrals ?? user.total_referrals}</b> · Current adjustment: <b>${user.referral_count_adjustment ?? 0}</b></div>`,
            input: 'number',
            inputValue: user.total_referrals,
            inputAttributes: { min: 0, step: 1 },
            showCancelButton: true,
            confirmButtonText: 'Save',
            confirmButtonColor: '#4f46e5',
            inputValidator: (v) => {
                const n = parseInt(v, 10);
                if (Number.isNaN(n) || n < 0) return 'Enter a non-negative number';
            },
        });
        if (value === undefined) return;
        try {
            await updateReferralCount(user.id, parseInt(value, 10));
            await Swal.fire({
                icon: 'success',
                title: 'Updated',
                timer: 1200,
                showConfirmButton: false,
            });
            fetchTopReferrers();
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Failed', text: e.response?.data?.message || e.message });
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
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <FaCrown className="text-yellow-500" />
                    Top Referrers
                </h2>
                <p className="text-gray-600">Top users with the highest referral counts — tap the pen icon to adjust.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {referrers.slice(0, 3).map((user, index) => (
                    <div key={user.id} className={`bg-white rounded-2xl shadow-lg p-6 border-t-4 ${index === 0 ? 'border-yellow-400' : index === 1 ? 'border-gray-300' : 'border-orange-400'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                {index + 1}
                            </div>
                            <FaTrophy className={index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'} size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Referrals</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-black text-indigo-600">{user.total_referrals}</p>
                                    <button
                                        onClick={() => handleEditCount(user)}
                                        title="Edit referral count"
                                        className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                                    >
                                        <FaPen size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Wallet</p>
                                <p className="text-xl font-bold text-green-600">₹{user.wallet_balance}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Rank</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">User</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Device Id</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Referrals</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Refer Code</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Edit</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {referrers.slice(3).map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-gray-500">{index + 4}</td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{user.device_id || '-'}</td>
                                <td className="px-6 py-4 font-bold text-indigo-600">
                                    {user.total_referrals}
                                    {user.referral_count_adjustment ? (
                                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                                            ({user.referral_count_adjustment > 0 ? '+' : ''}{user.referral_count_adjustment} adj)
                                        </span>
                                    ) : null}
                                </td>
                                <td className="px-6 py-4 font-bold text-green-600">{user.referral_code || '-'}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleEditCount(user)}
                                        className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                                        title="Edit referral count"
                                    >
                                        <FaPen size={12} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopReferrers;
