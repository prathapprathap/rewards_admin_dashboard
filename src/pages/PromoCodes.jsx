import { useEffect, useState } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { createPromoCode, deletePromoCode, getPromoCodes } from '../api';

const PromoCodes = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        amount: '',
        users_limit: '',
        for_whom: 'All',
        status: 'Active'
    });

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const data = await getPromoCodes();
            setPromoCodes(data);
        } catch (error) {
            console.error('Error fetching promocodes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createPromoCode(formData);
            setShowForm(false);
            setFormData({ code: '', amount: '', users_limit: '', for_whom: 'All', status: 'Active' });
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Promo code created successfully.',
                timer: 2000,
                showConfirmButton: false
            });
            fetchPromoCodes();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to create promo code.';
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: errorMsg,
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Promo Code?',
            text: "This removal is permanent!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deletePromoCode(id);
                Swal.fire(
                    'Deleted!',
                    'Promo code has been deleted.',
                    'success'
                );
                fetchPromoCodes();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to delete promo code.',
                });
            }
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
                <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-tight">Promocode</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all font-bold text-lg"
                >
                    Add New Promocode
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-800">Add New Promocode</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Promocode</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Please Enter Promocode"
                                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="Please Provide Positive Amount"
                                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">For Total Users</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="Please Provide Positive Limit"
                                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.users_limit}
                                    onChange={(e) => setFormData({ ...formData, users_limit: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">For Whom</label>
                                <select
                                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                                    value={formData.for_whom}
                                    onChange={(e) => setFormData({ ...formData, for_whom: e.target.value })}
                                >
                                    <option value="All">All</option>
                                    <option value="New">New</option>
                                    <option value="Old">Old</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Status</label>
                                <select
                                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-500 text-white py-3 rounded-md font-bold hover:bg-gray-600 transition-all">Close</button>
                                <button type="submit" className="flex-1 bg-blue-500 text-white py-3 rounded-md font-bold hover:bg-blue-600 transition-all">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b text-gray-700">
                                <th className="px-4 py-4 font-bold border">No.</th>
                                <th className="px-4 py-4 font-bold border">Code</th>
                                <th className="px-4 py-4 font-bold border">Amount</th>
                                <th className="px-4 py-4 font-bold border">Claimed User</th>
                                <th className="px-4 py-4 font-bold border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promoCodes.map((promo, index) => (
                                <tr key={promo.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-4 border">{index + 1}</td>
                                    <td className="px-4 py-4 border font-medium">{promo.code}</td>
                                    <td className="px-4 py-4 border text-gray-800 font-bold">₹{promo.amount}</td>
                                    <td className="px-4 py-4 border">{promo.claimed_count || 0}</td>
                                    <td className="px-4 py-4 border">
                                        <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-700">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="mt-8 text-center text-gray-500 text-sm">Copyright © RewardMobi All right reserved.</p>
        </div>
    );
};

export default PromoCodes;
