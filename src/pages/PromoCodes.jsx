import { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { createPromoCode, deletePromoCode, getPromoCodes, updatePromoCode } from '../api';

const PromoCodes = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editPromo, setEditPromo] = useState(null);
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

    const handleEditClick = (promo) => {
        setEditPromo(promo);
        setFormData({
            code: promo.code,
            amount: promo.amount,
            users_limit: promo.users_limit,
            for_whom: promo.for_whom || 'All',
            status: promo.status || 'Active'
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updatePromoCode(editPromo.id, formData);
            setEditPromo(null);
            setFormData({ code: '', amount: '', users_limit: '', for_whom: 'All', status: 'Active' });
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Promo code updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
            fetchPromoCodes();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update promo code.',
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
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 font-sans">
            {/* Header section with Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-1">Campaign Management</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">VOUCHER <span className="text-indigo-600">PORTAL</span></h1>
                </div>
                <button
                    onClick={() => {
                        setEditPromo(null);
                        setFormData({ code: '', amount: '', users_limit: '', for_whom: 'All', status: 'Active' });
                        setShowForm(true);
                    }}
                    className="bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest px-8 py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                    INITIALIZE NEW TOKEN
                </button>
            </div>

            {(showForm || editPromo) && (
                <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
                        <div className="bg-indigo-900 p-8 text-white relative overflow-hidden">
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black tracking-tight uppercase leading-none">{editPromo ? 'Modify Token' : 'Token Config'}</h3>
                                    <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{editPromo ? 'Adjust Parameters' : 'New Entry Parameters'}</p>
                                </div>
                                <button onClick={() => { setShowForm(false); setEditPromo(null); }} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <FaTimes size={18} />
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[40px]"></div>
                        </div>

                        <form onSubmit={editPromo ? handleUpdate : handleCreate} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Promocode Node</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. MEGA2024"
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900 placeholder:text-gray-300"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Value (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0.00"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-indigo-600"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Limit</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Max users"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900"
                                        value={formData.users_limit}
                                        onChange={(e) => setFormData({ ...formData, users_limit: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Token Status</label>
                                <select
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-black text-gray-900"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">ACTIVE</option>
                                    <option value="Inactive">INACTIVE</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-[10px] tracking-widest uppercase">
                                {editPromo ? 'AUTHORIZE UPDATE' : 'DEPLOY TOKEN NODE'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-indigo-900">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Key ID</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Token Node</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Credit value</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Usage Meta</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Protocols</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {promoCodes.map((promo, index) => (
                                <tr key={promo.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-6 text-sm font-black text-gray-300 group-hover:text-indigo-600 transition-colors">
                                        #{String(index + 1).padStart(3, '0')}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="bg-gray-50 px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl inline-block group-hover:border-indigo-300 group-hover:bg-indigo-50 transition-all">
                                            <p className="text-sm font-black text-gray-900 tracking-widest font-mono uppercase">{promo.code}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs font-black text-indigo-600 tracking-tighter">₹</span>
                                            <span className="text-xl font-black text-indigo-600 tracking-tighter">{promo.amount}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-indigo-100">
                                                {promo.claimed_count || 0} / {promo.users_limit} Claims
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${promo.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                            {promo.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEditClick(promo)}
                                                className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {promoCodes.length === 0 && (
                    <div className="text-center py-20 bg-gray-50/50">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6 shadow-sm">
                            <FaTrash size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Tokens</h3>
                        <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium">Your campaign inventory is empty. Launch your first reward voucher to see records here.</p>
                    </div>
                )}
            </div>

            <div className="text-center pt-10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    &copy; {new Date().getFullYear()} REWARDMOBI SECURE SYSTEMS
                </p>
            </div>
        </div>
    );
};

export default PromoCodes;
