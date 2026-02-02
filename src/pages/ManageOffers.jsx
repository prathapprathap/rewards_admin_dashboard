import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

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
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Offers</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {offer.image_url && (
                                <img
                                    src={offer.image_url}
                                    alt={offer.offer_name}
                                    className="w-full h-32 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2">{offer.offer_name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{offer.heading}</p>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-green-600 font-bold">₹{offer.amount}</span>
                                    <span className={`px-2 py-1 text-xs rounded ${offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {offer.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">{offer.description}</p>
                                <button
                                    onClick={() => handleDelete(offer.id)}
                                    className="w-full bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && offers.length === 0 && (
                <div className="text-center py-8 text-gray-500">No offers found</div>
            )}
        </div>
    );
};

export default ManageOffers;
