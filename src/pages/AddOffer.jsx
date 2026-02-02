import { useState } from 'react';
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
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

        try {
            await createOffer(formData);
            alert('Offer created successfully!');
            navigate('/'); // Redirect to dashboard
        } catch (error) {
            console.error('Error creating offer:', error);
            alert('Failed to create offer');
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 uppercase">Add Offer</h1>
            <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-md space-y-4">

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Name:</label>
                    <input
                        type="text" name="offer_name" placeholder="Enter Offer Name"
                        className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${errors.offer_name ? 'border-red-500' : ''}`}
                        value={formData.offer_name} onChange={handleChange}
                    />
                    {errors.offer_name && <p className="text-red-500 text-sm mt-1">{errors.offer_name}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Offer Id:</label>
                    <input
                        type="text" name="offer_id" placeholder="Enter Offer Id"
                        className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${errors.offer_id ? 'border-red-500' : ''}`}
                        value={formData.offer_id} onChange={handleChange}
                    />
                    {errors.offer_id && <p className="text-red-500 text-sm mt-1">{errors.offer_id}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Heading:</label>
                    <input
                        type="text" name="heading" placeholder="Enter Heading"
                        className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${errors.heading ? 'border-red-500' : ''}`}
                        value={formData.heading} onChange={handleChange}
                    />
                    {errors.heading && <p className="text-red-500 text-sm mt-1">{errors.heading}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">History Name:</label>
                    <input
                        type="text" name="history_name" placeholder="Enter History Name"
                        className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        value={formData.history_name} onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Offer Url:</label>
                    <input
                        type="text" name="offer_url" placeholder="Enter Offer Url"
                        className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${errors.offer_url ? 'border-red-500' : ''}`}
                        value={formData.offer_url} onChange={handleChange}
                    />
                    {errors.offer_url && <p className="text-red-500 text-sm mt-1">{errors.offer_url}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Amount:</label>
                    <input
                        type="number" name="amount" placeholder="Enter Amount in INR"
                        className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${errors.amount ? 'border-red-500' : ''}`}
                        value={formData.amount} onChange={handleChange}
                    />
                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Event:</label>
                    <input
                        type="text" name="event_name" placeholder="Enter Event"
                        className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${errors.event_name ? 'border-red-500' : ''}`}
                        value={formData.event_name} onChange={handleChange}
                    />
                    {errors.event_name && <p className="text-red-500 text-sm mt-1">{errors.event_name}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Description:</label>
                    <textarea
                        name="description" placeholder="Enter Description" rows="4"
                        className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${errors.description ? 'border-red-500' : ''}`}
                        value={formData.description} onChange={handleChange}
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Image icon:</label>
                    <input
                        type="text" name="image_url" placeholder="Enter Image icon URL"
                        className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${errors.image_url ? 'border-red-500' : ''}`}
                        value={formData.image_url} onChange={handleChange}
                    />
                    {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Refer Payout:</label>
                    <select
                        name="refer_payout"
                        className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        value={formData.refer_payout} onChange={handleChange}
                    >
                        <option value="1st Event">1st Event</option>
                        <option value="2nd Event">2nd Event</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Status:</label>
                    <select
                        name="status"
                        className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        value={formData.status} onChange={handleChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                    Save
                </button>

            </form>
        </div>
    );
};

export default AddOffer;
