import { useEffect, useState } from 'react';
import { FaCheckCircle, FaClock, FaExchangeAlt, FaLink, FaList, FaTasks, FaUserCheck, FaUsers, FaWallet } from 'react-icons/fa';
import { getStats, getTransactions } from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        todayLogin: 0,
        newJoinedToday: 0,
        todayLeads: 0,
        activeOffer: 0,
        pendingPayouts: 0,
        todayWithdrawals: 0,
        todayPayouts: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsData, transData] = await Promise.all([getStats(), getTransactions()]);
            setStats(statsData);
            setTransactions(transData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ label, value, icon: Icon, colorClass, iconBgClass, trend }) => (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`w-14 h-14 ${iconBgClass} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-500`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className="text-green-500 font-black text-xs bg-green-50 px-2 py-1 rounded-lg">{trend}</span>
                )}
            </div>
            <div className="relative z-10">
                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-4xl font-black text-gray-900 tracking-tighter transition-all group-hover:text-indigo-600">{value}</p>
            </div>
            {/* Subtle background decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 ${iconBgClass}`}></div>
        </div>
    );

    if (loading) return (
        <div className="p-20 text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-black uppercase tracking-widest animate-pulse">Initializing System...</p>
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12 font-sans relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">Overview Analytics</p>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">System <span className="text-indigo-600">Dashboard</span></h1>
                </div>
                <div className="flex items-center gap-3 bg-indigo-50 px-5 py-3 rounded-2xl text-indigo-700 font-bold text-xs shadow-sm shadow-indigo-100">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></div>
                    LIVE ECOSYSTEM MONITOR
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <StatCard
                    label="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    icon={FaUsers}
                    iconBgClass="bg-blue-600 shadow-blue-200"
                    trend="+12%"
                />
                <StatCard
                    label="Today's Login"
                    value={stats.todayLogin.toLocaleString()}
                    icon={FaUserCheck}
                    iconBgClass="bg-purple-600 shadow-purple-200"
                />
                <StatCard
                    label="New Joined"
                    value={stats.newJoinedToday.toLocaleString()}
                    icon={FaList}
                    iconBgClass="bg-orange-600 shadow-orange-200"
                />
                <StatCard
                    label="Today Leads"
                    value={stats.todayLeads.toLocaleString()}
                    icon={FaLink}
                    iconBgClass="bg-yellow-600 shadow-yellow-200"
                />
                <StatCard
                    label="Active Offers"
                    value={stats.activeOffer}
                    icon={FaTasks}
                    iconBgClass="bg-red-600 shadow-red-200"
                />
                <StatCard
                    label="Pending Payouts"
                    value={stats.pendingPayouts}
                    icon={FaClock}
                    iconBgClass="bg-emerald-600 shadow-emerald-200"
                />
                <StatCard
                    label="Today Withdraws"
                    value={stats.todayWithdrawals}
                    icon={FaWallet}
                    iconBgClass="bg-gray-600 shadow-gray-200"
                />
                <StatCard
                    label="Daily Payouts"
                    value={`₹${stats.todayPayouts}`}
                    icon={FaCheckCircle}
                    iconBgClass="bg-green-600 shadow-green-200"
                />
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative z-10">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/30">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <h2 className="text-xl font-black text-gray-800 tracking-tight">Recent Transactions</h2>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Monitoring latest 500 actions across the platform</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <FaExchangeAlt size={20} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Email</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${txn.transaction_type === 'withdrawal' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                                }`}>
                                                {txn.transaction_type.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors capitalize">{txn.transaction_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-base font-black text-gray-900 tracking-tight">₹{txn.amount}</td>
                                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">{txn.email}</td>
                                    <td className="px-8 py-5 text-[11px] text-gray-500 font-bold uppercase">
                                        {new Date(txn.created_at).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${txn.status === 'success' ? 'bg-green-100 text-green-700 shadow-sm shadow-green-100' : 'bg-orange-100 text-orange-700 shadow-sm shadow-orange-100'
                                            }`}>
                                            {txn.status || 'Processing'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <FaExchangeAlt size={32} />
                            </div>
                            <p className="text-gray-400 font-bold tracking-tight">No recent activity detected</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Extra Visual Section (Footer) */}
            <div className="bg-indigo-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/30">
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl">
                        <h3 className="text-4xl font-black tracking-tight mb-4 leading-tight">Master Control <br /><span className="text-indigo-400">Environment</span></h3>
                        <p className="text-indigo-200/80 font-medium text-lg">Securely managing the complete reward lifecycle with encrypted protocols and real-time ledger verification.</p>
                    </div>
                    <div className="flex gap-6 w-full lg:w-auto">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center flex-1 lg:min-w-[160px] group hover:bg-white/15 transition-all">
                            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Status</p>
                            <p className="font-black text-2xl uppercase tracking-tighter italic text-green-400">SECURE</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center flex-1 lg:min-w-[160px] group hover:bg-white/15 transition-all">
                            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Node</p>
                            <p className="font-black text-2xl tracking-tighter">#001C-PRM</p>
                        </div>
                    </div>
                </div>

                {/* Decorative BG pattern */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Global background decoration circles */}
            <div className="fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-50/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-purple-50/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        </div>
    );
};

export default Dashboard;
