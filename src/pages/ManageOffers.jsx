import { useEffect, useState } from 'react';
import { FaTasks, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { deleteOffer, getOffers } from '../api';

const ManageOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        </div>
    );
};

export default ManageOffers;
