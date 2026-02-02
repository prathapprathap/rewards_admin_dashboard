import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaTrashAlt, FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { deleteUser, getUsers } from '../api';

const AccountDelete = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId, name) => {
        const result = await Swal.fire({
            title: 'CRITICAL WARNING!',
            text: `Are you sure you want to PERMANENTLY delete account "${name}"? This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, DELETE it!',
            cancelButtonText: 'Cancel',
            background: '#fff',
            customClass: {
                title: 'text-red-600 font-bold',
                confirmButton: 'bg-red-600 hover:bg-red-700'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(userId);
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Account has been removed permanently.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete account. Please try again.',
                    icon: 'error'
                });
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <FaTrashAlt className="text-red-600" />
                    Account Management
                </h2>
                <p className="text-gray-600">Permanently delete user accounts and data</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm">
                <div className="flex items-center">
                    <FaExclamationTriangle className="text-red-500 mr-3" size={24} />
                    <p className="text-red-800 font-medium text-sm">
                        Warning: Deleting an account is permanent and will remove all user earnings, history, and referral data.
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-red-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-red-700 uppercase">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-red-700 uppercase">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-red-700 uppercase">Joined</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-red-700 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-red-50/20 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id, user.name)}
                                            className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 ml-auto"
                                        >
                                            <FaTrashAlt /> DELETE ACCOUNT
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-400">No users found matching your search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountDelete;
