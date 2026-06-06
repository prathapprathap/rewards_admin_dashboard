import { useEffect, useMemo, useState } from 'react';
import { FaUserShield, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaPen, FaSave, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getAdminProfile, updatePassword, updateAdminProfile } from '../api';

// Live validation row: green check when satisfied, red cross while not.
const Hint = ({ ok, text }) => (
    <span className={`flex items-center gap-1.5 text-[11px] font-bold ${ok ? 'text-emerald-600' : 'text-rose-500'}`}>
        {ok ? <FaCheckCircle size={11} /> : <FaTimesCircle size={11} />}
        {text}
    </span>
);

const AdminProfile = () => {
    const [profile, setProfile] = useState({
        username: 'admin',
        name: 'Admin',
        email: 'admin@rewardmobi.xyz',
        role: 'Administrator'
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── Profile editing ───────────────────────────────────────────────────
    const [isEditing, setIsEditing] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', username: '', email: '' });

    const startEditing = () => {
        setEditForm({
            name: profile.name || '',
            username: profile.username || '',
            email: profile.email || '',
        });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();

        if (!editForm.username.trim()) {
            Swal.fire('Error', 'Username is required', 'error');
            return;
        }
        if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
            Swal.fire('Error', 'Please enter a valid email address', 'error');
            return;
        }

        setIsSavingProfile(true);
        try {
            const res = await updateAdminProfile({
                name: editForm.name.trim(),
                username: editForm.username.trim(),
                email: editForm.email.trim(),
                currentUsername: localStorage.getItem('adminUsername') || profile.username,
            });

            const updated = res?.admin || {};
            setProfile({
                username: updated.username || editForm.username.trim(),
                name: updated.name || editForm.name.trim() || updated.username || editForm.username.trim(),
                email: updated.email || editForm.email.trim() || profile.email,
                role: 'Administrator',
            });
            // Keep the stored username in sync so password changes still target the right row.
            localStorage.setItem('adminUsername', updated.username || editForm.username.trim());

            setIsEditing(false);
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: res?.message || 'Profile updated successfully!',
                timer: 2500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Profile update failed:', error);
            const backendMsg = error.response?.data?.message;
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: backendMsg || error.message || 'Failed to update profile.',
            });
        } finally {
            setIsSavingProfile(false);
        }
    };

    // ── Real-time validation (recomputed on every keystroke) ──────────────
    const checks = useMemo(() => {
        const { current, new: next, confirm } = passwords;
        return {
            currentFilled: current.length > 0,
            lengthOk: next.length >= 6,
            differsFromCurrent: next.length > 0 && next !== current,
            matches: confirm.length > 0 && next === confirm,
        };
    }, [passwords]);

    const canSubmit =
        checks.currentFilled &&
        checks.lengthOk &&
        checks.differsFromCurrent &&
        checks.matches &&
        !isSubmitting;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getAdminProfile();
                setProfile({
                    username: data.username || 'admin',
                    name: data.name || data.username || 'Admin',
                    email: data.email || 'admin@rewardmobi.xyz',
                    role: 'Administrator',
                });
            } catch (error) {
                console.error('Error fetching admin profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (!passwords.current || !passwords.new || !passwords.confirm) {
            Swal.fire('Error', 'Please fill all password fields', 'error');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            Swal.fire({
                icon: 'error',
                title: 'Mismatch!',
                text: 'New passwords do not match!',
            });
            return;
        }

        if (passwords.new.length < 6) {
            Swal.fire('Error', 'New password must be at least 6 characters', 'error');
            return;
        }

        if (passwords.new === passwords.current) {
            Swal.fire('Error', 'New password must be different from the current one', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await updatePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new,
                username: localStorage.getItem('adminUsername') || profile.username,
            });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: res?.message || 'Password updated successfully!',
                timer: 3000,
                showConfirmButton: false
            });
            setPasswords({ current: '', new: '', confirm: '' });
            setShow({ current: false, new: false, confirm: false });
        } catch (error) {
            console.error('Password update failed:', error);
            const backendMsg = error.response?.data?.message;
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: backendMsg || error.message || 'Failed to update password.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 font-sans">
            {/* Header section with Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">Access Control</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">ROOT <span className="text-indigo-600">SECURITY</span></h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Card */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={startEditing}
                                title="Edit profile"
                                className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-gray-50 hover:bg-indigo-600 hover:text-white text-indigo-600 border border-gray-100 flex items-center justify-center transition-all active:scale-95 z-10"
                            >
                                <FaPen size={13} />
                            </button>
                        )}

                        <div className="relative w-40 h-40 mx-auto mb-8">
                            <div className="w-full h-full rounded-3xl bg-indigo-900 flex items-center justify-center text-white text-6xl font-black shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                {(profile.name || profile.username || 'A')[0].toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-indigo-600 border border-gray-50">
                                <FaUserShield size={20} />
                            </div>
                        </div>

                        {!isEditing ? (
                            <>
                                <div className="space-y-1 mb-8">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{profile.name}</h3>
                                    <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em]">{profile.role}</p>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-gray-50">
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Operator Handle</p>
                                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                            <p className="text-sm font-bold text-gray-700 truncate">@{profile.username}</p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Identity Vector</p>
                                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                            <p className="text-sm font-bold text-gray-700 truncate">{profile.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleProfileSave} className="space-y-4 pt-8 border-t border-gray-50 text-left">
                                <div className="space-y-2 group/field">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within/field:text-indigo-600 transition-colors">Display Name</label>
                                    <input
                                        type="text"
                                        placeholder="Admin"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-5 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-gray-900 text-sm"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 group/field">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within/field:text-indigo-600 transition-colors">Operator Handle</label>
                                    <input
                                        type="text"
                                        placeholder="admin"
                                        autoComplete="username"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-5 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-gray-900 text-sm"
                                        value={editForm.username}
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 group/field">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within/field:text-indigo-600 transition-colors">Identity Vector</label>
                                    <input
                                        type="email"
                                        placeholder="admin@rewardmobi.xyz"
                                        autoComplete="email"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-5 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-gray-900 text-sm"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        disabled={isSavingProfile}
                                        className="flex-1 bg-gray-100 text-gray-600 font-black py-3.5 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98] tracking-widest text-[10px] uppercase flex items-center justify-center gap-2 disabled:opacity-40"
                                    >
                                        <FaTimes size={12} /> Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingProfile}
                                        className="flex-1 bg-indigo-600 text-white font-black py-3.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] tracking-widest text-[10px] uppercase flex items-center justify-center gap-2 disabled:opacity-40 disabled:active:scale-100"
                                    >
                                        {isSavingProfile ? (
                                            <>
                                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Saving…
                                            </>
                                        ) : (
                                            <>
                                                <FaSave size={12} /> Save
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Security Form */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden h-full">
                        <div className="bg-indigo-900 p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black tracking-tight mb-1 uppercase">Credential Rotation</h3>
                                <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Update cryptographic passphrase</p>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px]"></div>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="p-4 sm:p-6 lg:p-8 md:p-12 space-y-8">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Current Credentials</label>
                                <div className="relative">
                                    <input
                                        type={show.current ? 'text' : 'password'}
                                        placeholder="••••••••••••"
                                        autoComplete="current-password"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-6 pr-14 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                                        className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {show.current ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">New Sequence</label>
                                    <div className="relative">
                                        <input
                                            type={show.new ? 'text' : 'password'}
                                            placeholder="••••••••••••"
                                            autoComplete="new-password"
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-6 pr-14 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-indigo-600"
                                            value={passwords.new}
                                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            onClick={() => setShow((s) => ({ ...s, new: !s.new }))}
                                            className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {show.new ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                        </button>
                                    </div>
                                    {passwords.new.length > 0 && (
                                        <div className="flex flex-col gap-1 pl-1 pt-1">
                                            <Hint ok={checks.lengthOk} text="At least 6 characters" />
                                            <Hint ok={checks.differsFromCurrent} text="Different from current password" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Verify Sequence</label>
                                    <div className="relative">
                                        <input
                                            type={show.confirm ? 'text' : 'password'}
                                            placeholder="••••••••••••"
                                            autoComplete="new-password"
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-6 pr-14 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-indigo-600"
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                                            className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {show.confirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                        </button>
                                    </div>
                                    {passwords.confirm.length > 0 && (
                                        <div className="pl-1 pt-1">
                                            <Hint ok={checks.matches} text={checks.matches ? 'Passwords match' : 'Passwords do not match'} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] tracking-widest text-[10px] uppercase flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            VERIFYING & UPDATING…
                                        </>
                                    ) : (
                                        'AUTHORIZE CREDENTIAL UPDATE'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="text-center pt-10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    &copy; {new Date().getFullYear()} REWARDMOBI SECURE SYSTEMS
                </p>
            </div>
        </div>
    );
};

export default AdminProfile;
