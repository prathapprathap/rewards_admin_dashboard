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

    const StatCard = ({ label, value, icon: Icon, colorClass, iconBgClass }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${colorClass}`}>{label}</p>
                <p className="text-2xl font-black text-gray-800">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${iconBgClass}`}>
                <Icon size={20} />
            </div>
        </div>
    );

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Initializing Dashboard...</div>;

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total User"
                    value={stats.totalUsers}
                    icon={FaUsers}
                    colorClass="text-blue-500"
                    iconBgClass="bg-blue-500 shadow-blue-200"
                />
                <StatCard
                    label="Today's Login"
                    value={stats.todayLogin}
                    icon={FaUserCheck}
                    colorClass="text-purple-500"
                    iconBgClass="bg-purple-500 shadow-purple-200"
                />
                <StatCard
                    label="New Joined Today"
                    value={stats.newJoinedToday}
                    icon={FaList}
                    colorClass="text-orange-500"
                    iconBgClass="bg-orange-500 shadow-orange-200"
                />
                <StatCard
                    label="Today Leads"
                    value={stats.todayLeads}
                    icon={FaLink}
                    colorClass="text-yellow-500"
                    iconBgClass="bg-yellow-500 shadow-yellow-200"
                />
                <StatCard
                    label="Active Offer"
                    value={stats.activeOffer}
                    icon={FaTasks}
                    colorClass="text-red-500"
                    iconBgClass="bg-red-500 shadow-red-200"
                />
                <StatCard
                    label="Pending Payouts"
                    value={stats.pendingPayouts}
                    icon={FaClock}
                    colorClass="text-emerald-500"
                    iconBgClass="bg-emerald-500 shadow-emerald-200"
                />
                <StatCard
                    label="Today Withdrawals"
                    value={stats.todayWithdrawals}
                    icon={FaWallet}
                    colorClass="text-gray-500"
                    iconBgClass="bg-gray-500 shadow-gray-200"
                />
                <StatCard
                    label="Today Payouts"
                    value={`₹${stats.todayPayouts}`}
                    icon={FaCheckCircle}
                    colorClass="text-green-600"
                    iconBgClass="bg-green-600 shadow-green-200"
                />
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Recent 500 Transactions</h2>
                        <p className="text-xs text-gray-500">Latest earnings and withdrawals across the platform</p>
                    </div>
                    <FaExchangeAlt className="text-gray-300" size={24} />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Txn Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${txn.transaction_type === 'withdrawal' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                                }`}>
                                                {txn.transaction_type.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">{txn.transaction_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-gray-800">₹{txn.amount}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{txn.email}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {new Date(txn.created_at).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${txn.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {txn.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length === 0 && (
                        <div className="py-20 text-center text-gray-400">
                            No recent transactions found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
