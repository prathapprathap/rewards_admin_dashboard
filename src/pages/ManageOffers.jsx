import { useEffect, useState } from 'react';
import { FaEdit, FaGripVertical, FaPlus, FaTasks, FaTimes, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { deleteOffer, getOffers, getOfferSteps, updateOffer } from '../api';

const ManageOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editOffer, setEditOffer] = useState(null);
    const [formData, setFormData] = useState({
        offer_name: '',
        offer_id: '',
        side_label: '',
        side_label_color: '',
        heading: '',
        history_name: '',
        offer_url: '',
        tracking_link: '',
        amount: '',
        currency_type: 'cash',
        event_name: '',
        description: '',
        image_url: '',
        refer_payout: '',
        status: 'Active'
    });
    const [eventSteps, setEventSteps] = useState([]);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const data = await getOffers();
            setOffers(data);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to fetch offers!' });
        } finally {
            setLoading(false);
        }
    };

    // ── Event Step helpers ─────────────────────────────────────────────────
    const addEventStep = () => {
        setEventSteps([
            ...eventSteps,
            { event_id: `evt${eventSteps.length}`, event_name: '', description: '', points: '', currency_type: formData.currency_type || 'cash' }
        ]);
    };

    const updateEventStep = (index, field, value) => {
        const updated = [...eventSteps];
        updated[index] = { ...updated[index], [field]: value };
        setEventSteps(updated);
    };

    const removeEventStep = (index) => setEventSteps(eventSteps.filter((_, i) => i !== index));

    const moveEventStep = (from, to) => {
        if (to < 0 || to >= eventSteps.length) return;
        const updated = [...eventSteps];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        setEventSteps(updated);
    };

    const totalFromEvents = eventSteps.reduce((s, e) => s + (parseFloat(e.points) || 0), 0);

    // ── Edit click ────────────────────────────────────────────────────────
    const handleEditClick = async (offer) => {
        setEditOffer(offer);
        setFormData({
            offer_name: offer.offer_name || '',
            offer_id: offer.offer_id || '',
            side_label: offer.side_label || '',
            side_label_color: offer.side_label_color || '',
            heading: offer.heading || '',
            history_name: offer.history_name || '',
            offer_url: offer.offer_url || '',
            tracking_link: offer.tracking_link || '',
            amount: offer.amount || '',
            currency_type: offer.currency_type || 'cash',
            event_name: offer.event_name || '',
            description: offer.description || '',
            image_url: offer.image_url || '',
            refer_payout: offer.refer_payout || '1st Event',
            status: offer.status || 'Active'
        });

        // Refetch full steps
        try {
            const steps = await getOfferSteps(offer.id);
            if (steps && steps.length > 0) {
                setEventSteps(steps.map(s => ({
                    ...s,
                    points: s.points.toString(), // Convert to string for number input
                })));
            } else {
                setEventSteps([]);
            }
        } catch (err) {
            console.error('Failed to fetch steps:', err);
            setEventSteps([]);
        }
    };

    // ── Update ────────────────────────────────────────────────────────────
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                events: eventSteps.map((step, i) => ({
                    event_id: step.event_id || `evt${i}`,
                    event_name: step.event_name,
                    description: step.description || '',
                    points: parseFloat(step.points) || 0,
                    currency_type: step.currency_type || formData.currency_type,
                })),
            };
            await updateOffer(editOffer.id, payload);
            Swal.fire({ icon: 'success', title: 'Updated!', text: 'Offer updated successfully.', timer: 2000, showConfirmButton: false });
            setEditOffer(null);
            setEventSteps([]);
            fetchOffers();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update offer.';
            Swal.fire({ icon: 'error', title: 'Error!', text: errorMsg });
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Offer?', text: "You won't be able to revert this!",
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6', confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            try {
                await deleteOffer(id);
                Swal.fire('Deleted!', 'Offer has been deleted.', 'success');
                fetchOffers();
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete offer.' });
            }
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">OFFER <span className="text-indigo-600">INVENTORY</span></h2>
                    <p className="text-gray-500 font-medium text-sm mt-1">Control and monitor all active reward opportunities</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Accessing Database...</p>
                </div>
            ) : offers.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                        <FaTasks size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Offers Found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8">Your inventory is currently empty. Start by creating a new offer to engage your users.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-500">
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                {offer.image_url ? (
                                    <img src={offer.image_url} alt={offer.offer_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><FaTasks size={48} /></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
                                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md ${offer.status?.toLowerCase() === 'active' ? 'bg-emerald-500/90 text-white' : 'bg-orange-500/90 text-white'}`}>
                                        {offer.status || 'Active'}
                                    </span>
                                </div>

                                <div className="absolute bottom-4 left-6 right-6">
                                    <h3 className="text-lg font-black text-white leading-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">{offer.offer_name}</h3>
                                    <p className="text-white/70 text-xs font-bold uppercase tracking-wider mt-1">{offer.heading}</p>
                                </div>
                                {offer.side_label && (
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg bg-white text-gray-900">
                                            {offer.side_label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[2.5rem] font-medium italic">
                                    "{offer.description}"
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">User Reward</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-3xl font-black text-indigo-600 tracking-tighter">
                                                    {offer.currency_type === 'coins' ? '🪙' : offer.currency_type === 'gems' ? '💎' : '₹'}
                                                    {offer.amount}
                                                </p>
                                                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded-lg">
                                                    {offer.currency_type || 'cash'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Status Code</p>
                                            <p className="text-xs font-bold text-gray-900">#OFFER_{offer.id}</p>
                                        </div>
                                    </div>

                                    {/* Event steps indicator */}
                                    {offer.event_count > 0 && (
                                        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
                                            <p className="text-[9px] font-black text-violet-600 uppercase tracking-widest mb-1">🎯 {offer.event_count} Event Step(s)</p>
                                            <p className="text-xs text-violet-700 font-medium truncate">{offer.event_names?.replace(/\|/g, ' → ')}</p>
                                        </div>
                                    )}

                                    {offer.tracking_link && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                                            <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1">🎯 Tracking URL</p>
                                            <p className="text-xs text-green-700 font-mono truncate">{offer.tracking_link}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => handleEditClick(offer)} className="flex-1 bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-widest py-4 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
                                        <FaEdit size={12} /> EDIT NODE
                                    </button>
                                    <button onClick={() => handleDelete(offer.id)} className="flex-1 bg-red-50 text-red-600 font-black text-xs uppercase tracking-widest py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
                                        <FaTrash size={12} /> REMOVE NODE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── Edit Modal ─────────────────────────────────────────────── */}
            {editOffer && (
                <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20 max-h-[90vh] flex flex-col">
                        <div className="bg-indigo-900 p-8 text-white relative overflow-hidden flex-shrink-0">
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black tracking-tight uppercase leading-none">Modify Offer Node</h3>
                                    <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Adjust existing parameters</p>
                                </div>
                                <button onClick={() => { setEditOffer(null); setEventSteps([]); }} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <FaTimes size={18} />
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[40px]"></div>
                        </div>

                        <form onSubmit={handleUpdate} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { id: 'offer_name', label: 'Offer Identity', placeholder: 'e.g. Premium Access', type: 'text' },
                                    { id: 'offer_id', label: 'Internal UID', placeholder: 'e.g. OFFER_X_101', type: 'text' },
                                    { id: 'side_label', label: 'Side Label', placeholder: 'e.g. Install / Hot / Special', type: 'text', required: false },
                                    {
                                        id: 'side_label_color',
                                        label: 'Label Color',
                                        type: 'color_picker',
                                        required: false
                                    },
                                    { id: 'heading', label: 'Call to Action', placeholder: 'e.g. INSTALL & REGISTER', type: 'text' },
                                    { id: 'history_name', label: 'Ledger Label', placeholder: 'e.g. Signup Completion', type: 'text' },
                                    { id: 'offer_url', label: 'Target URI', placeholder: 'https://...', type: 'text' },
                                    { id: 'tracking_link', label: 'Tracking URL', placeholder: 'https://track.offer18...', type: 'text', required: false },
                                    { id: 'image_url', label: 'Asset URI (Image)', placeholder: 'https://...', type: 'text' },
                                    { id: 'amount', label: 'Credit Value', placeholder: '0.00', type: 'number' },
                                    { id: 'refer_payout', label: 'Referral Bonus', placeholder: '1st Event', type: 'text' },
                                    { id: 'event_name', label: 'Legacy Event', placeholder: 'e.g. registration', type: 'text', required: false },
                                ].map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{field.label}</label>
                                        {field.type === 'color_picker' ? (
                                            <div className="flex gap-3">
                                                <div className="relative flex-1 group/color">
                                                    <input
                                                        type="text"
                                                        value={formData[field.id]}
                                                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900 placeholder:text-gray-400"
                                                        placeholder="#000000"
                                                    />
                                                    <div
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl border-2 border-white shadow-sm transition-transform group-hover/color:scale-110"
                                                        style={{ backgroundColor: formData[field.id] || '#000000' }}
                                                    ></div>
                                                </div>
                                                <input
                                                    type="color"
                                                    value={formData[field.id] && formData[field.id].startsWith('#') ? formData[field.id] : '#6366f1'}
                                                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value.toUpperCase() })}
                                                    className="w-16 h-[60px] bg-gray-50 border-2 border-gray-100 rounded-2xl p-1 cursor-pointer outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                                />
                                            </div>
                                        ) : (
                                            <input
                                                type={field.type}
                                                required={field.required !== false}
                                                value={formData[field.id]}
                                                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900 placeholder:text-gray-300"
                                                placeholder={field.placeholder}
                                            />
                                        )}
                                    </div>
                                ))}

                                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Mission Briefing (Description)</label>
                                    <textarea
                                        required rows="3" value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none"
                                        placeholder="Detailed instructions for the user..."
                                    />
                                </div>

                                {/* Currency Type removed - defaulting to cash */}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Deployment Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900 appearance-none">
                                        <option value="Active">ACTIVE</option>
                                        <option value="Inactive">INACTIVE</option>
                                    </select>
                                </div>
                            </div>

                            {/* ── Event Steps inside Edit Modal ──────────────── */}
                            <div className="border-2 border-violet-100 rounded-3xl overflow-hidden">
                                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-5 text-white flex justify-between items-center">
                                    <div>
                                        <h4 className="font-black text-sm uppercase tracking-widest">🎯 Multi-Event Steps</h4>
                                        {eventSteps.length > 0 && (
                                            <p className="text-violet-200 text-xs mt-1">Total: ₹{totalFromEvents.toFixed(2)} across {eventSteps.length} step(s)</p>
                                        )}
                                    </div>
                                    <button type="button" onClick={addEventStep} className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-2">
                                        <FaPlus size={10} /> Add
                                    </button>
                                </div>

                                <div className="p-5 space-y-3">
                                    {eventSteps.length === 0 ? (
                                        <p className="text-center text-gray-400 text-sm py-8">No event steps configured. Click "Add" to create reward milestones.</p>
                                    ) : (
                                        eventSteps.map((step, index) => (
                                            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-3">
                                                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                                                    {/* Reorder */}
                                                    <div className="flex flex-col gap-0.5 items-center">
                                                        <button type="button" onClick={() => moveEventStep(index, index - 1)} className="text-gray-300 hover:text-indigo-600"><span className="text-xs">▲</span></button>
                                                        <FaGripVertical className="text-gray-300" size={10} />
                                                        <button type="button" onClick={() => moveEventStep(index, index + 1)} className="text-gray-300 hover:text-indigo-600"><span className="text-xs">▼</span></button>
                                                    </div>

                                                    <span className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 font-black text-xs flex-shrink-0">{index + 1}</span>

                                                    <input type="text" value={step.event_name} onChange={(e) => updateEventStep(index, 'event_name', e.target.value)} placeholder="Event Name"
                                                        className="flex-[3] min-w-0 bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm font-bold outline-none focus:border-indigo-500" />
                                                    <input type="number" value={step.points} onChange={(e) => updateEventStep(index, 'points', e.target.value)} placeholder="Points"
                                                        className="w-24 bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm font-black text-indigo-600 outline-none focus:border-indigo-500" />

                                                    <button type="button" onClick={() => removeEventStep(index)} className="w-7 h-7 bg-red-50 rounded flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all flex-shrink-0">
                                                        <FaTimes size={10} />
                                                    </button>
                                                </div>
                                                <div className="w-full">
                                                    {/* Dynamic Bullets Instruction Management */}
                                                    <div className="space-y-2 mt-2">
                                                        <div className="flex items-center justify-between px-1">
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Instruction Bullets</p>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const current = step.description || '';
                                                                    const newDesc = current ? `${current}\n• ` : '• ';
                                                                    updateEventStep(index, 'description', newDesc);
                                                                }}
                                                                className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors flex items-center gap-1"
                                                            >
                                                                <FaPlus size={7} /> Add Bullet
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {(step.description || '').split('\n').filter(line => line.trim()).map((bullet, bIndex) => (
                                                                <div key={bIndex} className="flex gap-2 group/bullet">
                                                                    <div className="flex-1 relative">
                                                                        <input
                                                                            type="text"
                                                                            value={bullet.startsWith('• ') ? bullet.substring(2) : bullet}
                                                                            onChange={(e) => {
                                                                                const lines = (step.description || '').split('\n').filter(line => line.trim());
                                                                                lines[bIndex] = `• ${e.target.value}`;
                                                                                updateEventStep(index, 'description', lines.join('\n'));
                                                                            }}
                                                                            placeholder="Step milestone instruction..."
                                                                            className="w-full bg-white border border-gray-100 rounded-lg py-2 px-8 outline-none focus:border-indigo-500 transition-all font-medium text-gray-700 text-xs"
                                                                        />
                                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">•</div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const lines = (step.description || '').split('\n').filter(line => line.trim());
                                                                            lines.splice(bIndex, 1);
                                                                            updateEventStep(index, 'description', lines.join('\n'));
                                                                        }}
                                                                        className="w-8 h-8 bg-gray-50 text-gray-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover/bullet:opacity-100"
                                                                    >
                                                                        <FaTimes size={9} />
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            {!(step.description || '').trim() && (
                                                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest text-center py-2 border border-dashed border-gray-200 rounded-lg">No instructions added</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-4 pb-6">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-[10px] tracking-widest uppercase">
                                    AUTHORIZE ADJUSTMENTS
                                </button>
                                <button type="button" onClick={() => { setEditOffer(null); setEventSteps([]); }}
                                    className="px-10 py-5 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all duration-300 active:scale-95">
                                    ABORT MISSION
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default ManageOffers;
