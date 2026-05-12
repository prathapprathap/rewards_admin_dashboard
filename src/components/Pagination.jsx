import { useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const buildPages = (current, total) => {
    const pages = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }
    pages.push(1);
    const left = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);
    if (left > 2) pages.push('…');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push('…');
    pages.push(total);
    return pages;
};

const Pagination = ({ currentPage, totalItems, pageSize = 10, onPageChange }) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const pages = useMemo(() => buildPages(currentPage, totalPages), [currentPage, totalPages]);

    if (totalItems <= pageSize) return null;

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    const go = (p) => {
        if (p < 1 || p > totalPages || p === currentPage) return;
        onPageChange(p);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-gray-100 bg-gray-50/50">
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">
                Showing <span className="text-indigo-600">{start}</span>–<span className="text-indigo-600">{end}</span> of <span className="text-indigo-600">{totalItems}</span>
            </p>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => go(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                    aria-label="Previous page"
                >
                    <FaChevronLeft size={11} />
                </button>
                {pages.map((p, i) =>
                    p === '…' ? (
                        <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 font-black text-xs">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => go(p)}
                            className={`min-w-9 h-9 px-3 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                                p === currentPage
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => go(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                    aria-label="Next page"
                >
                    <FaChevronRight size={11} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
