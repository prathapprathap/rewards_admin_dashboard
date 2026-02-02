import { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { getUsers } from '../api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
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
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <FaUsers className="text-indigo-600" />
                    Users
                </h2>
                <p className="text-gray-600">Manage and view all registered users</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    S.No
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Balance
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Joined
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-indigo-50/50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10">
                                                {user.profile_pic ? (
                                                    <img className="w-full h-full rounded-full ring-2 ring-indigo-200" src={user.profile_pic} alt={user.name} />
                                                ) : (
                                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                                        {user.name ? user.name[0].toUpperCase() : 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {user.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-700">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1.5 text-sm font-bold text-green-700 bg-green-100 rounded-full">
                                            ₹{user.wallet_balance || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-16">
                        <FaUsers size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
