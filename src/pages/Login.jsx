import { useState } from 'react';
import { FaLock, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { adminLogin } from '../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = await adminLogin({ username, password });
            if (data.message === 'Login successful') {
                localStorage.setItem('adminAuth', 'true');
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome Back!',
                    text: 'Redirecting to dashboard...',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#ffffff',
                    color: '#1e293b'
                }).then(() => {
                    window.location.href = '/';
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Invalid username or password. Please try again.',
                confirmButtonColor: '#4f46e5'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 font-sans">
            <div className="w-full max-w-md">
                {/* Logo Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4 border border-gray-100">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <FaLock size={20} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">REWARDS <span className="text-indigo-600">ADMIN</span></h2>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Please sign in to your control panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                                    <FaUser className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium"
                                    placeholder="your unique username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                </div>
                                <input
                                    type="password"
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-sm tracking-wide"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>Sign in to Dashboard</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-400 text-xs font-bold tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} REWARDMOBI TECH
                </div>
            </div>
        </div>
    );
};

export default Login;
