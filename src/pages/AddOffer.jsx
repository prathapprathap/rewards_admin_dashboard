import { useState } from 'react';
import { FaPlusCircle, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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
        } else if (!/^https?:\/\//.test(formData.offer_url)) {
            tempErrors.offer_url = "URL must start with http:// or https://";
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
        } else if (!/^https?:\/\//.test(formData.image_url)) {
            tempErrors.image_url = "URL must start with http:// or https://";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await createOffer(formData);
            navigate('/manage-offers'); // Redirect to manage offers
        } catch (error) {
            console.error('Error creating offer:', error);
            alert('Failed to create offer');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                    <FaPlusCircle className="text-indigo-600" />
                    Create New Offer
                </h2>
                <p className="text-gray-600">Add a new task/offer for users to complete</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 max-w-5xl border border-gray-200">
                {/* Form Grid - 2 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Offer Name */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Offer Name *</label>
                        <input
                            type="text"
                            name="offer_name"
                            placeholder="e.g., Welcome Bonus"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${errors.offer_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.offer_name}
                            onChange={handleChange}
                        />
                        {errors.offer_name && <p className="text-red-500 text-xs mt-1">{errors.offer_name}</p>}
                    </div>

                    {/* Offer ID */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Offer ID *</label>
                        <input
                            type="text"
                            name="offer_id"
                            placeholder="e.g., WELCOME100"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${errors.offer_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.offer_id}
                            onChange={handleChange}
                        />
                        {errors.offer_id && <p className="text-red-500 text-xs mt-1">{errors.offer_id}</p>}
                    </div>

                    {/* Heading */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Heading *</label>
                        <input
                            type="text"
                            name="heading"
                            placeholder="e.g., Get ₹100 Bonus"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${errors.heading ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.heading}
                            onChange={handleChange}
                        />
                        {errors.heading && <p className="text-red-500 text-xs mt-1">{errors.heading}</p>}
                    </div>

                    {/* History Name */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">History Name</label>
                        <input
                            type="text"
                            name="history_name"
                            placeholder="e.g., Signup Offer"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                            value={formData.history_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Offer URL */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Offer URL *</label>
                        <input
                            type="text"
                            name="offer_url"
                            placeholder="https://example.com/offer"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${errors.offer_url ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.offer_url}
                            onChange={handleChange}
                        />
                        {errors.offer_url && <p className="text-red-500 text-xs mt-1">{errors.offer_url}</p>}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Amount (₹) *</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="100"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${errors.amount ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.amount}
                            onChange={handleChange}
                        />
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                    </div>

                    {/* Event */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Event *</label>
                        <input
                            type="text"
                            name="event_name"
                            placeholder="e.g., First Purchase"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${errors.event_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.event_name}
                            onChange={handleChange}
                        />
                        {errors.event_name && <p className="text-red-500 text-xs mt-1">{errors.event_name}</p>}
                    </div>

                    {/* Image icon */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Image icon *</label>
                        <input
                            type="text"
                            name="image_url"
                            placeholder="https://example.com/image.jpg"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${errors.image_url ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.image_url}
                            onChange={handleChange}
                        />
                        {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url}</p>}
                    </div>

                    {/* Refer Payout */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Refer Payout</label>
                        <select
                            name="refer_payout"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white"
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
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Status</label>
                        <select
                            name="status"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Description - Full Width */}
                <div className="mt-6">
                    <label className="block text-gray-700 font-bold mb-2 text-sm">Description *</label>
                    <textarea
                        name="description"
                        placeholder="Enter detailed description of the offer..."
                        rows="4"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Buttons */}
                <div className="mt-8 flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaSave /> {isSubmitting ? 'Creating...' : 'Create Offer'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/manage-offers')}
                        className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center gap-2"
                    >
                        <FaTimes /> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddOffer;
