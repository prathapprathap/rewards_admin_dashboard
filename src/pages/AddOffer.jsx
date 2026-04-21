import { useState } from 'react';
import { FaGripVertical, FaPlus, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createOffer } from '../api';

const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
};

const AddOffer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        offer_name: '',
        offer_id: '',
        side_label: '',
        heading: '',
        history_name: '',
        offer_url: '',
        tracking_link: '',
        amount: '',
        currency_type: 'cash',
        event_name: '',
        description: '',
        image_url: '',
        refer_payout: '1st Event',
        side_label_color: '',
        status: 'Active'
    });

    // Dynamic event steps
    const [eventSteps, setEventSteps] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    // ── Event Step Management ─────────────────────────────────────────────
    const addEventStep = () => {
        setEventSteps([
            ...eventSteps,
            {
                event_id: `evt${eventSteps.length}`,
                event_name: '',
                description: '',
                points: '',
                currency_type: formData.currency_type || 'cash',
            }
        ]);
    };

    const updateEventStep = (index, field, value) => {
        const updated = [...eventSteps];
        updated[index] = { ...updated[index], [field]: value };
        setEventSteps(updated);
    };

    const removeEventStep = (index) => {
        setEventSteps(eventSteps.filter((_, i) => i !== index));
    };

    const moveEventStep = (from, to) => {
        if (to < 0 || to >= eventSteps.length) return;
        const updated = [...eventSteps];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        setEventSteps(updated);
    };

    // ── Validation ────────────────────────────────────────────────────────
    const validate = () => {
        let tempErrors = {};
        if (!formData.offer_name.trim()) tempErrors.offer_name = "Offer Name is required";
        if (!formData.offer_id.trim()) tempErrors.offer_id = "Offer ID is required";
        if (!formData.heading.trim()) tempErrors.heading = "Heading is required";
        if (!formData.offer_url.trim()) tempErrors.offer_url = "Offer URL is required";
        if (!formData.amount) {
            tempErrors.amount = "Amount is required";
        } else if (isNaN(formData.amount) || Number(formData.amount) < 0) {
            tempErrors.amount = "Amount must be a valid positive number";
        }
        // event_name is optional when using event steps
        if (eventSteps.length === 0 && !formData.event_name.trim()) {
            tempErrors.event_name = "Either add event steps or set a single event name";
        }
        if (!formData.description.trim()) tempErrors.description = "Description is required";
        if (!formData.image_url.trim()) tempErrors.image_url = "Image URL is required";

        // Validate each event step
        eventSteps.forEach((step, i) => {
            if (!step.event_name.trim()) tempErrors[`event_step_name_${i}`] = "Event name required";
            if (!step.points || isNaN(step.points) || Number(step.points) < 0) {
                tempErrors[`event_step_points_${i}`] = "Valid points required";
            }
        });

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // ── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please check the form for missing or incorrect fields.',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const processedData = {
                ...formData,
                offer_url: formData.offer_url.trim().startsWith('http')
                    ? formData.offer_url.trim()
                    : `https://${formData.offer_url.trim()}`,
                image_url: formData.image_url.trim().startsWith('http')
                    ? formData.image_url.trim()
                    : `https://${formData.image_url.trim()}`,
                // Include event steps array
                events: eventSteps.map((step, i) => ({
                    event_id: step.event_id || `evt${i}`,
                    event_name: step.event_name,
                    description: step.description || '',
                    points: parseFloat(step.points) || 0,
                    currency_type: step.currency_type || formData.currency_type,
                })),
            };

            await createOffer(processedData);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Offer deployed with ${eventSteps.length} event step(s).`,
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/manage-offers');
        } catch (error) {
            console.error('Error creating offer:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to create offer.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Auto-calc total from event steps ──────────────────────────────────
    const totalFromEvents = eventSteps.reduce(
        (sum, s) => sum + (parseFloat(s.points) || 0), 0
    );

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">Content Creation</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">DEPLOY <span className="text-indigo-600">OFFER</span></h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* ─── Main Offer Info ─────────────────────────────────────── */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black tracking-tight mb-1 uppercase">Node Configuration</h3>
                            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Global Parameters</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px]"></div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            {/* Offer Name */}
                            <InputField label="Offer Identity" name="offer_name" placeholder="Enter premium name" value={formData.offer_name} onChange={handleChange} error={errors.offer_name} />
                            {/* Offer ID */}
                            <InputField label="System ID" name="offer_id" placeholder="Unique identifier" value={formData.offer_id} onChange={handleChange} error={errors.offer_id} />
                            {/* Side Label */}
                            <InputField label="Side Label" name="side_label" placeholder="e.g. Install / Hot / Limited" value={formData.side_label} onChange={handleChange} />
                            {/* Side Label Color */}
                            <ColorPickerField label="Label Color" name="side_label_color" value={formData.side_label_color} onChange={handleChange} />
                            {/* Heading */}
                            <InputField label="Public Heading" name="heading" placeholder="Attractive title" value={formData.heading} onChange={handleChange} error={errors.heading} />
                            {/* History Name */}
                            <InputField label="Ledger Name" name="history_name" placeholder="Internal tracking title" value={formData.history_name} onChange={handleChange} />
                            {/* Offer URL */}
                            <InputField label="Target URI" name="offer_url" placeholder="Destination protocol" value={formData.offer_url} onChange={handleChange} error={errors.offer_url} />
                            {/* Tracking Link */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Tracking URL (Offer18)</label>
                                <input
                                    type="text"
                                    name="tracking_link"
                                    placeholder="https://track.offer18.com/... (with macros)"
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-gray-300 font-bold text-gray-900"
                                    value={formData.tracking_link}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-gray-400 ml-1">Use macros: {'{clickid}'}, {'{user_id}'}, {'{offer_id}'}</p>
                            </div>
                            {/* Amount */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">
                                    Value Capture
                                    {eventSteps.length > 0 && (
                                        <span className="ml-2 text-indigo-600 normal-case tracking-normal">(events total: ₹{totalFromEvents.toFixed(2)})</span>
                                    )}
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="0.00"
                                    className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-gray-300 font-black text-indigo-600 text-xl ${errors.amount ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
                                    value={formData.amount}
                                    onChange={handleChange}
                                />
                                {errors.amount && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.amount}</p>}
                            </div>
                            {/* Currency Type */}
                            {/* Currency Type removed - defaulting to cash */}
                            {/* Event Name (legacy single-event) */}
                            <InputField label="Conversion Node (single event)" name="event_name" placeholder="Trigger event (or use multi-event below)" value={formData.event_name} onChange={handleChange} error={errors.event_name} />
                            {/* Image URL */}
                            <InputField label="Icon Asset URI" name="image_url" placeholder="Asset CDN link" value={formData.image_url} onChange={handleChange} error={errors.image_url} />
                            <SelectField
                                label="Referral Protocol"
                                name="refer_payout"
                                value={formData.refer_payout}
                                onChange={handleChange}
                                options={[
                                    ...eventSteps.map((_, i) => ({
                                        value: `${i + 1}${getOrdinal(i + 1)} Event`,
                                        label: `${i + 1}${getOrdinal(i + 1)} Event`
                                    })),
                                    { value: 'All Event', label: 'All Event' },
                                    { value: 'Reffer Pause', label: 'Reffer Pause' },
                                ].filter((opt, index, self) =>
                                    index === self.findIndex((t) => t.value === opt.value)
                                )}
                            />
                            {/* Status */}
                            <SelectField label="Deployment Status" name="status" value={formData.status} onChange={handleChange} options={[
                                { value: 'Active', label: 'Active Mode' },
                                { value: 'Inactive', label: 'Standby Mode' },
                            ]} />
                        </div>

                        {/* Description */}
                        <div className="mt-10 space-y-2 group">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Mission Briefing</label>
                            <textarea
                                name="description"
                                placeholder="Detailed operational instructions..."
                                rows="4"
                                className={`w-full bg-gray-50 border-2 rounded-2xl py-6 px-8 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none placeholder:text-gray-300 font-medium text-gray-900 italic ${errors.description ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* ─── Multi-Event Steps Section ──────────────────────────── */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black tracking-tight mb-1 uppercase">🎯 Multi-Event Steps</h3>
                                <p className="text-violet-200 text-xs font-bold uppercase tracking-widest">Progressive reward milestones (Install → Level 5 → Purchase)</p>
                            </div>
                            <button
                                type="button"
                                onClick={addEventStep}
                                className="bg-white/20 hover:bg-white/30 text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded-2xl transition-all duration-300 active:scale-95 flex items-center gap-2 backdrop-blur-sm"
                            >
                                <FaPlus size={10} /> Add Step
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[40px]"></div>
                    </div>

                    <div className="p-8 md:p-12">
                        {eventSteps.length === 0 ? (
                            <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                                    <FaPlus size={24} />
                                </div>
                                <h4 className="text-gray-900 font-bold mb-2">No Event Steps Added</h4>
                                <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                                    Add multiple reward milestones for this offer. Each step awards specific points when the provider fires the corresponding postback.
                                </p>
                                <button
                                    type="button"
                                    onClick={addEventStep}
                                    className="bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-widest py-3 px-8 rounded-2xl hover:bg-indigo-100 transition-all active:scale-95"
                                >
                                    <FaPlus className="inline mr-2" size={10} /> Add First Step
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {eventSteps.map((step, index) => (
                                    <div key={index} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-indigo-200 transition-all group">
                                        <div className="flex items-center gap-3 mb-4">
                                            {/* Drag handle / reorder */}
                                            <div className="flex flex-col gap-0.5">
                                                <button type="button" onClick={() => moveEventStep(index, index - 1)} className="text-gray-300 hover:text-indigo-600 transition-colors" title="Move up">
                                                    <span className="text-xs">▲</span>
                                                </button>
                                                <FaGripVertical className="text-gray-300" size={12} />
                                                <button type="button" onClick={() => moveEventStep(index, index + 1)} className="text-gray-300 hover:text-indigo-600 transition-colors" title="Move down">
                                                    <span className="text-xs">▼</span>
                                                </button>
                                            </div>

                                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                <span className="text-indigo-600 font-black text-sm">{index + 1}</span>
                                            </div>
                                            <span className="font-black text-gray-900 text-sm uppercase tracking-wider flex-1">
                                                Step {index + 1}
                                                {step.event_name && <span className="text-indigo-600 ml-2 normal-case tracking-normal">— {step.event_name}</span>}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeEventStep(index)}
                                                className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <FaTimes size={12} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            {/* Event Name */}
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Event Name</label>
                                                <input
                                                    type="text"
                                                    value={step.event_name}
                                                    onChange={(e) => updateEventStep(index, 'event_name', e.target.value)}
                                                    placeholder="Install App"
                                                    className={`w-full bg-white border-2 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-gray-900 text-sm placeholder:text-gray-300 ${errors[`event_step_name_${index}`] ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
                                                />
                                                {errors[`event_step_name_${index}`] && (
                                                    <p className="text-red-500 text-[9px] font-black">{errors[`event_step_name_${index}`]}</p>
                                                )}
                                            </div>

                                            {/* Points */}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Points / Amount</label>
                                                <input
                                                    type="number"
                                                    value={step.points}
                                                    onChange={(e) => updateEventStep(index, 'points', e.target.value)}
                                                    placeholder="0"
                                                    className={`w-full bg-white border-2 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-indigo-600 text-sm placeholder:text-gray-300 ${errors[`event_step_points_${index}`] ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
                                                />
                                                {errors[`event_step_points_${index}`] && (
                                                    <p className="text-red-500 text-[9px] font-black">{errors[`event_step_points_${index}`]}</p>
                                                )}
                                            </div>

                                            {/* Currency removed - defaulting to cash */}
                                        </div>

                                        {/* Dynamic Bullets Instruction Management */}
                                        <div className="mt-6 space-y-3">
                                            <div className="flex items-center justify-between ml-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step Milestone Instructions</label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = step.description || '';
                                                        const newDesc = current ? `${current}\n• ` : '• ';
                                                        updateEventStep(index, 'description', newDesc);
                                                    }}
                                                    className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors flex items-center gap-1"
                                                >
                                                    <FaPlus size={8} /> Add Bullet
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {(step.description || '').split('\n').filter(line => line.trim()).map((bullet, bIndex) => (
                                                    <div key={bIndex} className="flex gap-3 group/bullet">
                                                        <div className="flex-1 relative">
                                                            <input
                                                                type="text"
                                                                value={bullet.startsWith('• ') ? bullet.substring(2) : bullet}
                                                                onChange={(e) => {
                                                                    const lines = (step.description || '').split('\n').filter(line => line.trim());
                                                                    lines[bIndex] = `• ${e.target.value}`;
                                                                    updateEventStep(index, 'description', lines.join('\n'));
                                                                }}
                                                                placeholder="Next instructional milestone..."
                                                                className="w-full bg-white border-2 border-gray-100 rounded-xl py-3 px-10 outline-none focus:border-indigo-500 transition-all font-medium text-gray-700 text-sm"
                                                            />
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">•</div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const lines = (step.description || '').split('\n').filter(line => line.trim());
                                                                lines.splice(bIndex, 1);
                                                                updateEventStep(index, 'description', lines.join('\n'));
                                                            }}
                                                            className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover/bullet:opacity-100"
                                                        >
                                                            <FaTimes size={10} />
                                                        </button>
                                                    </div>
                                                ))}

                                                {!(step.description || '').trim() && (
                                                    <div className="text-center py-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No detailed instructions added</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Summary */}
                                <div className="flex items-center justify-between bg-indigo-50 rounded-2xl p-5 mt-4">
                                    <div>
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{eventSteps.length} event step(s)</span>
                                        <p className="text-2xl font-black text-indigo-600 leading-tight mt-1">
                                            Total: ₹{totalFromEvents.toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addEventStep}
                                        className="bg-indigo-600 text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <FaPlus size={10} /> Add Another
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── Submit Buttons ──────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-indigo-600 text-white font-black py-5 px-8 rounded-[2rem] hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 tracking-widest text-xs"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>PROCEED WITH DEPLOYMENT</>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/manage-offers')}
                        className="px-10 py-5 bg-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest rounded-[2rem] hover:bg-gray-200 transition-all duration-300 active:scale-95"
                    >
                        ABORT MISSION
                    </button>
                </div>
            </form>
        </div>
    );
};

// ── Reusable Field Components ─────────────────────────────────────────────────

const InputField = ({ label, name, placeholder, value, onChange, error, type = 'text' }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-gray-300 font-bold text-gray-900 ${error ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
            value={value}
            onChange={onChange}
        />
        {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{error}</p>}
    </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">{label}</label>
        <div className="relative">
            <select
                name={name}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all appearance-none font-bold text-gray-900"
                value={value}
                onChange={onChange}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 font-black">↓</div>
        </div>
    </div>
);

const ColorPickerField = ({ label, name, value, onChange, error }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">{label}</label>
        <div className="flex gap-3">
            <div className="relative flex-1 group/color">
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900 placeholder:text-gray-400"
                    placeholder="#000000"
                />
                <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl border-2 border-white shadow-sm transition-transform group-hover/color:scale-110"
                    style={{ backgroundColor: value || '#000000' }}
                ></div>
            </div>
            <input
                type="color"
                value={value && value.startsWith('#') ? value : '#6366f1'}
                onChange={(e) => onChange({ target: { name, value: e.target.value.toUpperCase() } })}
                className="w-16 h-[60px] bg-gray-50 border-2 border-gray-100 rounded-2xl p-1 cursor-pointer outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            />
        </div>
        {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{error}</p>}
    </div>
);

export default AddOffer;
