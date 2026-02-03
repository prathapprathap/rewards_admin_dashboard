import { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaTrash, FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { deleteUser, getUsers, updateUserBalance } from '../api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null);
    const [newBalance, setNewBalance] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Terminate User Node?',
            text: "This action is irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, terminate!'
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                Swal.fire('Deleted!', 'User has been removed.', 'success');
                fetchUsers();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete user.', 'error');
            }
        }
    };

    const handleEditClick = (user) => {
        setEditUser(user);
        setNewBalance(user.wallet_balance || 0);
    };

    const handleUpdateBalance = async (e) => {
        e.preventDefault();
        try {
            await updateUserBalance(editUser.id, newBalance);
            setEditUser(null);
            Swal.fire({
                icon: 'success',
                title: 'Synchronized!',
                text: 'User credit value updated.',
                timer: 2000,
                showConfirmButton: false
            });
            fetchUsers();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to update balance.';
            Swal.fire('Error!', errorMsg, 'error');
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
                                <th className="px-8 py-6 text-center text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Protocols</th>
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
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
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

            {/* Edit Balance Modal */}
            {editUser && (
                <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
                        <div className="bg-indigo-900 p-8 text-white relative overflow-hidden">
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black tracking-tight uppercase leading-none">Credit Mod</h3>
                                    <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Subscriber: {editUser.name}</p>
                                </div>
                                <button onClick={() => setEditUser(null)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <FaTimes size={18} />
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[40px]"></div>
                        </div>

                        <form onSubmit={handleUpdateBalance} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Current Wallet Value (₹)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="0.00"
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-indigo-600"
                                    value={newBalance}
                                    onChange={(e) => setNewBalance(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-[10px] tracking-widest uppercase">
                                AUTHORIZE CREDIT SYNC
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
