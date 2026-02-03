import { useEffect, useState } from 'react';
import { FaTasks, FaUsers } from 'react-icons/fa';
import { getStats } from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">Overview Analytics</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">System <span className="text-indigo-600">Dashboard</span></h1>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                    REAL-TIME UPDATES ENABLED
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                            <FaUsers size={24} />
                        </div>
                        <span className="text-green-500 font-black text-xs bg-green-50 px-2 py-1 rounded-lg">+12.5%</span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Users</p>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                </div>

                {/* Total Tasks Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                            <FaTasks size={24} />
                        </div>
                        <span className="text-purple-500 font-black text-xs bg-purple-50 px-2 py-1 rounded-lg">LIVE</span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Tasks</p>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">{stats.totalTasks.toLocaleString()}</p>
                    </div>
                </div>

                {/* Additional Placeholder Card - Active Now */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Active Now</p>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">--</p>
                    </div>
                </div>

                {/* Additional Placeholder Card - Revenue */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-orange-500/20 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 text-xl font-black">
                            ₹
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Payouts</p>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">--</p>
                    </div>
                </div>
            </div>

            {/* Extra Visual Section */}
            <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                        <h3 className="text-3xl font-black tracking-tight mb-4 leading-tight">Welcome to the New <span className="text-indigo-400">Admin Control</span></h3>
                        <p className="text-indigo-200 font-medium">Manage your reward ecosystem with professional tools and real-time data insights.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center flex-1">
                            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                            <p className="font-bold text-xl uppercase italic">Secure</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center flex-1">
                            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-1">Node</p>
                            <p className="font-bold text-xl">#001C</p>
                        </div>
                    </div>
                </div>

                {/* Decorative BG pattern */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
};

export default Dashboard;
