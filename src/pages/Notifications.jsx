import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaBell, FaPaperPlane, FaTrash } from 'react-icons/fa';
import {
    createNotification,
    deleteNotification,
    getNotifications,
    getUsers,
} from '../api';

const blankForm = {
    title: '',
    body: '',
    image_url: '',
    action_url: '',
    target: 'all',
    target_user_id: '',
};

const Notifications = () => {
    const [list, setList] = useState([]);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(blankForm);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const fetchAll = async () => {
        try {
            const [n, u] = await Promise.all([getNotifications(), getUsers()]);
            setList(Array.isArray(n) ? n : []);
            setUsers(Array.isArray(u) ? u : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.body.trim()) {
            return Swal.fire({ icon: 'warning', title: 'Title and body are required' });
        }
        if (form.target === 'user' && !form.target_user_id) {
            return Swal.fire({ icon: 'warning', title: 'Pick a target user' });
        }
        setSending(true);
        try {
            const payload = {
                title: form.title.trim(),
                body: form.body.trim(),
                image_url: form.image_url.trim() || null,
                action_url: form.action_url.trim() || null,
                target: form.target,
                target_user_id: form.target === 'user' ? Number(form.target_user_id) : null,
            };
            const res = await createNotification(payload);
            const delivered = res.push?.successCount ?? 0;
            const recipients = res.recipients ?? 0;
            const reason = res.push?.reason;
            await Swal.fire({
                icon: delivered > 0 ? 'success' : 'warning',
                title: delivered > 0 ? 'Sent!' : 'Saved, but no push delivered',
                text: reason
                    ? `Recipients: ${recipients} · Delivered: ${delivered}\n${reason}`
                    : `Recipients: ${recipients} · Push delivered: ${delivered}`,
                timer: delivered > 0 ? 2500 : undefined,
                showConfirmButton: delivered === 0,
            });
            setForm(blankForm);
            fetchAll();
        } catch (e) {
            console.error(e);
            Swal.fire({ icon: 'error', title: 'Failed', text: e.response?.data?.message || e.message });
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id) => {
        const ok = await Swal.fire({
            icon: 'warning',
            title: 'Delete this notification?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        });
        if (!ok.isConfirmed) return;
        try {
            await deleteNotification(id);
            fetchAll();
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Failed', text: e.message });
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 font-sans">
            <div>
                <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">Engagement</p>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                    PUSH <span className="text-indigo-600">NOTIFICATIONS</span>
                </h1>
                <p className="text-gray-500 text-sm mt-2">Broadcast in-app + push notifications to your users.</p>
            </div>

            {/* Compose */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-10 space-y-6"
            >
                <h3 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
                    <FaPaperPlane className="text-indigo-600" /> New Broadcast
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Target</label>
                        <select
                            name="target"
                            value={form.target}
                            onChange={handleChange}
                            className="w-full mt-2 bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-gray-900"
                        >
                            <option value="all">All Users</option>
                            <option value="user">Specific User</option>
                        </select>
                    </div>

                    {form.target === 'user' && (
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User</label>
                            <select
                                name="target_user_id"
                                value={form.target_user_id}
                                onChange={handleChange}
                                className="w-full mt-2 bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-gray-900"
                            >
                                <option value="">Select user…</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        #{u.id} · {u.name || u.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Title</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full mt-2 bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-gray-900"
                            placeholder="🎁 Big news!"
                            maxLength={120}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Body</label>
                        <textarea
                            name="body"
                            value={form.body}
                            onChange={handleChange}
                            rows={3}
                            className="w-full mt-2 bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-gray-900"
                            placeholder="Write the message users will see…"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Image URL (optional)</label>
                        <input
                            name="image_url"
                            value={form.image_url}
                            onChange={handleChange}
                            className="w-full mt-2 bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-gray-900"
                            placeholder="https://…"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action URL (optional)</label>
                        <input
                            name="action_url"
                            value={form.action_url}
                            onChange={handleChange}
                            className="w-full mt-2 bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 px-4 font-bold text-gray-900"
                            placeholder="https://… or in-app deeplink"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-indigo-600 disabled:bg-indigo-400 text-white font-black py-4 px-8 rounded-[1.5rem] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 tracking-widest text-xs uppercase"
                >
                    {sending ? 'Sending…' : 'Send Notification'}
                </button>
            </form>

            {/* History */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-10">
                <h3 className="text-xl font-black tracking-tight uppercase mb-6 flex items-center gap-3">
                    <FaBell className="text-indigo-600" /> History
                </h3>

                {loading ? (
                    <p className="text-gray-400">Loading…</p>
                ) : list.length === 0 ? (
                    <p className="text-gray-400 italic">No notifications yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {list.map((n) => (
                            <li
                                key={n.id}
                                className="border border-gray-100 rounded-2xl p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                                            {n.target === 'all' ? 'ALL' : `USER #${n.target_user_id}`}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(n.created_at).toLocaleString()}
                                        </span>
                                        <span className="text-[10px] text-gray-400">· Delivered {n.sent_count}</span>
                                    </div>
                                    <p className="font-black text-gray-900">{n.title}</p>
                                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">{n.body}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(n.id)}
                                    className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications;
