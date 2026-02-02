import { useState } from 'react';
import { FaGift, FaPlus, FaTrash } from 'react-icons/fa';

const PromoCodes = () => {
    const [promoCodes, setPromoCodes] = useState([
        { id: 1, code: 'WELCOME100', discount: 100, type: 'Fixed', expires: '2026-12-31', active: true },
        { id: 2, code: 'SAVE50', discount: 50, type: 'Percentage', expires: '2026-06-30', active: true },
    ]);
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="p-8 min-h-screen">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <FaGift className="text-purple-600" />
                        Promo Codes
                    </h2>
                    <p className="text-gray-600">Manage promotional discount codes</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md flex items-center gap-2"
                >
                    <FaPlus /> Add Promo Code
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Create New Promo Code</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Code (e.g., SUMMER2026)" className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
                        <input type="number" placeholder="Discount Amount" className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
                        <select className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none">
                            <option>Fixed Amount</option>
                            <option>Percentage</option>
                        </select>
                        <input type="date" className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Save</button>
                        <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Code</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Discount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Expires</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {promoCodes.map((promo) => (
                            <tr key={promo.id} className="hover:bg-purple-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-purple-600">{promo.code}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">{promo.discount}{promo.type === 'Percentage' ? '%' : '₹'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{promo.type}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{promo.expires}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {promo.active ? 'Active' : 'Expired'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-red-600 hover:text-red-800"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PromoCodes;
