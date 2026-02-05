import axios from 'axios';
import { useEffect, useState } from 'react';

const ConversionAnalytics = () => {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
            const response = await axios.get(`${baseURL}/offer18/analytics/conversions`);
            setAnalytics(response.data.analytics || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-bold">{error}</p>
                    <button
                        onClick={fetchAnalytics}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const totalClicks = analytics.reduce((sum, item) => sum + (item.total_clicks || 0), 0);
    const totalConversions = analytics.reduce((sum, item) => sum + (item.conversions || 0), 0);
    const totalPayout = analytics.reduce((sum, item) => sum + parseFloat(item.total_payout || 0), 0);
    const avgConversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">Offer18 Integration</p>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                    CONVERSION <span className="text-indigo-600">ANALYTICS</span>
                </h1>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Total Clicks</div>
                    <div className="text-4xl font-black">{totalClicks.toLocaleString()}</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="text-green-100 text-xs font-bold uppercase tracking-widest mb-2">Conversions</div>
                    <div className="text-4xl font-black">{totalConversions.toLocaleString()}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="text-purple-100 text-xs font-bold uppercase tracking-widest mb-2">Conv. Rate</div>
                    <div className="text-4xl font-black">{avgConversionRate}%</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-2">Total Payout</div>
                    <div className="text-4xl font-black">₹{totalPayout.toFixed(2)}</div>
                </div>
            </div>

            {/* Analytics Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-indigo-900 p-6 text-white">
                    <h3 className="text-xl font-black tracking-tight uppercase">Offer Performance</h3>
                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-1">Click & Conversion Metrics</p>
                </div>

                <div className="overflow-x-auto">
                    {analytics.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-gray-300 text-6xl mb-4">📊</div>
                            <p className="text-gray-400 font-bold">No analytics data available</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Offer Name</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Clicks</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Conversions</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Conv. Rate</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Payout</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {analytics.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{item.offer_name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">ID: {item.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg">
                                                {item.total_clicks || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 font-bold rounded-lg">
                                                {item.conversions || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${Math.min(item.conversion_rate || 0, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-black text-purple-600">
                                                    {parseFloat(item.conversion_rate || 0).toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-lg font-black text-orange-600">
                                                ₹{parseFloat(item.total_payout || 0).toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center">
                <button
                    onClick={fetchAnalytics}
                    className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-600/20"
                >
                    Refresh Data
                </button>
            </div>
        </div>
    );
};

export default ConversionAnalytics;
