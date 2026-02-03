import { useEffect, useState } from 'react';
import { FaEdit, FaTasks, FaTimes, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { deleteOffer, getOffers, updateOffer } from '../api';

const ManageOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editOffer, setEditOffer] = useState(null);
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
        refer_payout: '',
        status: 'Active'
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const data = await getOffers();
            setOffers(data);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to fetch offers!',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (offer) => {
        setEditOffer(offer);
        setFormData({
            offer_name: offer.offer_name || '',
            offer_id: offer.offer_id || '',
            heading: offer.heading || '',
            history_name: offer.history_name || '',
            offer_url: offer.offer_url || '',
            amount: offer.amount || '',
            event_name: offer.event_name || '',
            description: offer.description || '',
            image_url: offer.image_url || '',
            refer_payout: offer.refer_payout || 0,
            status: offer.status || 'Active'
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateOffer(editOffer.id, formData);
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Offer updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
            setEditOffer(null);
            fetchOffers();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update offer.';
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: errorMsg,
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Offer?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteOffer(id);
                Swal.fire(
                    'Deleted!',
                    'Offer has been deleted.',
                    'success'
                );
                fetchOffers();
            } catch (err) {
                console.error('Delete error:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to delete offer.',
                });
            }
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
            {/* Header section with Action */}
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
                                    <img
                                        src={offer.image_url}
                                        alt={offer.offer_name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <FaTasks size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
                                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md ${offer.status?.toLowerCase() === 'active'
                                        ? 'bg-emerald-500/90 text-white'
                                        : 'bg-orange-500/90 text-white'
                                        }`}>
                                        {offer.status || 'Active'}
                                    </span>
                                </div>

                                <div className="absolute bottom-4 left-6 right-6">
                                    <h3 className="text-lg font-black text-white leading-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">{offer.offer_name}</h3>
                                    <p className="text-white/70 text-xs font-bold uppercase tracking-wider mt-1">{offer.heading}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[2.5rem] font-medium italic">
                                    "{offer.description}"
                                </p>

                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">User Reward</p>
                                        <p className="text-3xl font-black text-indigo-600 tracking-tighter">₹{offer.amount}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Status Code</p>
                                        <p className="text-xs font-bold text-gray-900">#OFFER_{offer.id}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleEditClick(offer)}
                                        className="flex-1 bg-indigo-50 text-indigo-600 font-black text-xs uppercase tracking-widest py-4 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <FaEdit size={12} /> EDIT NODE
                                    </button>
                                    <button
                                        onClick={() => handleDelete(offer.id)}
                                        className="flex-1 bg-red-50 text-red-600 font-black text-xs uppercase tracking-widest py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <FaTrash size={12} /> REMOVE NODE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editOffer && (
                <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20 max-h-[90vh] flex flex-col">
                        <div className="bg-indigo-900 p-8 text-white relative overflow-hidden flex-shrink-0">
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black tracking-tight uppercase leading-none">Modify Offer Node</h3>
                                    <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Adjust existing parameters</p>
                                </div>
                                <button onClick={() => setEditOffer(null)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <FaTimes size={18} />
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[40px]"></div>
                        </div>

                        <form onSubmit={handleUpdate} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Form Fields */}
                                {[
                                    { id: 'offer_name', label: 'Offer Identity', placeholder: 'e.g. Premium Access', type: 'text' },
                                    { id: 'offer_id', label: 'Internal UID', placeholder: 'e.g. OFFER_X_101', type: 'text' },
                                    { id: 'heading', label: 'Call to Action', placeholder: 'e.g. INSTALL & REGISTER', type: 'text' },
                                    { id: 'history_name', label: 'Ledger Label', placeholder: 'e.g. Signup Completion', type: 'text' },
                                    { id: 'offer_url', label: 'Target URI', placeholder: 'https://...', type: 'text' },
                                    { id: 'image_url', label: 'Asset URI (Image)', placeholder: 'https://...', type: 'text' },
                                    { id: 'amount', label: 'Credit Value (₹)', placeholder: '0.00', type: 'number' },
                                    { id: 'refer_payout', label: 'Referral Bonus (₹)', placeholder: '0.00', type: 'number' },
                                    { id: 'event_name', label: 'Tracking Event', placeholder: 'e.g. registration', type: 'text' },
                                ].map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{field.label}</label>
                                        <input
                                            type={field.type}
                                            required
                                            value={formData[field.id]}
                                            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900 placeholder:text-gray-300"
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}

                                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Mission Briefing (Description)</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none"
                                        placeholder="Detailed instructions for the user..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Deployment Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900 appearance-none"
                                    >
                                        <option value="Active">ACTIVE</option>
                                        <option value="Inactive">INACTIVE</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-4 pb-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-[10px] tracking-widest uppercase"
                                >
                                    AUTHORIZE ADJUSTMENTS
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditOffer(null)}
                                    className="px-10 py-5 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all duration-300 active:scale-95"
                                >
                                    ABORT MISSION
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOffers;
