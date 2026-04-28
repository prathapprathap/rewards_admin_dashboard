import { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaUserCheck, FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2';
import {
    deleteUser,
    getUserDetails,
    getUserTransactions,
    getUserWithdrawals,
    getUsers,
    updateUser,
    getUserPaymentAccounts,
    deletePaymentAccount,
} from '../api';
import { FaPlus, FaTrash, FaCheckCircle, FaExclamationCircle, FaUniversity, FaMobileAlt } from 'react-icons/fa';


/* ─── field definitions (matches users table schema) ──────────────────── */
const EDIT_FIELDS = [
    { key: 'name',              label: 'Name',               type: 'text',   required: true  },
    { key: 'email',             label: 'Email',              type: 'email',  required: true  },
    { key: 'upi_id',            label: 'UPI ID',             type: 'text',   required: false },
    { key: 'telegram_id',       label: 'Telegram ID',        type: 'text',   required: false },
    { key: 'device_id',         label: 'Device ID',          type: 'text',   required: false },
    { key: 'referral_code',     label: 'Referral Code',      type: 'text',   required: false },
    { key: 'referred_by',       label: 'Referred By (code)', type: 'text',   required: false },
    { key: 'wallet_balance',    label: 'Wallet Balance (₹)', type: 'number', required: false },
    { key: 'total_earnings',    label: 'Total Earnings (₹)', type: 'number', required: false },
    { key: 'referral_earnings', label: 'Referral Earnings (₹)', type: 'number', required: false },
];

/* ─── read-only display rows ───────────────────────────────────────────── */
const DETAIL_ROWS = [
    { label: 'Name',              key: 'name' },
    { label: 'Email',             key: 'email' },
    { label: 'UPI ID',            key: 'upi_id',        fallback: '—' },
    { label: 'Telegram ID',       key: 'telegram_id',   fallback: '—' },
    { label: 'Device ID',         key: 'device_id',     fallback: '—' },
    { label: 'Refer Code',        key: 'referral_code', fallback: '—' },
    { label: 'Referred By',       key: 'referred_by',   fallback: '—' },
    { label: 'Wallet Balance',    key: 'wallet_balance',    prefix: '₹' },
    { label: 'Total Earnings',    key: 'total_earnings',    prefix: '₹' },
    { label: 'Referral Earnings', key: 'referral_earnings', prefix: '₹' },
    { label: 'Total Withdraw',    key: 'total_withdraw_amount', prefix: '₹' },
    { label: 'Today Withdraw',    key: 'today_withdraw_amount', prefix: '₹' },
    { label: 'Total Tasks Done',  key: 'total_tasks' },
    { label: 'Last Login',        key: 'last_login_at',  isDate: true },
    { label: 'Created At',        key: 'created_at',     isDate: true },
];

const ActiveUsers = () => {
    const [users, setUsers]               = useState([]);
    const [loading, setLoading]           = useState(true);
    const [searchQuery, setSearchQuery]   = useState('');

    /* modal state */
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeTab, setActiveTab]       = useState('details');
    const [transactions, setTransactions] = useState([]);
    const [withdrawals, setWithdrawals]   = useState([]);
    const [paymentAccounts, setPaymentAccounts] = useState([]);


    /* edit state */
    const [editMode, setEditMode]   = useState(false);
    const [editForm, setEditForm]   = useState({});
    const [saving, setSaving]       = useState(false);

    useEffect(() => { fetchActiveUsers(); }, []);

    /* ── data fetching ───────────────────────────────────────────────── */
    const fetchActiveUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            const threshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            setUsers(
                data.filter(u => {
                    const ll = u.last_login_at ? new Date(u.last_login_at) : null;
                    const ca = u.created_at    ? new Date(u.created_at)    : null;
                    return (ll && ll >= threshold) || (ca && ca >= threshold) || parseFloat(u.wallet_balance || 0) > 0;
                })
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openDetail = async (user) => {
        setDetailLoading(true);
        setSelectedUser(null);
        setEditMode(false);
        setActiveTab('details');
        setTransactions([]);
        setWithdrawals([]);
        setPaymentAccounts([]);

        try {
            const detail = await getUserDetails(user.id);
            setSelectedUser(detail);
            initEditForm(detail);
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'Failed to load user details.', 'error');
        } finally {
            setDetailLoading(false);
        }
    };

    const initEditForm = (detail) => {
        const form = {};
        EDIT_FIELDS.forEach(f => { form[f.key] = detail[f.key] ?? ''; });
        setEditForm(form);
    };

    const closeDetail = () => {
        setSelectedUser(null);
        setEditMode(false);
    };

    const loadTransactions = async () => {
        if (!selectedUser) return;
        try { setTransactions(await getUserTransactions(selectedUser.id)); }
        catch (e) { console.error(e); }
    };

    const loadWithdrawals = async () => {
        if (!selectedUser) return;
        try { setWithdrawals(await getUserWithdrawals(selectedUser.id)); }
        catch (e) { console.error(e); }
    };

    const loadPaymentAccounts = async () => {
        if (!selectedUser) return;
        try { setPaymentAccounts(await getUserPaymentAccounts(selectedUser.id)); }
        catch (e) { console.error(e); }
    };


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setEditMode(false);
        if (tab === 'transactions' && transactions.length === 0) loadTransactions();
        if (tab === 'withdrawals'  && withdrawals.length  === 0) loadWithdrawals();
        if (tab === 'payments'     && paymentAccounts.length === 0) loadPaymentAccounts();
    };


    /* ── edit save ───────────────────────────────────────────────────── */
    const handleEditSave = async () => {
        setSaving(true);
        try {
            /* Build payload — only send non-empty strings / valid numbers */
            const payload = {};
            EDIT_FIELDS.forEach(({ key, type }) => {
                const val = editForm[key];
                if (val === '' || val === null || val === undefined) return; // skip blanks
                payload[key] = type === 'number' ? parseFloat(val) : String(val).trim();
            });

            await updateUser(selectedUser.id, payload);
            Swal.fire({ icon: 'success', title: 'Saved!', text: 'User details updated successfully.', timer: 2000, showConfirmButton: false });
            setEditMode(false);
            const refreshed = await getUserDetails(selectedUser.id);
            setSelectedUser(refreshed);
            initEditForm(refreshed);
            fetchActiveUsers();
        } catch (e) {
            console.error(e);
            Swal.fire('Error', e.response?.data?.message || 'Failed to update user.', 'error');
        } finally {
            setSaving(false);
        }
    };

    /* ── delete ──────────────────────────────────────────────────────── */
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            text: 'This is irreversible — all user data will be permanently removed.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Delete!',
        });
        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                Swal.fire('Deleted!', 'User removed successfully.', 'success');
                closeDetail();
                fetchActiveUsers();
            } catch (e) {
                Swal.fire('Error', 'Failed to delete user.', 'error');
            }
        }
    };

    const handleDeletePaymentAccount = async (accountId) => {
        const result = await Swal.fire({
            title: 'Delete Account?',
            text: 'Are you sure you want to remove this payment account?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete',
        });
        if (result.isConfirmed) {
            try {
                await deletePaymentAccount(accountId);
                Swal.fire('Deleted!', 'Payment account removed.', 'success');
                loadPaymentAccounts();
            } catch (e) {
                Swal.fire('Error', 'Failed to delete account.', 'error');
            }
        }
    };


    /* ── filter ──────────────────────────────────────────────────────── */
    const filteredUsers = users.filter(u => {
        const q = searchQuery.toLowerCase();
        return (
            (u.email          || '').toLowerCase().includes(q) ||
            (u.device_id      || '').toLowerCase().includes(q) ||
            (u.upi_id         || '').toLowerCase().includes(q) ||
            (u.referral_code  || '').toLowerCase().includes(q) ||
            (u.name           || '').toLowerCase().includes(q) ||
            (u.telegram_id    || '').toLowerCase().includes(q)
        );
    });

    /* ── helpers ─────────────────────────────────────────────────────── */
    const formatDetailValue = (row, user) => {
        const raw = user[row.key];
        if (raw === null || raw === undefined || raw === '') return row.fallback ?? '—';
        if (row.isDate) return new Date(raw).toLocaleString('en-IN');
        return `${row.prefix ?? ''}${raw}`;
    };

    /* ═══════════════════════════════════════════════════════════════════ */
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
    );

    return (
        <div className="p-8 min-h-screen">
            {/* Page header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-1 flex items-center gap-3">
                    <FaUserCheck className="text-green-600" /> Active Users
                </h2>
                <p className="text-gray-500 text-sm">Users with recent login, recent join, or wallet activity</p>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Email, Device ID, UPI, Refer Code, Telegram ID…"
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                            <tr>
                                {['No.', 'Email', 'Device Id', 'Balance', 'UPI', 'Refer Code', 'Action'].map(h => (
                                    <th key={h} className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredUsers.map((user, i) => (
                                <tr key={user.id} className="hover:bg-green-50/30 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{i + 1}</td>
                                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{user.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.device_id || '—'}</td>
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
                        <FaUsers size={56} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No active users found</p>
                    </div>
                )}
            </div>

            {/* ══════════════ DETAIL MODAL ══════════════════════════════════════ */}
            {(detailLoading || selectedUser) && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative">

                        {/* Header */}
                        <div className="bg-indigo-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
                            <h3 className="text-lg font-bold">
                                {editMode ? '✏️ Edit User' : 'User Details'}
                                {selectedUser && <span className="ml-2 text-sm font-normal text-indigo-200">#{selectedUser.id}</span>}
                            </h3>
                            <button onClick={closeDetail} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                                <FaTimes size={16} />
                            </button>
                        </div>

                        {/* Loading spinner */}
                        {detailLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                            </div>
                        ) : selectedUser && (
                            <div className="p-6">

                                {/* Tabs (hidden when editing) */}
                                {!editMode && (
                                    <div className="flex gap-2 mb-5 border-b border-gray-200">
                                        {['details', 'transactions', 'withdrawals', 'payments'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => handleTabChange(tab)}
                                                className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-colors -mb-px ${
                                                    activeTab === tab
                                                        ? 'border-indigo-600 text-indigo-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                {tab === 'payments' ? 'Payment Accounts' : tab}
                                            </button>
                                        ))}

                                    </div>
                                )}

                                {/* ── DETAILS TAB ──────────────────────────────── */}
                                {activeTab === 'details' && !editMode && (
                                    <div>
                                        <div className="space-y-2.5 mb-6">
                                            {DETAIL_ROWS.map(row => (
                                                <div key={row.key}>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-0.5">{row.label}:</label>
                                                    <div className="w-full border border-gray-200 rounded bg-gray-50 px-3 py-2 text-sm text-gray-800">
                                                        {formatDetailValue(row, selectedUser)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action buttons — matching the screenshot layout */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <button
                                                onClick={() => setEditMode(true)}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 transition-colors"
                                            >
                                                <FaEdit size={12} /> Update Details
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
                                            <button
                                                onClick={() => handleTabChange('payments')}
                                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 transition-colors"
                                            >
                                                Payment Accounts
                                            </button>
                                        </div>

                                        <div>
                                            <button
                                                onClick={() => handleDelete(selectedUser.id)}
                                                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors"
                                            >
                                                Delete User
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── EDIT FORM ─────────────────────────────────── */}
                                {activeTab === 'details' && editMode && (
                                    <div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                            {EDIT_FIELDS.map(({ key, label, type, required }) => (
                                                <div key={key}>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                        {label}{required && <span className="text-red-500 ml-0.5">*</span>}:
                                                    </label>
                                                    <input
                                                        type={type}
                                                        required={required}
                                                        step={type === 'number' ? '0.01' : undefined}
                                                        value={editForm[key] ?? ''}
                                                        onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow"
                                                        placeholder={label}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleEditSave}
                                                disabled={saving}
                                                className="flex-1 bg-indigo-600 text-white py-2.5 rounded font-bold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                                            >
                                                {saving ? 'Saving…' : '💾 Save Changes'}
                                            </button>
                                            <button
                                                onClick={() => { setEditMode(false); initEditForm(selectedUser); }}
                                                disabled={saving}
                                                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded font-bold text-sm hover:bg-gray-300 disabled:opacity-60 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── TRANSACTIONS TAB ──────────────────────────── */}
                                {activeTab === 'transactions' && (
                                    <div>
                                        {transactions.length === 0 ? (
                                            <p className="text-gray-500 text-center py-10">No transactions found.</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-sm divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            {['Type', 'Amount', 'Status', 'Description', 'Date'].map(h => (
                                                                <th key={h} className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {transactions.map(t => (
                                                            <tr key={t.id} className="hover:bg-gray-50">
                                                                <td className="px-3 py-2 capitalize">{t.transaction_type}</td>
                                                                <td className="px-3 py-2 font-bold text-indigo-600">₹{t.amount}</td>
                                                                <td className="px-3 py-2">
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                                        t.status === 'success'  ? 'bg-green-100 text-green-700'  :
                                                                        t.status === 'pending'  ? 'bg-yellow-100 text-yellow-700':
                                                                                                  'bg-red-100 text-red-700'
                                                                    }`}>{t.status}</span>
                                                                </td>
                                                                <td className="px-3 py-2 text-gray-500 max-w-[160px] truncate" title={t.description}>{t.description || '—'}</td>
                                                                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── WITHDRAWALS TAB ───────────────────────────── */}
                                {activeTab === 'withdrawals' && (
                                    <div>
                                        {withdrawals.length === 0 ? (
                                            <p className="text-gray-500 text-center py-10">No withdrawal history found.</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-sm divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            {['Amount', 'Status', 'Method', 'Date'].map(h => (
                                                                <th key={h} className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {withdrawals.map(w => (
                                                            <tr key={w.id} className="hover:bg-gray-50">
                                                                <td className="px-3 py-2 font-bold text-indigo-600">₹{w.amount}</td>
                                                                <td className="px-3 py-2">
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                                        w.status === 'PAID' || w.status === 'APPROVED' ? 'bg-green-100 text-green-700'  :
                                                                        w.status === 'PENDING'                         ? 'bg-yellow-100 text-yellow-700':
                                                                                                                         'bg-red-100 text-red-700'
                                                                    }`}>{w.status}</span>
                                                                </td>
                                                                <td className="px-3 py-2 text-gray-600">{w.method || '—'}</td>
                                                                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{new Date(w.created_at).toLocaleDateString('en-IN')}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── PAYMENTS TAB ───────────────────────────── */}
                                {activeTab === 'payments' && (
                                    <div>
                                        {paymentAccounts.length === 0 ? (
                                            <div className="text-center py-10">
                                                <FaUniversity size={48} className="mx-auto text-gray-300 mb-3" />
                                                <p className="text-gray-500">No bank or UPI accounts linked.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {paymentAccounts.map(acc => (
                                                    <div key={acc.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative group">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex gap-3">
                                                                <div className="mt-1">
                                                                    {acc.account_type === 'upi' ? (
                                                                        <FaMobileAlt className="text-purple-600 text-xl" />
                                                                    ) : (
                                                                        <FaUniversity className="text-blue-600 text-xl" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-bold text-gray-800 uppercase text-sm">
                                                                            {acc.account_type === 'upi' ? 'UPI ID' : acc.bank_name || 'Bank Account'}
                                                                        </span>
                                                                        {acc.is_primary === 1 && (
                                                                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Primary</span>
                                                                        )}
                                                                        {acc.verified === 1 ? (
                                                                            <FaCheckCircle className="text-green-500 text-xs" title="Verified" />
                                                                        ) : (
                                                                            <FaExclamationCircle className="text-yellow-500 text-xs" title="Unverified" />
                                                                        )}
                                                                    </div>
                                                                    
                                                                    {acc.account_type === 'upi' ? (
                                                                        <p className="text-indigo-600 font-medium text-sm mt-0.5">{acc.upi_id}</p>
                                                                    ) : (
                                                                        <div className="text-sm text-gray-600 mt-0.5 space-y-0.5">
                                                                            <p><span className="font-semibold">A/C:</span> {acc.account_number}</p>
                                                                            <p><span className="font-semibold">IFSC:</span> {acc.ifsc_code}</p>
                                                                            <p><span className="font-semibold">Holder:</span> {acc.account_holder}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            <button 
                                                                onClick={() => handleDeletePaymentAccount(acc.id)}
                                                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                        <div className="mt-2 text-[10px] text-gray-400">
                                                            Added on: {new Date(acc.created_at).toLocaleString()}
                                                        </div>
                                                    </div>
                                                ))}
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
