import { useEffect, useState } from 'react';
import { FaCog, FaSave } from 'react-icons/fa';
import { getAppSettings, updateAppSettings } from '../api';

const AppSettings = () => {
    const [settings, setSettings] = useState({
        new_user_spin_bonus: '2',
        new_user_coin_bonus: '0',
        referral_reward: '10',
        referral_commission_percent: '10',
        min_withdrawal: '100',
        spin_reward_values: '1,2,5,10,25,50,100'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await getAppSettings();
            setSettings(prev => ({ ...prev, ...data }));
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch settings');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await updateAppSettings(settings);
            setSuccess('Settings updated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to update settings');
        }
    };

    const settingsConfig = [
        {
            key: 'new_user_spin_bonus',
            label: 'New User Spin Bonus',
            description: 'Number of free spins given to new users on signup',
            type: 'number',
            icon: '🎰'
        },
        {
            key: 'new_user_coin_bonus',
            label: 'New User Coin Bonus',
            description: 'Bonus coins credited to new users on signup',
            type: 'number',
            icon: '💰'
        },
        {
            key: 'referral_reward',
            label: 'Referral Signup Reward',
            description: 'Coins earned when someone signs up with your referral code',
            type: 'number',
            icon: '👥'
        },
        {
            key: 'referral_commission_percent',
            label: 'Referral Commission %',
            description: 'Commission percentage earned when referred users complete tasks',
            type: 'number',
            icon: '📊'
        },
        {
            key: 'min_withdrawal',
            label: 'Minimum Withdrawal Amount',
            description: 'Minimum coins required to request a withdrawal',
            type: 'number',
            icon: '💸'
        },
        {
            key: 'spin_reward_values',
            label: 'Spin Wheel Rewards',
            description: 'Comma-separated reward values for spin wheel (e.g., 1,2,5,10,25,50,100)',
            type: 'text',
            icon: '🎡'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <FaCog className="text-indigo-600" />
                    App Settings
                </h2>
                <p className="text-gray-600">Configure global application settings and rewards</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6 shadow-sm animate-pulse">
                    <p className="font-medium">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 max-w-4xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {settingsConfig.map((config) => (
                        <div key={config.key} className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200">
                            <label className="block mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{config.icon}</span>
                                    <span className="text-gray-800 font-bold">{config.label}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">{config.description}</p>
                                <input
                                    type={config.type}
                                    name={config.key}
                                    value={settings[config.key] || ''}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 font-medium"
                                />
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <FaSave /> Save Settings
                    </button>
                    <button
                        type="button"
                        onClick={fetchSettings}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppSettings;
