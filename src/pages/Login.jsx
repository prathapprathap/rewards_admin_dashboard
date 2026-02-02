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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden group">
                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl shadow-xl mb-6 transform hover:scale-105 transition-transform duration-300">
                            <FaLock className="text-white text-3xl" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
                            Admin <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Portal</span>
                        </h2>
                        <p className="text-slate-400 mt-4 text-sm font-semibold tracking-wide">Enter your credentials to access the bridge</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">Identity</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaUser className="text-slate-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-slate-600 font-medium"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">Access Key</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-slate-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-slate-600 font-medium"
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
                            className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-900/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 group/btn"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3 tracking-widest text-sm">
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>AUTHORIZE ACCESS</>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]"></div>
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em]">
                            &copy; {new Date().getFullYear()} RewardMobi <span className="text-indigo-500/50">Tech Systems</span>
                        </p>
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
