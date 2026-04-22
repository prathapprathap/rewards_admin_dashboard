import { useEffect, useState } from 'react';
import { FaSearch, FaTrashAlt, FaUndo } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { getDeleteRequests, updateDeleteRequestStatus } from '../api';

const AccountDelete = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getDeleteRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching delete requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, status, email) => {
        const actionText = status === 'DELETED' ? 'permanently DELETE' : 'CANCEL deactivation for';
        const result = await Swal.fire({
            title: 'Confirm Action',
            text: `Are you sure you want to ${actionText} ${email}?`,
            icon: status === 'DELETED' ? 'warning' : 'info',
            showCancelButton: true,
            confirmButtonColor: status === 'DELETED' ? '#d33' : '#3085d6',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Yes, proceed!'
        });

        if (result.isConfirmed) {
            try {
                await updateDeleteRequestStatus(requestId, status);
                Swal.fire('Success', `Request updated to ${status}`, 'success');
                fetchRequests();
            } catch (error) {
                console.error('Error updating request:', error);
                Swal.fire('Error', 'Failed to update request', 'error');
            }
        }
    };

    const filteredRequests = requests.filter(req =>
        req.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Loading Requests...</div>;

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">ACCOUNT DELETE REQUESTS</h1>
                <p className="text-gray-500 text-sm">Review and process user account deactivation requests</p>
            </div>

            <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search by Email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">No.</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Balance</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Note</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRequests.map((req, index) => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{req.email}</td>
                                    <td className="px-6 py-4 text-sm font-black text-indigo-600">₹{req.balance}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500 max-w-[200px] truncate">{req.note}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {new Date(req.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleAction(req.id, 'CANCELLED', req.email)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                                        >
                                            <FaUndo size={10} /> CANCEL
                                        </button>
                                        <button
                                            onClick={() => handleAction(req.id, 'DELETED', req.email)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                                        >
                                            <FaTrashAlt size={10} /> DELETE
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredRequests.length === 0 && (
                        <div className="py-20 text-center text-gray-400">
                            No pending delete requests found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountDelete;
