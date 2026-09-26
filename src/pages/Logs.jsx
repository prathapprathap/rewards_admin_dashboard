import { useCallback, useEffect, useState } from 'react';
import { FaDownload, FaSearch, FaSync, FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { deleteAllLogFiles, deleteLogFile, downloadLogFile, getLogFiles, getLogLines } from '../api';

const LEVELS = ['', 'REQ', 'RES', 'LOG', 'INFO', 'WARN', 'ERROR', 'FATAL'];

const LEVEL_STYLES = {
    REQ: 'bg-blue-100 text-blue-700',
    RES: 'bg-green-100 text-green-700',
    WARN: 'bg-yellow-100 text-yellow-800',
    ERROR: 'bg-red-100 text-red-700',
    FATAL: 'bg-red-600 text-white',
};

// RES lines with a 4xx/5xx status are highlighted so failures stand out.
const isFailedResponse = (line) => line.level === 'RES' && / [45]\d\d /.test(line.message);

const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const Logs = () => {
    const [files, setFiles] = useState([]);
    const [selected, setSelected] = useState('');
    const [lines, setLines] = useState([]);
    const [totalLines, setTotalLines] = useState(0);
    const [level, setLevel] = useState('');
    const [search, setSearch] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [limit, setLimit] = useState(500);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchFiles = useCallback(async () => {
        try {
            const data = await getLogFiles();
            setFiles(data);
            setSelected((current) => (data.some((f) => f.name === current) ? current : data[0]?.name || ''));
            if (data.length === 0) {
                setLines([]);
                setTotalLines(0);
            }
        } catch (error) {
            console.error('Error fetching log files:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLines = useCallback(async () => {
        if (!selected) return;
        try {
            const data = await getLogLines(selected, { level, search: appliedSearch, limit });
            setLines(data.lines);
            setTotalLines(data.totalLines);
        } catch (error) {
            console.error('Error fetching log lines:', error);
        }
    }, [selected, level, appliedSearch, limit]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    useEffect(() => {
        fetchLines();
    }, [fetchLines]);

    useEffect(() => {
        if (!autoRefresh) return;
        const timer = setInterval(() => {
            fetchLines();
            fetchFiles();
        }, 5000);
        return () => clearInterval(timer);
    }, [autoRefresh, fetchLines, fetchFiles]);

    const handleDownload = async () => {
        try {
            const blob = await downloadLogFile(selected);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = selected;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading log:', error);
            Swal.fire('Error', 'Failed to download log file', 'error');
        }
    };

    const handleDelete = async (all) => {
        const result = await Swal.fire({
            title: 'Confirm Delete',
            text: all ? 'Delete ALL log files? This cannot be undone.' : `Delete ${selected}? This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Yes, delete',
        });
        if (!result.isConfirmed) return;

        try {
            const data = all ? await deleteAllLogFiles() : await deleteLogFile(selected);
            Swal.fire('Deleted', data.message, 'success');
            fetchFiles();
        } catch (error) {
            console.error('Error deleting logs:', error);
            Swal.fire('Error', 'Failed to delete log file', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    const selectedFile = files.find((f) => f.name === selected);

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">SERVER LOGS</h1>
                    <p className="text-gray-500 text-sm">Every API request/response and server message. Times are UTC.</p>
                </div>
                <button
                    onClick={() => handleDelete(true)}
                    disabled={files.length === 0}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
                >
                    <FaTrashAlt size={12} /> DELETE ALL LOGS
                </button>
            </div>

            {files.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center text-gray-400">
                    No log files yet.
                </div>
            ) : (
                <>
                    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-3">
                        <select
                            value={selected}
                            onChange={(e) => setSelected(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                        >
                            {files.map((f) => (
                                <option key={f.name} value={f.name}>
                                    {f.name} ({formatSize(f.size)})
                                </option>
                            ))}
                        </select>

                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                        >
                            {LEVELS.map((l) => (
                                <option key={l} value={l}>{l || 'All levels'}</option>
                            ))}
                        </select>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setAppliedSearch(search.trim());
                            }}
                            className="relative flex-1 min-w-[200px]"
                        >
                            <input
                                type="text"
                                placeholder="Search email, URL, device id… (Enter)"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </form>

                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                        >
                            {[200, 500, 1000, 5000].map((n) => (
                                <option key={n} value={n}>Last {n}</option>
                            ))}
                        </select>

                        <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
                            Auto refresh
                        </label>

                        <button onClick={fetchLines} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                            <FaSync size={11} /> REFRESH
                        </button>
                        <button onClick={handleDownload} className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                            <FaDownload size={11} /> DOWNLOAD
                        </button>
                        <button onClick={() => handleDelete(false)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                            <FaTrashAlt size={11} /> DELETE FILE
                        </button>
                    </div>

                    <p className="mb-2 text-xs text-gray-500">
                        Showing {lines.length} of {totalLines} lines (newest first)
                        {selectedFile && ` · last updated ${new Date(selectedFile.modified).toLocaleString()}`}
                    </p>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="max-h-[65vh] overflow-auto font-mono text-xs divide-y divide-gray-50">
                            {lines.map((line, i) => (
                                <div
                                    key={i}
                                    className={`px-4 py-2 flex gap-3 items-start ${isFailedResponse(line) ? 'bg-red-50' : 'hover:bg-gray-50/50'}`}
                                >
                                    <span className="text-gray-400 whitespace-nowrap">{line.time ? line.time.replace('T', ' ').slice(0, 19) : ''}</span>
                                    <span className={`px-1.5 rounded font-bold whitespace-nowrap ${LEVEL_STYLES[line.level] || 'bg-gray-100 text-gray-600'}`}>
                                        {line.level}
                                    </span>
                                    <span className="text-gray-800 break-all whitespace-pre-wrap">{line.message}</span>
                                </div>
                            ))}
                            {lines.length === 0 && (
                                <div className="py-20 text-center text-gray-400 font-sans">No matching log lines.</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Logs;
