import { useEffect, useState } from 'react';
import { FaTimes, FaUserCheck, FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { deleteUser, getUserDetails, getUserTransactions, getUserWithdrawals, getUsers, updateUser, updateUserBalance } from '../api';


const ActiveUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Detail modal state
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details'); // 'details' | 'transactions' | 'withdrawals'
    const [transactions, setTransactions] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);

    // Edit state
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [balanceMode, setBalanceMode] = useState(false);
    const [newBalance, setNewBalance] = useState('');

    useEffect(() => {
        fetchActiveUsers();
    }, []);

    const fetchActiveUsers = async () => {
        setLoading(true);
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

    const openDetail = async (user) => {
        setSelectedUser(null);
        setDetailLoading(true);
        setActiveTab('details');
        setEditMode(false);
        setBalanceMode(false);
        setTransactions([]);
        setWithdrawals([]);
        try {
            const detail = await getUserDetails(user.id);
            setSelectedUser(detail);
            setEditForm({
                name: detail.name || '',
                email: detail.email || '',
                phone: detail.phone || '',
                upi_id: detail.upi_id || '',
                status: detail.status || 'Active',
            });
            setNewBalance(detail.wallet_balance || 0);
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'Failed to load user details.', 'error');
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setSelectedUser(null);
        setEditMode(false);
        setBalanceMode(false);
    };

    const loadTransactions = async () => {
        if (!selectedUser) return;
        try {
            const data = await getUserTransactions(selectedUser.id);
            setTransactions(data);
        } catch (e) {
            console.error(e);
        }
    };

    const loadWithdrawals = async () => {
        if (!selectedUser) return;
        try {
            const data = await getUserWithdrawals(selectedUser.id);
            setWithdrawals(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'transactions' && transactions.length === 0) loadTransactions();
        if (tab === 'withdrawals' && withdrawals.length === 0) loadWithdrawals();
    };

    const handleEditSave = async () => {
        try {
            await updateUser(selectedUser.id, editForm);
            Swal.fire({ icon: 'success', title: 'Updated!', text: 'User details saved.', timer: 2000, showConfirmButton: false });
            setEditMode(false);
            const refreshed = await getUserDetails(selectedUser.id);
            setSelectedUser(refreshed);
            fetchActiveUsers();
        } catch (e) {
            Swal.fire('Error', e.response?.data?.message || 'Failed to update user.', 'error');
        }
    };

    const handleBalanceSave = async (e) => {
        e.preventDefault();
        try {
            await updateUserBalance(selectedUser.id, newBalance);
            Swal.fire({ icon: 'success', title: 'Balance Updated!', text: 'Wallet balance has been updated.', timer: 2000, showConfirmButton: false });
            setBalanceMode(false);
            const refreshed = await getUserDetails(selectedUser.id);
            setSelectedUser(refreshed);
            fetchActiveUsers();
        } catch (e) {
            Swal.fire('Error', e.response?.data?.message || 'Failed to update balance.', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            text: 'This action is irreversible! All user data will be permanently removed.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Delete!',
        });
        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                Swal.fire('Deleted!', 'User has been removed.', 'success');
                closeDetail();
                fetchActiveUsers();
            } catch (e) {
                Swal.fire('Error', 'Failed to delete user.', 'error');
            }
        }
    };

    const filteredUsers = users.filter((u) => {
        const q = searchQuery.toLowerCase();
        return (
            (u.email || '').toLowerCase().includes(q) ||
            (u.device_id || '').toLowerCase().includes(q) ||
            (u.upi_id || '').toLowerCase().includes(q) ||
            (u.referral_code || '').toLowerCase().includes(q) ||
            (u.phone || '').toLowerCase().includes(q)
        );
    });

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

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Email, Device ID, UPI, myrefer, Paytm Number"
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                            <tr>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">No.</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Device Id</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Balance</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">UPI</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Refer Code</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id} className="hover:bg-green-50/30 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{user.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.device_id}</td>
                                    <td className="px-4 py-3 font-bold text-gray-800">₹{user.wallet_balance}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{user.upi_id || 'no'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{user.referral_code}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => openDetail(user)}
                                            className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition-colors"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-16">
                        <FaUsers size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No active users found</p>
                    </div>
                )}
            </div>

            {/* User Detail Modal */}
            {(detailLoading || selectedUser) && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative">
                        {/* Modal Header */}
                        <div className="bg-indigo-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
                            <h3 className="text-lg font-bold">User Details</h3>
                            <button onClick={closeDetail} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                                <FaTimes size={16} />
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : selectedUser && (
                            <div className="p-6">
                                {/* Tab Switcher */}
                                <div className="flex gap-2 mb-6 border-b border-gray-200">
                                    {['details', 'transactions', 'withdrawals'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => handleTabChange(tab)}
                                            className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-colors -mb-px ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Details Tab */}
                                {activeTab === 'details' && (
                                    <div>
                                        {editMode ? (
                                            /* Edit Form */
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Name', key: 'name', type: 'text' },
                                                    { label: 'Email', key: 'email', type: 'email' },
                                                    { label: 'Phone', key: 'phone', type: 'text' },
                                                    { label: 'UPI ID', key: 'upi_id', type: 'text' },
                                                ].map(({ label, key, type }) => (
                                                    <div key={key}>
                                                        <label className="block text-xs font-semibold text-gray-500 mb-1">{label}:</label>
                                                        <input
                                                            type={type}
                                                            value={editForm[key] || ''}
                                                            onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                        />
                                                    </div>
                                                ))}
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Status:</label>
                                                    <select
                                                        value={editForm.status}
                                                        onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                    >
                                                        <option value="Active">Active</option>
                                                        <option value="Inactive">Inactive</option>
                                                        <option value="Banned">Banned</option>
                                                    </select>
                                                </div>
                                                <div className="flex gap-3 pt-2">
                                                    <button onClick={handleEditSave} className="flex-1 bg-indigo-600 text-white py-2 rounded font-bold text-sm hover:bg-indigo-700 transition-colors">
                                                        Save Changes
                                                    </button>
                                                    <button onClick={() => setEditMode(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-bold text-sm hover:bg-gray-300 transition-colors">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : balanceMode ? (
                                            /* Balance Edit Form */
                                            <form onSubmit={handleBalanceSave} className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">New Wallet Balance (₹):</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        required
                                                        value={newBalance}
                                                        onChange={e => setNewBalance(e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                    />
                                                </div>
                                                <div className="flex gap-3 pt-2">
                                                    <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded font-bold text-sm hover:bg-green-700 transition-colors">
                                                        Update Balance
                                                    </button>
                                                    <button type="button" onClick={() => setBalanceMode(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-bold text-sm hover:bg-gray-300 transition-colors">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            /* Read-only Detail View */
                                            <div>
                                                <div className="space-y-3 mb-6">
                                                    {[
                                                        { label: 'Name', value: selectedUser.name },
                                                        { label: 'Email', value: selectedUser.email },
                                                        { label: 'Phone', value: selectedUser.phone || '—' },
                                                        { label: 'Device ID', value: selectedUser.device_id },
                                                        { label: 'UPI ID', value: selectedUser.upi_id || '—' },
                                                        { label: 'Wallet Balance', value: `₹${selectedUser.wallet_balance || 0}` },
                                                        { label: 'Refer Code', value: selectedUser.referral_code },
                                                        { label: 'Referral', value: selectedUser.referred_by || '—' },
                                                        { label: 'Total Withdraw', value: `₹${selectedUser.total_withdraw_amount || 0}` },
                                                        { label: 'Today Withdraw', value: `₹${selectedUser.today_withdraw_amount || 0}` },
                                                        { label: 'Total Task', value: selectedUser.total_tasks || 0 },
                                                        { label: 'Last Login', value: selectedUser.last_login_at ? new Date(selectedUser.last_login_at).toLocaleDateString('en-IN') : '—' },
                                                        { label: 'Create date', value: selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString('en-IN') : '—' },
                                                        { label: 'Status', value: selectedUser.status || 'Active' },
                                                    ].map(({ label, value }) => (
                                                        <div key={label}>
                                                            <label className="block text-xs font-semibold text-gray-500 mb-1">{label}:</label>
                                                            <div className="w-full border border-gray-200 rounded bg-gray-50 px-3 py-2 text-sm text-gray-800">
                                                                {value}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Action Buttons matching screenshot */}
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => setEditMode(true)}
                                                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 transition-colors"
                                                    >
                                                        Update Details
                                                    </button>
                                                    <button
                                                        onClick={() => setBalanceMode(true)}
                                                        className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 transition-colors"
                                                    >
                                                        Add/Cut Balance
                                                    </button>
                                                    <button
                                                        onClick={() => handleTabChange('transactions')}
                                                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 transition-colors"
                                                    >
                                                        Transaction History
                                                    </button>
                                                    <button
                                                        onClick={() => handleTabChange('withdrawals')}
                                                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 transition-colors"
                                                    >
                                                        Withdrawal History
                                                    </button>
                                                </div>
                                                <div className="mt-3">
                                                    <button
                                                        onClick={() => handleDelete(selectedUser.id)}
                                                        className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors"
                                                    >
                                                        Delete User
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Transactions Tab */}
                                {activeTab === 'transactions' && (
                                    <div>
                                        {transactions.length === 0 ? (
                                            <p className="text-gray-500 text-center py-8">No transactions found.</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Type</th>
                                                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Amount</th>
                                                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                                                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {transactions.map(t => (
                                                            <tr key={t.id} className="hover:bg-gray-50">
                                                                <td className="px-3 py-2 capitalize">{t.transaction_type}</td>
                                                                <td className="px-3 py-2 font-bold text-indigo-600">₹{t.amount}</td>
                                                                <td className="px-3 py-2">
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${t.status === 'success' ? 'bg-green-100 text-green-700' : t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                                        {t.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2 text-gray-500">{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Withdrawals Tab */}
                                {activeTab === 'withdrawals' && (
                                    <div>
                                        {withdrawals.length === 0 ? (
                                            <p className="text-gray-500 text-center py-8">No withdrawal history found.</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Amount</th>
                                                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                                                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">UPI</th>
                                                            <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {withdrawals.map(w => (
                                                            <tr key={w.id} className="hover:bg-gray-50">
                                                                <td className="px-3 py-2 font-bold text-indigo-600">₹{w.amount}</td>
                                                                <td className="px-3 py-2">
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${w.status === 'PAID' || w.status === 'APPROVED' ? 'bg-green-100 text-green-700' : w.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                                        {w.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2 text-gray-600">{w.upi_id || '—'}</td>
                                                                <td className="px-3 py-2 text-gray-500">{new Date(w.created_at).toLocaleDateString('en-IN')}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveUsers;
