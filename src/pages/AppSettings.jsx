import { useEffect, useState } from 'react';
import { getAppSettings, updateAppSettings } from '../api';

const AppSettings = () => {
    const [settings, setSettings] = useState({
        site_name: '',
        site_url: '',
        payment_mode: 'Manual',
        update_mode: 'Off',
        maintenance_mode: 'Off',
        social_media_links: '',
        refer_text: '',
        signup_bonus: '',
        per_refer_amount: '',
        captcha_site_key: '',
        captcha_private_key: '',
        earning_percent: '',
        support_email: ''
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
            // Merge fetched data with default structure to ensure controlled inputs
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
        } catch (err) {
            console.error(err);
            setError('Failed to update settings');
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">App Settings</h2>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-4xl">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Site Name</label>
                        <input name="site_name" value={settings.site_name} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Site URL</label>
                        <input name="site_url" value={settings.site_url} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Payment Mode</label>
                        <input name="payment_mode" value={settings.payment_mode} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Update Mode</label>
                        <input name="update_mode" value={settings.update_mode} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="Off<link><version>" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Maintenance Mode</label>
                        <input name="maintenance_mode" value={settings.maintenance_mode} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="Off<link><message>" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Social Media Links</label>
                        <input name="social_media_links" value={settings.social_media_links} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="link<link>" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Refer Text</label>
                        <textarea name="refer_text" value={settings.refer_text} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" rows="3" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Signup Bonus</label>
                        <input type="number" name="signup_bonus" value={settings.signup_bonus} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Per Refer Amount</label>
                        <input type="number" name="per_refer_amount" value={settings.per_refer_amount} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Captcha Site Key</label>
                        <input name="captcha_site_key" value={settings.captcha_site_key} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Captcha Private Key</label>
                        <input name="captcha_private_key" value={settings.captcha_private_key} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Earning Percent</label>
                        <input type="number" name="earning_percent" value={settings.earning_percent} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Support Email</label>
                        <input type="email" name="support_email" value={settings.support_email} onChange={handleChange} className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500" />
                    </div>
                </div>

                <div className="mt-6">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-bold">
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppSettings;
