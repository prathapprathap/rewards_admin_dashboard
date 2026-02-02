import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getAppSettings, updateAppSettings } from '../api';

const AppSettings = () => {
    const [settings, setSettings] = useState({
        site_name: 'Rewardmobi',
        site_url: 'https://rewardmobi.xyz/',
        payment_mode: 'Manual',
        update_mode: 'Off',
        maintenance_mode: 'Off',
        social_media_links: '',
        refer_text: '',
        signup_bonus: '5',
        per_refer_amount: '5',
        captcha_site_key: '',
        captcha_private_key: '',
        earning_percent: '50',
        support_email: 'support@rewardmobi.xyz',
        min_withdrawal: '100',
        referral_reward: '10',
        referral_commission_percent: '10'
    });
    const [loading, setLoading] = useState(true);

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
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch settings.',
            });
            setLoading(false);
        }
    };

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
        { key: 'payment_mode', label: 'Payment Mode', type: 'text', icon: '💳' },
        { key: 'update_mode', label: 'Update Mode', type: 'text', icon: '🔄' },
        { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'text', icon: '🛠️' },
        { key: 'social_media_links', label: 'Social Media Links', type: 'text', icon: '📱' },
        { key: 'refer_text', label: 'Refer Text', type: 'textarea', icon: '📝' },
        { key: 'signup_bonus', label: 'Signup Bonus', type: 'number', icon: '🎁' },
        { key: 'per_refer_amount', label: 'Per Refer Amount', type: 'number', icon: '💰' },
        { key: 'captcha_site_key', label: 'Captcha Site Key', type: 'text', icon: '🔑' },
        { key: 'captcha_private_key', label: 'Captcha Private Key', type: 'text', icon: '🔒' },
        { key: 'earning_percent', label: 'Earning Percent', type: 'number', icon: '📈' },
        { key: 'support_email', label: 'Support Email', type: 'email', icon: '📧' },
        { key: 'min_withdrawal', label: 'Min Withdrawal', type: 'number', icon: '💸' },
        { key: 'referral_reward', label: 'Referral Reward', type: 'number', icon: '👥' },
        { key: 'referral_commission_percent', label: 'Referral %', type: 'number', icon: '📊' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">App Settings</h2>
                <p className="text-gray-600">Configure global application settings and technical keys</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-8 space-y-6">
                    {settingsConfig.map((config) => (
                        <div key={config.key} className="flex flex-col md:flex-row md:items-center border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="md:w-1/3 mb-2 md:mb-0">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <span>{config.icon}</span>
                                    {config.label}
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                {config.type === 'textarea' ? (
                                    <textarea
                                        name={config.key}
                                        value={settings[config.key] || ''}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full border rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none transition-all"
                                    />
                                ) : (
                                    <input
                                        type={config.type}
                                        name={config.key}
                                        value={settings[config.key] || ''}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none transition-all"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={fetchSettings}
                        className="ml-4 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Reset
                    </button>
                </div>
            </form>
            <p className="mt-8 text-center text-gray-500 text-sm">Copyright © RewardMobi All right reserved.</p>
        </div>
    );
};

export default AppSettings;
