import { useEffect, useState } from 'react';
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaMobileAlt,
    FaSearch,
    FaTimes,
    FaTrash,
    FaUniversity,
    FaUserCheck,
    FaUsers,
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import {
    deletePaymentAccount,
    deleteUser,
    getUserDetails,
    getUserPaymentAccounts,
    getUserTransactions,
    getUserWithdrawals,
    getUsers,
    updateUser,
} from '../api';

/* ─── Editable field schema (matches users table) ─────────────────────── */
const FIELD_SECTIONS = [
    {
        title: 'Profile',
        fields: [
            { key: 'name', label: 'Name', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'email', required: true },
            { key: 'telegram_id', label: 'Telegram ID', type: 'text' },
            { key: 'upi_id', label: 'UPI ID', type: 'text' },
        ],
    },
    {
        title: 'Wallet',
        fields: [
            { key: 'wallet_balance', label: 'Wallet Balance (₹)', type: 'number', step: '0.01' },
            { key: 'total_earnings', label: 'Total Earnings (₹)', type: 'number', step: '0.01' },
            { key: 'referral_earnings', label: 'Referral Earnings (₹)', type: 'number', step: '0.01' },
        ],
    },
    {
        title: 'Referral',
        fields: [
            { key: 'referral_code', label: 'Referral Code', type: 'text' },
            { key: 'referred_by', label: 'Referred By (code)', type: 'text' },
        ],
    },
    {
        title: 'Device & Access',
        fields: [
            { key: 'device_id', label: 'Device ID', type: 'text' },
            { key: 'is_blocked', label: 'Block this account', type: 'toggle' },
        ],
    },
];

const EDITABLE_KEYS = FIELD_SECTIONS.flatMap(s => s.fields.map(f => f.key));

const ActiveUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    /* modal state */
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [transactions, setTransactions] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [paymentAccounts, setPaymentAccounts] = useState([]);

    /* edit state */
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);

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
                    const ca = u.created_at ? new Date(u.created_at) : null;
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
        setActiveTab('profile');
        setTransactions([]);
        setWithdrawals([]);
        setPaymentAccounts([]);
        setDirty(false);

        try {
            const detail = await getUserDetails(user.id);
            setSelectedUser(detail);
            hydrateForm(detail);
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'Failed to load user details.', 'error');
        } finally {
            setDetailLoading(false);
        }
    };

    const hydrateForm = (detail) => {
        const f = {};
        EDITABLE_KEYS.forEach(k => { f[k] = detail[k] ?? ''; });
        setForm(f);
    };

    const closeDetail = async () => {
        if (dirty) {
            const ok = await Swal.fire({
                title: 'Discard changes?',
                text: 'You have unsaved edits.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Discard',
            });
            if (!ok.isConfirmed) return;
        }
        setSelectedUser(null);
        setDirty(false);
    };

    const handleField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setDirty(true);
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
        if (tab === 'transactions' && transactions.length === 0) loadTransactions();
        if (tab === 'withdrawals' && withdrawals.length === 0) loadWithdrawals();
        if (tab === 'payments' && paymentAccounts.length === 0) loadPaymentAccounts();
    };

    /* ── save ─────────────────────────────────────────────────────────── */
    const handleSave = async () => {
        if (!selectedUser) return;
        setSaving(true);
        try {
            const payload = {};
            FIELD_SECTIONS.flatMap(s => s.fields).forEach(({ key, type }) => {
                const val = form[key];
                if (type === 'number') {
                    if (val === '' || val === null || val === undefined || isNaN(parseFloat(val))) return;
                    payload[key] = parseFloat(val);
                } else if (type === 'toggle') {
                    payload[key] = val ? 1 : 0;
                } else {
                    payload[key] = (val ?? '').toString().trim();
                }
            });

            await updateUser(selectedUser.id, payload);
            Swal.fire({ icon: 'success', title: 'Saved', timer: 1500, showConfirmButton: false });
            const refreshed = await getUserDetails(selectedUser.id);
            setSelectedUser(refreshed);
            hydrateForm(refreshed);
            setDirty(false);
            fetchActiveUsers();
        } catch (e) {
            console.error(e);
            Swal.fire('Error', e.response?.data?.message || 'Failed to update user.', 'error');
        } finally {
            setSaving(false);
        }
    };

    /* ── delete ───────────────────────────────────────────────────────── */
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            text: 'This is irreversible — all user data will be permanently removed.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete',
        });
        if (!result.isConfirmed) return;
        try {
            await deleteUser(id);
            Swal.fire('Deleted', 'User removed.', 'success');
            setSelectedUser(null);
            fetchActiveUsers();
        } catch (e) {
            Swal.fire('Error', 'Failed to delete user.', 'error');
        }
    };

    const handleDeletePaymentAccount = async (accountId) => {
        const r = await Swal.fire({
            title: 'Remove payment account?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Remove',
        });
        if (!r.isConfirmed) return;
        try {
            await deletePaymentAccount(accountId);
            loadPaymentAccounts();
        } catch (e) {
            Swal.fire('Error', 'Failed to delete account.', 'error');
        }
    };

    /* ── filter ───────────────────────────────────────────────────────── */
    const filteredUsers = users.filter(u => {
        const q = searchQuery.toLowerCase();
        return (
            (u.email || '').toLowerCase().includes(q) ||
            (u.device_id || '').toLowerCase().includes(q) ||
            (u.upi_id || '').toLowerCase().includes(q) ||
            (u.referral_code || '').toLowerCase().includes(q) ||
            (u.name || '').toLowerCase().includes(q) ||
            (u.telegram_id || '').toLowerCase().includes(q)
        );
    });

    /* ══════════════════════════════════════════════════════════════════ */
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
            {/* Page header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-1 flex items-center gap-3">
                    <FaUserCheck className="text-green-600" /> Active Users
                </h2>
                <p className="text-gray-500 text-sm">Tap a user to edit their profile, view activity, or manage payouts.</p>
            </div>

            {/* Search */}
            <div className="mb-4 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                    type="text"
                    placeholder="Search by Email, Device ID, UPI, Refer Code, Telegram ID…"
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table (desktop) */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
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
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {user.referral_code}
                                        {user.is_blocked === 1 && <span className="ml-2 bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">BLOCKED</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => openDetail(user)}
                                            className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition-colors"
                                        >
                                            Manage
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

            {/* Card list (mobile) */}
            <div className="md:hidden space-y-3">
                {filteredUsers.map((user, i) => (
                    <button
                        key={user.id}
                        onClick={() => openDetail(user)}
                        className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-left active:scale-[0.98] transition-transform"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-gray-400">#{i + 1}</span>
                                    {user.is_blocked === 1 && (
                                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">BLOCKED</span>
                                    )}
                                </div>
                                <p className="text-sm text-blue-600 font-bold truncate">{user.email}</p>
                                <p className="text-xs text-gray-500 truncate mt-0.5">{user.device_id || 'no device'}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-base font-black text-gray-900">₹{user.wallet_balance}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Balance</p>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                            <span className="text-gray-500">Code: <span className="font-bold text-gray-800">{user.referral_code || '—'}</span></span>
                            <span className="text-indigo-600 font-bold">Manage →</span>
                        </div>
                    </button>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
                        <FaUsers size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-sm">No active users found</p>
                    </div>
                )}
            </div>

            {/* ══════════════ SLIDE-IN DETAIL / EDIT PANEL ══════════════════ */}
            {(detailLoading || selectedUser) && (
                <>
                    {/* Backdrop (desktop only — mobile gets full-screen) */}
                    <div
                        onClick={closeDetail}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 hidden md:block animate-fade-in"
                    />
                    <div className="fixed inset-0 md:inset-y-0 md:right-0 md:left-auto md:w-[min(720px,95vw)] bg-white z-50 flex flex-col shadow-2xl md:rounded-l-3xl animate-slide-in-right">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white px-5 sm:px-6 py-4 md:rounded-tl-3xl flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                {selectedUser?.profile_pic ? (
                                    <img src={selectedUser.profile_pic} alt="" className="w-10 h-10 rounded-full border-2 border-white/50" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black">
                                        {(selectedUser?.name || selectedUser?.email || '?')[0]?.toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-black tracking-tight">
                                        {selectedUser?.name || 'User'}
                                        {selectedUser?.is_blocked === 1 && (
                                            <span className="ml-2 text-[10px] font-bold uppercase tracking-widest bg-red-500 px-2 py-0.5 rounded">Blocked</span>
                                        )}
                                    </h3>
                                    <p className="text-indigo-200 text-xs">#{selectedUser?.id} · {selectedUser?.email}</p>
                                </div>
                            </div>
                            <button onClick={closeDetail} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                                <FaTimes size={16} />
                            </button>
                        </div>

                        {/* Tabs */}
                        {!detailLoading && selectedUser && (
                            <div className="border-b border-gray-200 px-6 bg-gray-50 flex-shrink-0">
                                <div className="flex gap-1 overflow-x-auto">
                                    {[
                                        { id: 'profile', label: 'Profile & Edit' },
                                        { id: 'activity', label: 'Activity' },
                                        { id: 'transactions', label: 'Transactions' },
                                        { id: 'withdrawals', label: 'Withdrawals' },
                                        { id: 'payments', label: 'Payment Accounts' },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab.id)}
                                            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors -mb-px ${activeTab === tab.id
                                                ? 'border-indigo-600 text-indigo-700 bg-white'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto">
                            {detailLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                                </div>
                            ) : selectedUser && (
                                <div className="p-6">

                                    {/* ── PROFILE / EDIT ─────────────────────────────── */}
                                    {activeTab === 'profile' && (
                                        <div className="space-y-6">
                                            {FIELD_SECTIONS.map(section => (
                                                <div key={section.title}>
                                                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">
                                                        {section.title}
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {section.fields.map(field => (
                                                            <div key={field.key}>
                                                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                                                    {field.label}
                                                                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                                                                </label>
                                                                {field.type === 'toggle' ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleField(field.key, !form[field.key])}
                                                                        className={`relative inline-flex items-center h-9 w-20 rounded-full transition-colors ${form[field.key] ? 'bg-red-500' : 'bg-gray-300'}`}
                                                                    >
                                                                        <span className={`inline-block w-7 h-7 transform bg-white rounded-full shadow transition-transform ${form[field.key] ? 'translate-x-12' : 'translate-x-1'}`} />
                                                                        <span className={`absolute font-bold text-[10px] uppercase tracking-widest ${form[field.key] ? 'left-2 text-white' : 'right-2 text-gray-600'}`}>
                                                                            {form[field.key] ? 'On' : 'Off'}
                                                                        </span>
                                                                    </button>
                                                                ) : (
                                                                    <input
                                                                        type={field.type}
                                                                        step={field.step}
                                                                        required={field.required}
                                                                        value={form[field.key] ?? ''}
                                                                        onChange={e => handleField(field.key, e.target.value)}
                                                                        className="w-full border-2 border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
                                                                        placeholder={field.label}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* ── ACTIVITY (read-only stats) ─────────────────── */}
                                    {activeTab === 'activity' && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            <StatTile label="Wallet" value={`₹${selectedUser.wallet_balance || 0}`} />
                                            <StatTile label="Total Earnings" value={`₹${selectedUser.total_earnings || 0}`} />
                                            <StatTile label="Referral Earnings" value={`₹${selectedUser.referral_earnings || 0}`} />
                                            <StatTile label="Total Withdraw" value={`₹${selectedUser.total_withdraw_amount || 0}`} />
                                            <StatTile label="Today Withdraw" value={`₹${selectedUser.today_withdraw_amount || 0}`} />
                                            <StatTile label="Tasks Done" value={selectedUser.total_tasks ?? 0} />
                                            <StatTile label="Last Login" value={selectedUser.last_login_at ? new Date(selectedUser.last_login_at).toLocaleString('en-IN') : '—'} wide />
                                            <StatTile label="Joined" value={selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString('en-IN') : '—'} wide />
                                            <StatTile
                                                label="Status"
                                                value={selectedUser.is_blocked === 1 ? 'BLOCKED' : 'ACTIVE'}
                                                tone={selectedUser.is_blocked === 1 ? 'danger' : 'good'}
                                            />
                                        </div>
                                    )}

                                    {/* ── TRANSACTIONS ────────────────────────────────── */}
                                    {activeTab === 'transactions' && (
                                        <div>
                                            {transactions.length === 0 ? (
                                                <p className="text-gray-400 text-center py-10 italic">No transactions found.</p>
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
                                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${t.status === 'success' ? 'bg-green-100 text-green-700' :
                                                                            t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                                'bg-red-100 text-red-700'
                                                                            }`}>{t.status}</span>
                                                                    </td>
                                                                    <td className="px-3 py-2 text-gray-500 max-w-[200px] truncate" title={t.description}>{t.description || '—'}</td>
                                                                    <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ── WITHDRAWALS ─────────────────────────────────── */}
                                    {activeTab === 'withdrawals' && (
                                        <div>
                                            {withdrawals.length === 0 ? (
                                                <p className="text-gray-400 text-center py-10 italic">No withdrawal history found.</p>
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
                                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${w.status === 'PAID' || w.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                                            w.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
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

                                    {/* ── PAYMENT ACCOUNTS ────────────────────────────── */}
                                    {activeTab === 'payments' && (
                                        <div>
                                            {paymentAccounts.length === 0 ? (
                                                <div className="text-center py-10">
                                                    <FaUniversity size={48} className="mx-auto text-gray-300 mb-3" />
                                                    <p className="text-gray-400 italic">No bank or UPI accounts linked.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {paymentAccounts.map(acc => (
                                                        <div key={acc.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
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
                                                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded-lg"
                                                                >
                                                                    <FaTrash size={14} />
                                                                </button>
                                                            </div>
                                                            <div className="mt-2 text-[10px] text-gray-400">
                                                                Added: {new Date(acc.created_at).toLocaleString()}
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

                        {/* Sticky footer with Save + Delete */}
                        {!detailLoading && selectedUser && (
                            <div className="border-t border-gray-200 bg-gray-50 px-5 sm:px-6 py-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
                                <button
                                    onClick={() => handleDelete(selectedUser.id)}
                                    className="hidden sm:flex px-4 py-2.5 bg-white text-red-600 border border-red-200 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors items-center gap-2"
                                >
                                    <FaTrash size={12} /> Delete User
                                </button>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    {dirty && (
                                        <span className="hidden sm:inline text-[11px] font-bold text-amber-600 uppercase tracking-widest">
                                            Unsaved
                                        </span>
                                    )}
                                    <button
                                        onClick={closeDetail}
                                        className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !dirty}
                                        className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                                    >
                                        {saving ? 'Saving…' : 'Save Changes'}
                                    </button>
                                </div>
                                {/* Mobile-only delete row */}
                                <button
                                    onClick={() => handleDelete(selectedUser.id)}
                                    className="sm:hidden w-full px-4 py-2.5 bg-white text-red-600 border border-red-200 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaTrash size={12} /> Delete User
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

/* ─── Small stat tile for the Activity tab ─────────────────────────────── */
const StatTile = ({ label, value, tone, wide }) => {
    const toneClass =
        tone === 'good' ? 'text-green-700 bg-green-50 border-green-100' :
        tone === 'danger' ? 'text-red-700 bg-red-50 border-red-100' :
        'text-gray-900 bg-white border-gray-100';
    return (
        <div className={`border rounded-xl px-4 py-3 ${toneClass} ${wide ? 'sm:col-span-2' : ''}`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
            <p className="font-bold text-base break-words">{value}</p>
        </div>
    );
};

export default ActiveUsers;
