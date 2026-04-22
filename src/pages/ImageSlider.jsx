import { useEffect, useState } from 'react';
import { FaEdit, FaImage, FaPlus, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { createBanner, deleteBanner, getBanners, updateBanner } from '../api';

const ImageSlider = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image_url: '',
        action_type: 'WEB_VIEW',
        action_value: '',
        status: 'Active'
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const data = await getBanners();
            setBanners(data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title || '',
                subtitle: banner.subtitle || '',
                image_url: banner.image_url || '',
                action_type: banner.action_type || 'WEB_VIEW',
                action_value: banner.action_value || '',
                status: banner.status || 'Active'
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                subtitle: '',
                image_url: '',
                action_type: 'WEB_VIEW',
                action_value: '',
                status: 'Active'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBanner) {
                await updateBanner(editingBanner.id, formData);
                Swal.fire('Success', 'Banner updated successfully', 'success');
            } else {
                await createBanner(formData);
                Swal.fire('Success', 'Banner created successfully', 'success');
            }
            setIsModalOpen(false);
            fetchBanners();
        } catch (error) {
            console.error('Error saving banner:', error);
            Swal.fire('Error', 'Failed to save banner', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteBanner(id);
                Swal.fire('Deleted!', 'Banner has been deleted.', 'success');
                fetchBanners();
            } catch (error) {
                console.error('Error deleting banner:', error);
                Swal.fire('Error', 'Failed to delete banner', 'error');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">SLIDERS</h1>
                    <p className="text-gray-500 text-sm">Manage Home Screen Image Carousel</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                    <FaPlus size={14} />
                    Add Slider
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Id</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Url / Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500">{banner.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="w-20 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                            <img
                                                src={banner.image_url}
                                                alt={banner.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = 'https://placehold.co/400x200?text=No+Image'}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800">{banner.title}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{banner.subtitle}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-mono text-gray-500 truncate max-w-[250px]">{banner.action_value}</p>
                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold">{banner.action_type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${banner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {banner.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(banner)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {banners.length === 0 && (
                    <div className="py-20 text-center">
                        <FaImage className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-400">No sliders found. Click "Add Slider" to create one.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">{editingBanner ? 'Edit Slider' : 'Add New Slider'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Banner Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                        placeholder="Enter title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subtitle (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                        placeholder="Enter secondary text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Image URL</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                        placeholder="https://..."
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Action Type</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                        value={formData.action_type}
                                        onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                                    >
                                        <option value="WEB_VIEW">External URL</option>
                                        <option value="NAVIGATE">In-App Screen</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Action Value (URL or Screen Name)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-mono"
                                        placeholder={formData.action_type === 'WEB_VIEW' ? 'https://google.com' : 'REFER_EARN'}
                                        value={formData.action_value}
                                        onChange={(e) => setFormData({ ...formData, action_value: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    {editingBanner ? 'Update Slider' : 'Create Slider'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageSlider;
