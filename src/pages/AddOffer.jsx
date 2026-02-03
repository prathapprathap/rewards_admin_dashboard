import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createOffer } from '../api';

const AddOffer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        offer_name: '',
        offer_id: '',
        heading: '',
        history_name: '',
        offer_url: '',
        amount: '',
        event_name: '',
        description: '',
        image_url: '',
        refer_payout: '1st Event',
        status: 'Active'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.offer_name.trim()) tempErrors.offer_name = "Offer Name is required";
        if (!formData.offer_id.trim()) tempErrors.offer_id = "Offer ID is required";
        if (!formData.heading.trim()) tempErrors.heading = "Heading is required";
        if (!formData.offer_url.trim()) {
            tempErrors.offer_url = "Offer URL is required";
        }
        if (!formData.amount) {
            tempErrors.amount = "Amount is required";
        } else if (isNaN(formData.amount) || Number(formData.amount) < 0) {
            tempErrors.amount = "Amount must be a valid positive number";
        }
        if (!formData.event_name.trim()) tempErrors.event_name = "Event is required";
        if (!formData.description.trim()) tempErrors.description = "Description is required";
        if (!formData.image_url.trim()) {
            tempErrors.image_url = "Image URL is required";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

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
            // Auto-prepend https:// if protocol is missing
            const processedData = {
                ...formData,
                offer_url: formData.offer_url.trim().startsWith('http') ? formData.offer_url.trim() : `https://${formData.offer_url.trim()}`,
                image_url: formData.image_url.trim().startsWith('http') ? formData.image_url.trim() : `https://${formData.image_url.trim()}`
            };
            await createOffer(processedData);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Offer created successfully.',
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

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 font-sans">
            {/* Header section with Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">Content Creation</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">DEPLOY <span className="text-indigo-600">OFFER</span></h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black tracking-tight mb-1 uppercase">Node Configuration</h3>
                            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Global Parameters</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px]"></div>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

                            {/* Offer Name */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Offer Identity</label>
                                <input
                                    type="text"
                                    name="offer_name"
                                    placeholder="Enter premium name"
                                    className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-gray-300 font-bold text-gray-900 ${errors.offer_name ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
                                    value={formData.offer_name}
                                    onChange={handleChange}
                                />
                                {errors.offer_name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.offer_name}</p>}
                            </div>

                            {/* Offer ID */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">System ID</label>
                                <input
                                    type="text"
                                    name="offer_id"
                                    placeholder="Unique identifier"
                                    className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-gray-300 font-bold text-gray-900 ${errors.offer_id ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
                                    value={formData.offer_id}
                                    onChange={handleChange}
                                />
                                {errors.offer_id && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.offer_id}</p>}
                            </div>

                            {/* Heading */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Public Heading</label>
                                <input
                                    type="text"
                                    name="heading"
                                    placeholder="Attractive title"
                                    className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-gray-300 font-bold text-gray-900 ${errors.heading ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
                                    value={formData.heading}
                                    onChange={handleChange}
                                />
                                {errors.heading && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.heading}</p>}
                            </div>

                            {/* History Name */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Ledger Name</label>
                                <input
                                    type="text"
                                    name="history_name"
                                    placeholder="Internal tracking title"
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-gray-300 font-bold text-gray-900"
                                    value={formData.history_name}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Offer URL */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Target URI</label>
                                <input
                                    type="text"
                                    name="offer_url"
                                    placeholder="Destination protocol"
                                    className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-gray-300 font-bold text-gray-900 ${errors.offer_url ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
                                    value={formData.offer_url}
                                    onChange={handleChange}
                                />
                                {errors.offer_url && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.offer_url}</p>}
                            </div>

                            {/* Amount */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Value Capture (₹)</label>
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

                            {/* Event */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Conversion Node</label>
                                <input
                                    type="text"
                                    name="event_name"
                                    placeholder="Trigger event"
                                    className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-gray-300 font-bold text-gray-900 ${errors.event_name ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
                                    value={formData.event_name}
                                    onChange={handleChange}
                                />
                                {errors.event_name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.event_name}</p>}
                            </div>

                            {/* Image icon */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Icon Asset URI</label>
                                <input
                                    type="text"
                                    name="image_url"
                                    placeholder="Asset CDN link"
                                    className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-gray-300 font-bold text-gray-900 ${errors.image_url ? 'border-red-500/50' : 'border-gray-100 focus:border-indigo-500'}`}
                                    value={formData.image_url}
                                    onChange={handleChange}
                                />
                                {errors.image_url && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.image_url}</p>}
                            </div>

                            {/* Refer Payout */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Referral Protocol</label>
                                <div className="relative">
                                    <select
                                        name="refer_payout"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all appearance-none font-bold text-gray-900"
                                        value={formData.refer_payout}
                                        onChange={handleChange}
                                    >
                                        <option value="1st Event">1st Event</option>
                                        <option value="2nd Event">2nd Event</option>
                                        <option value="3rd Event">3rd Event</option>
                                        <option value="4th Event">4th Event</option>
                                        <option value="All Event">All Event</option>
                                        <option value="Reffer Pause">Reffer Pause</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 font-black">↓</div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Deployment Status</label>
                                <div className="relative">
                                    <select
                                        name="status"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all appearance-none font-bold text-gray-900"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Active">Active Mode</option>
                                        <option value="Inactive">Standby Mode</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 font-black">↓</div>
                                </div>
                            </div>
                        </div>

                        {/* Description - Full Width */}
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

                {/* Final Actions */}
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

export default AddOffer;
