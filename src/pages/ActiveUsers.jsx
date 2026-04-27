import { useEffect, useState } from 'react';
import { FaUserCheck, FaUsers } from 'react-icons/fa';
import { getUsers } from '../api';

const ActiveUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                const data = await getUsers();
                const recentThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const active = data.filter((user) => {
                    const lastLogin = user.last_login_at ? new Date(user.last_login_at) : null;
                    const createdAt = user.created_at ? new Date(user.created_at) : null;
                    return (
                        (lastLogin && lastLogin >= recentThreshold) ||
                        (createdAt && createdAt >= recentThreshold) ||
                        parseFloat(user.wallet_balance || 0) > 0
                    );
                });
                setUsers(active);
            } catch (error) {
                console.error('Error fetching active users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchActiveUsers();
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
                    <FaUserCheck className="text-green-600" />
                    Active Users
                </h2>
                <p className="text-gray-600">Users with a recent login, recent join, or wallet activity</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">S.No</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Balance</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Last Login</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-green-50/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                                                {user.name ? user.name[0].toUpperCase() : 'U'}
                                            </div>
                                            <span className="font-semibold text-gray-800">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 font-bold text-indigo-600">₹{user.wallet_balance}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {user.last_login_at
                                            ? new Date(user.last_login_at).toLocaleString('en-IN')
                                            : 'Not available'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">Online</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="text-center py-16">
                        <FaUsers size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No active users found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveUsers;
