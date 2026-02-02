import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaTasks } from 'react-icons/fa';

const API_URL = 'https://rewards-backend-zkhh.onrender.com/api/admin';

const ActiveOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActiveOffers();
    }, []);

    const fetchActiveOffers = async () => {
        try {
            const response = await axios.get(`${API_URL}/offers`);
            // Filter only active offers
            const activeOffers = response.data.filter(offer => offer.status.toLowerCase() === 'active');
            setOffers(activeOffers);
        } catch (error) {
            console.error('Error fetching active offers:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <FaCheckCircle className="text-green-600" />
                    Active Offers
                </h2>
                <p className="text-gray-600">Currently active offers available to users</p>
            </div>

            {offers.length === 0 ? (
                <div className="text-center py-20">
                    <FaTasks size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No active offers found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-200">
                            {offer.image_url && (
                                <div className="relative h-40 overflow-hidden">
                                    <img src={offer.image_url} alt={offer.offer_name} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2">
                                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-500 text-white shadow-lg">
                                            ACTIVE
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-800 mb-2">{offer.offer_name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{offer.heading}</p>
                                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{offer.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-indigo-600">₹{offer.amount}</span>
                                    <span className="text-xs text-gray-500">{offer.event_name}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveOffers;
