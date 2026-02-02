import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaTasks, FaTrash } from 'react-icons/fa';

const API_URL = 'https://rewards-backend-zkhh.onrender.com/api/admin';

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
            const response = await axios.get(`${API_URL}/offers`);
            setOffers(response.data);
        } catch (err) {
            setError('Failed to fetch offers');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;

        try {
            await axios.delete(`${API_URL}/offers/${id}`);
            fetchOffers();
        } catch (err) {
            setError('Failed to delete offer');
        }
    };

    return (
        <div className="p-8 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Offers</h2>
                <p className="text-gray-600">View and manage all active offers</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
                            {offer.image_url && (
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={offer.image_url}
                                        alt={offer.offer_name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{offer.offer_name}</h3>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${offer.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {offer.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 font-medium">{offer.heading}</p>
                                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{offer.description}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <span className="text-2xl font-bold text-indigo-600">₹{offer.amount}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(offer.id)}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                                >
                                    <FaTrash /> Delete Offer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && offers.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-gray-400 mb-4">
                        <FaTasks size={64} className="mx-auto" />
                    </div>
                    <p className="text-gray-500 text-lg">No offers found</p>
                    <p className="text-gray-400 text-sm mt-2">Create your first offer to get started</p>
                </div>
            )}
        </div>
    );
};

export default ManageOffers;
