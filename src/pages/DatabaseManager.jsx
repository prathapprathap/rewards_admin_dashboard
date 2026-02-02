import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { createRecord, deleteRecord, getTableData, getTables, getTableStructure, updateRecord } from '../api';

const DatabaseManager = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [tableStructure, setTableStructure] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchTables();
    }, []);

    useEffect(() => {
        if (selectedTable) {
            fetchTableStructure();
            fetchTableData();
        }
    }, [selectedTable, pagination.page]);

    const fetchTables = async () => {
        try {
            const data = await getTables();
            setTables(data);
        } catch (err) {
            setError('Failed to fetch tables');
        }
    };

    const fetchTableStructure = async () => {
        try {
            const structure = await getTableStructure(selectedTable);
            setTableStructure(structure);
        } catch (err) {
            setError('Failed to fetch table structure');
        }
    };

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const result = await getTableData(selectedTable, pagination.page, pagination.limit);
            setTableData(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError('Failed to fetch table data');
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (e) => {
        setSelectedTable(e.target.value);
        setPagination({ ...pagination, page: 1 });
        setShowForm(false);
        setEditingRecord(null);
    };

    const handleAdd = () => {
        const initialData = {};
        tableStructure.forEach(col => {
            if (col.Field !== 'id' && col.Field !== 'created_at' && col.Field !== 'updated_at') {
                initialData[col.Field] = '';
            }
        });
        setFormData(initialData);
        setEditingRecord(null);
        setShowForm(true);
    };

    const handleEdit = (record) => {
        const editData = { ...record };
        delete editData.id;
        delete editData.created_at;
        delete editData.updated_at;
        setFormData(editData);
        setEditingRecord(record);
        setShowForm(true);
    };

    const handleDelete = async (record) => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        try {
            await deleteRecord(selectedTable, record.id);
            fetchTableData();
        } catch (err) {
            setError('Failed to delete record');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await updateRecord(selectedTable, editingRecord.id, formData);
            } else {
                await createRecord(selectedTable, formData);
            }
            setShowForm(false);
            setFormData({});
            setEditingRecord(null);
            fetchTableData();
        } catch (err) {
            setError('Failed to save record');
        }
    };

    const handleFormChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Database Manager</h2>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <div className="mb-4 flex gap-4">
                <select
                    value={selectedTable}
                    onChange={handleTableChange}
                    className="border rounded px-4 py-2 outline-none focus:border-blue-500"
                >
                    <option value="">Select a table</option>
                    {tables.map(table => (
                        <option key={table} value={table}>{table}</option>
                    ))}
                </select>

                {selectedTable && (
                    <button
                        onClick={handleAdd}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <FaPlus /> Add Record
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow-md mb-6">
                    <h3 className="text-xl font-bold mb-4">{editingRecord ? 'Edit Record' : 'Add Record'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.keys(formData).map(field => (
                                <div key={field}>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">{field}</label>
                                    <input
                                        type="text"
                                        value={formData[field]}
                                        onChange={(e) => handleFormChange(field, e.target.value)}
                                        className="w-full border rounded px-3 py-2 outline-none focus:border-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                {editingRecord ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingRecord(null);
                                    setFormData({});
                                }}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && <div className="text-center py-8">Loading...</div>}

            {!loading && selectedTable && tableData.length > 0 && (
                <div className="bg-white rounded shadow-md overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                {tableStructure.map(col => (
                                    <th key={col.Field} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        {col.Field}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((record, idx) => (
                                <tr key={idx} className="border-t hover:bg-gray-50">
                                    {tableStructure.map(col => (
                                        <td key={col.Field} className="px-4 py-3 text-sm text-gray-700">
                                            {String(record[col.Field] || '')}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-sm flex gap-2">
                                        <button
                                            onClick={() => handleEdit(record)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(record)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total records)
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!loading && selectedTable && tableData.length === 0 && (
                <div className="text-center py-8 text-gray-500">No records found</div>
            )}
        </div>
    );
};

export default DatabaseManager;
