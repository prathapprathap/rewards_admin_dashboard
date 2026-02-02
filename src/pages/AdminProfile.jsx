import { useState } from 'react';
import { FaCamera, FaSave, FaUnlockAlt, FaUserShield } from 'react-icons/fa';
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
        <div className="p-8 min-h-screen max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <FaUserShield className="text-indigo-600" />
                    Admin Profile
                </h2>
                <p className="text-gray-600">Manage your administrative account and security</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-inner">
                                A
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg text-indigo-600 hover:text-indigo-800 border border-gray-100">
                                <FaCamera size={16} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{profile.username}</h3>
                        <p className="text-indigo-600 font-medium text-sm mb-4">{profile.role}</p>
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-1">Email</p>
                            <p className="text-gray-800 font-medium">{profile.email}</p>
                        </div>
                    </div>
                </div>

                {/* Security Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full">
                        <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaUnlockAlt className="text-indigo-600" />
                            Update Password
                        </h4>
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-gray-600 text-sm font-bold mb-1">Current Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none transition-all"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 text-sm font-bold mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none transition-all"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm font-bold mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none transition-all"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <FaSave /> Save New Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
