import { useEffect, useState } from 'react';
import { FaCheck, FaImage, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { deleteSubmission, getSubmissions, reviewSubmission } from '../api';

const STATUS_TABS = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: '', label: 'All' },
];

const statusBadge = (status) => {
    const map = {
        pending: 'bg-amber-100 text-amber-700',
        approved: 'bg-emerald-100 text-emerald-700',
        rejected: 'bg-red-100 text-red-700',
    };
    return `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${map[status] || 'bg-gray-100 text-gray-600'}`;
};

const TaskSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');
    const [preview, setPreview] = useState(null);

    const fetchData = async (status = activeTab) => {
        setLoading(true);
        try {
            const data = await getSubmissions(status);
            setSubmissions(Array.isArray(data) ? data : []);
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load submissions' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(activeTab); /* eslint-disable-next-line */ }, [activeTab]);

    const handleApprove = async (sub) => {
        const confirm = await Swal.fire({
            icon: 'question',
            title: `Approve submission #${sub.id}?`,
            text: `Reward of ₹${sub.amount} will be credited to ${sub.user_name || `user #${sub.user_id}`}.`,
            showCancelButton: true,
            confirmButtonText: 'Approve',
            confirmButtonColor: '#10b981',
        });
        if (!confirm.isConfirmed) return;
        try {
            await reviewSubmission(sub.id, { status: 'approved' });
            Swal.fire({ icon: 'success', title: 'Approved', timer: 1500, showConfirmButton: false });
            fetchData();
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error', text: e.response?.data?.message || 'Failed' });
        }
    };

    const handleReject = async (sub) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: `Reject submission #${sub.id}?`,
            input: 'text',
            inputLabel: 'Reason (optional, shown to user)',
            inputPlaceholder: 'Screenshot is unclear...',
            showCancelButton: true,
            confirmButtonText: 'Reject',
            confirmButtonColor: '#dc2626',
        });
        if (!result.isConfirmed) return;
        try {
            await reviewSubmission(sub.id, { status: 'rejected', admin_note: result.value || null });
            Swal.fire({ icon: 'success', title: 'Rejected', timer: 1500, showConfirmButton: false });
            fetchData();
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error', text: e.response?.data?.message || 'Failed' });
        }
    };

    const handleDelete = async (sub) => {
        const c = await Swal.fire({
            title: 'Delete submission?',
            text: 'The screenshot file will be removed.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
        });
        if (!c.isConfirmed) return;
        try {
            await deleteSubmission(sub.id);
            fetchData();
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete' });
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">TASK <span className="text-indigo-600">SUBMISSIONS</span></h2>
                <p className="text-gray-500 font-medium text-sm mt-1">Review screenshots uploaded by users for offers that require verification.</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
                {STATUS_TABS.map((t) => (
                    <button
                        key={t.value || 'all'}
                        onClick={() => setActiveTab(t.value)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === t.value
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center py-32 space-y-3">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Loading...</p>
                </div>
            ) : submissions.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
                    <FaSearch className="mx-auto text-gray-300 mb-6" size={32} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No submissions</h3>
                    <p className="text-gray-500 text-sm">There are no {activeTab || 'matching'} submissions right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {submissions.map((sub) => (
                        <div key={sub.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                            {(() => {
                                const urls = Array.isArray(sub.screenshot_urls) && sub.screenshot_urls.length > 0
                                    ? sub.screenshot_urls
                                    : (sub.screenshot_url ? [sub.screenshot_url] : []);
                                return (
                                    <div className="relative">
                                        <button
                                            onClick={() => setPreview(urls[0])}
                                            className="relative h-56 w-full bg-gray-100 overflow-hidden group block"
                                        >
                                            {urls[0] ? (
                                                <img src={urls[0]} alt="Submission screenshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage size={36} /></div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <span className={statusBadge(sub.status)}>{sub.status}</span>
                                            </div>
                                            {urls.length > 1 && (
                                                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">
                                                    {urls.length} images
                                                </div>
                                            )}
                                        </button>
                                        {urls.length > 1 && (
                                            <div className="flex gap-2 px-3 pt-3 pb-1 overflow-x-auto">
                                                {urls.slice(1).map((u, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setPreview(u)}
                                                        className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 hover:border-indigo-400 transition-colors"
                                                    >
                                                        <img src={u} alt={`Screenshot ${i + 2}`} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            <div className="p-5 flex-1 flex flex-col gap-3">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Offer</p>
                                    <p className="text-base font-black text-gray-900">{sub.offer_name || `#${sub.offer_id}`}</p>
                                    <p className="text-xs text-indigo-600 font-bold mt-0.5">Reward ₹{sub.amount}</p>
                                </div>
                                <div className="text-sm">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">User</p>
                                    <p className="font-bold text-gray-900">{sub.user_name || `User #${sub.user_id}`}</p>
                                    {sub.user_email && <p className="text-xs text-gray-500">{sub.user_email}</p>}
                                </div>
                                <div className="text-[11px] text-gray-400">
                                    Submitted: {new Date(sub.created_at).toLocaleString()}
                                    {sub.reviewed_at && <> · Reviewed: {new Date(sub.reviewed_at).toLocaleString()}</>}
                                </div>
                                {sub.admin_note && (
                                    <p className="text-xs bg-gray-50 rounded-lg px-3 py-2 text-gray-600">
                                        <span className="font-bold">Note:</span> {sub.admin_note}
                                    </p>
                                )}

                                <div className="mt-auto flex gap-2 pt-2">
                                    {sub.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleApprove(sub)}
                                                className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                <FaCheck size={11} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(sub)}
                                                className="flex-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                <FaTimes size={11} /> Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(sub)}
                                            className="flex-1 bg-gray-50 text-gray-500 hover:bg-red-600 hover:text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaTrash size={11} /> Delete Record
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox preview */}
            {preview && (
                <div onClick={() => setPreview(null)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <button onClick={() => setPreview(null)} className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
                        <FaTimes size={18} />
                    </button>
                    <img src={preview} alt="Preview" className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
};

export default TaskSubmissions;
