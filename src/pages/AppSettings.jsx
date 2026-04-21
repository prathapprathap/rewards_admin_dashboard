import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getAppSettings, updateAppSettings } from '../api';

const AppSettings = () => {
    const [settings, setSettings] = useState({
        site_name: '',
        site_url: '',
        support_email: '',
        telegram_link: '',
        whatsapp_link: '',
        primary_color: '#6DC000',
        wallet_symbol_image_url: '',
        currency_symbol: '₹',
        signup_bonus_cash: '5',
        min_withdrawal: '100',
        referral_fixed_reward: '10',
        referral_commission_percent: '10',
        referral_reward_type: 'both',
        referral_reward_target: 'referrer',
        referral_referred_user_bonus: '0',
        referral_min_offer_count: '1',
        checkin_target_days: '30',
        checkin_target_reward: '50',
        payment_mode: 'Manual',
        update_mode: 'Off',
        maintenance_mode: 'Off',
        refer_text: '',
        apk_download_url: '',
        app_package_name: '',
        privacy_policy_url: '',
        help_support_url: '',
    });
    const [loading, setLoading] = useState(true);



    const fetchSettings = async () => {
        try {
            const data = await getAppSettings();
            setSettings(prev => ({ ...prev, ...data }));
            setLoading(false);
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch settings.',
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAppSettings(settings);
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Settings updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update settings.',
            });
        }
    };

    const settingsConfig = [
        { key: 'site_name', label: 'Site Name', type: 'text', icon: '🌐' },
        { key: 'site_url', label: 'Site URL', type: 'text', icon: '🔗' },
        { key: 'support_email', label: 'Support Email', type: 'email', icon: '📧' },
        { key: 'telegram_link', label: 'Telegram Link', type: 'text', icon: '📢' },
        { key: 'whatsapp_link', label: 'WhatsApp Link', type: 'text', icon: '💬' },
        { key: 'primary_color', label: 'Primary Color', type: 'color', icon: '🎨' },
        { key: 'wallet_symbol_image_url', label: 'Wallet Symbol Image URL', type: 'text', icon: '🪙' },
        { key: 'currency_symbol', label: 'Currency Symbol (₹, $, etc)', type: 'text', icon: '💱' },
        { key: 'signup_bonus_cash', label: 'Signup Bonus (₹)', type: 'number', icon: '🎁' },
        { key: 'min_withdrawal', label: 'Min Withdrawal (₹)', type: 'number', icon: '💸' },
        { key: 'referral_fixed_reward', label: 'Referral Reward (₹)', type: 'number', icon: '💰' },
        { key: 'referral_commission_percent', label: 'Referral Commission (%)', type: 'number', icon: '📊' },
        { key: 'referral_reward_type', label: 'Referral Model (fixed/percent/both)', type: 'text', icon: '⚙️' },
        { key: 'referral_reward_target', label: 'Referral Reward Target (referrer/referred_user/both)', type: 'text', icon: '🎯' },
        { key: 'referral_referred_user_bonus', label: 'Referred User Bonus (₹)', type: 'number', icon: '🧑' },
        { key: 'referral_min_offer_count', label: 'Referral Min Completed Offers', type: 'number', icon: '✅' },
        { key: 'checkin_target_days', label: 'Check-in Goal (Days)', type: 'number', icon: '🎯' },
        { key: 'checkin_target_reward', label: 'Check-in Reward (₹)', type: 'number', icon: '🏆' },
        { key: 'payment_mode', label: 'Payment Mode', type: 'text', icon: '💳' },
        { key: 'update_mode', label: 'Update Mode', type: 'text', icon: '🔄' },
        { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'text', icon: '🛠️' },
        { key: 'apk_download_url', label: 'APK Download URL', type: 'text', icon: '📲' },
        { key: 'app_package_name', label: 'App Package Name (Play Store)', type: 'text', icon: '📦' },
        { key: 'privacy_policy_url', label: 'Privacy Policy URL', type: 'text', icon: '🔒' },
        { key: 'help_support_url', label: 'Help & Support URL', type: 'text', icon: '🆘' },
        { key: 'refer_text', label: 'Refer Page Text', type: 'textarea', icon: '📝' },
        { key: 'telegram_link', label: 'Telegram Join Link', type: 'text', icon: '✈️' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 font-sans">
            {/* Header section with Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">Global Configuration</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">SYSTEM <span className="text-indigo-600">SETTINGS</span></h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black tracking-tight mb-1 uppercase">Protocol Parameters</h3>
                            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Core environment variables</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px]"></div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {settingsConfig.map((config) => (
                                <div key={config.key} className="space-y-2 group">
                                    <div className="flex items-center gap-2 ml-1">
                                        <span className="text-lg group-focus-within:scale-125 transition-transform duration-300">{config.icon}</span>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-focus-within:text-indigo-600 transition-colors">
                                            {config.label}
                                        </label>
                                    </div>

                                    {config.type === 'textarea' ? (
                                        <textarea
                                            name={config.key}
                                            value={settings[config.key] || ''}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-gray-900 italic resize-none"
                                            placeholder={`Enter ${config.label.toLowerCase()}...`}
                                        />
                                    ) : config.key === 'primary_color' ? (
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="color"
                                                name={config.key}
                                                value={settings[config.key] || '#6DC000'}
                                                onChange={handleChange}
                                                className="w-16 h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl p-1 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                name={config.key}
                                                value={settings[config.key] || ''}
                                                onChange={handleChange}
                                                className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-gray-900 font-mono"
                                                placeholder="#000000"
                                            />
                                        </div>
                                    ) : (
                                        <input
                                            type={config.type}
                                            name={config.key}
                                            value={settings[config.key] || ''}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-gray-900"
                                            placeholder={`Enter ${config.label.toLowerCase()}...`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final Actions */}
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-indigo-600 text-white font-black py-5 px-8 rounded-[2rem] hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98] tracking-widest text-xs"
                    >
                        SYNCHRONIZE PARAMETERS
                    </button>
                    <button
                        type="button"
                        onClick={fetchSettings}
                        className="px-10 py-5 bg-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest rounded-[2rem] hover:bg-gray-200 transition-all duration-300 active:scale-95"
                    >
                        REVERT STATE
                    </button>
                </div>
            </form>

            <div className="text-center pt-10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    &copy; {new Date().getFullYear()} REWARDMOBI SECURE SYSTEMS
                </p>
            </div>
        </div>
    );
};

export default AppSettings;
