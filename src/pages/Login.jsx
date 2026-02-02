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
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black p-4">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden group">
                {/* Glossy overlay effect */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>

                <div className="relative">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-6 transform hover:rotate-12 transition-transform duration-300">
                            <FaLock className="text-white text-3xl" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                            Admin <span className="text-indigo-400">Portal</span>
                        </h2>
                        <p className="text-indigo-100/60 mt-2 text-sm font-medium">Please sign in to your control panel</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-indigo-200 uppercase tracking-widest ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaUser className="text-indigo-400 group-focus-within:text-white transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-indigo-300/30"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-indigo-200 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-indigo-400 group-focus-within:text-white transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-indigo-300/30"
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
                            className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>SIGN IN NOW</>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        </button>
                    </form>

                    <div className="mt-8 text-center text-indigo-200/40 text-[10px] uppercase font-bold tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} RewardMobi Admin Engine
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default Login;
