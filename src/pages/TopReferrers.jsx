import { useEffect, useState } from 'react';
import { FaCrown, FaTrophy } from 'react-icons/fa';
import { getTopReferrers } from '../api';

const TopReferrers = () => {
    const [referrers, setReferrers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchTopReferrers();
    }, []);

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
                    <FaCrown className="text-yellow-500" />
                    Top Referrers
                </h2>
                <p className="text-gray-600">Top users with the highest real referral counts</p>
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
                                <p className="text-3xl font-black text-indigo-600">{user.total_referrals}</p>
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
                                <td className="px-6 py-4 font-bold text-indigo-600">{user.total_referrals}</td>
                                <td className="px-6 py-4 font-bold text-green-600">{user.referral_code || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopReferrers;
