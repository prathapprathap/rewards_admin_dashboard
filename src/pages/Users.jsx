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
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 font-sans">
            {/* Header section with Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">Engagement Analytics</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">USER <span className="text-indigo-600">DIRECTORY</span></h1>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-indigo-900">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Rank</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Subscriber Profile</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Contact Node</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Credit Value</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Entry Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-6 text-sm font-black text-gray-300 group-hover:text-indigo-600 transition-colors">
                                        #{String(index + 1).padStart(3, '0')}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                                {user.name ? user.name[0].toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{user.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Member</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-gray-600">{user.email}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs font-black text-indigo-600 tracking-tighter">₹</span>
                                            <span className="text-xl font-black text-indigo-600 tracking-tighter">{user.wallet_balance || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                            {new Date(user.created_at).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-20 bg-gray-50/50">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6 shadow-sm">
                            <FaUsers size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Records Detected</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">Your database is currently empty of active user records.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
