import { useState } from 'react';
import { FaUserShield } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { updatePassword } from '../api';

const AdminProfile = () => {
    const [profile, setProfile] = useState({
        username: 'admin',
        email: 'admin@rewardsapp.com',
        role: 'Super Admin'
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

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

        try {
            await updatePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Password updated successfully!',
                timer: 3000,
                showConfirmButton: false
            });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update password.',
            });
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

                        <div className="relative w-40 h-40 mx-auto mb-8">
                            <div className="w-full h-full rounded-3xl bg-indigo-900 flex items-center justify-center text-white text-6xl font-black shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                {profile.username[0].toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-indigo-600 border border-gray-50">
                                <FaUserShield size={20} />
                            </div>
                        </div>

                        <div className="space-y-1 mb-8">
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{profile.username}</h3>
                            <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em]">{profile.role}</p>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-gray-50">
                            <div className="text-left">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Identity Vector</p>
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <p className="text-sm font-bold text-gray-700 truncate">{profile.email}</p>
                                </div>
                            </div>
                        </div>
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

                        <form onSubmit={handlePasswordUpdate} className="p-8 md:p-12 space-y-8">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Current Credentials</label>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">New Sequence</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-indigo-600"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Verify Sequence</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-indigo-600"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] tracking-widest text-[10px] uppercase"
                                >
                                    AUTHORIZE CREDENTIAL UPDATE
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
