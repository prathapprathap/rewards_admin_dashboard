import { useMemo, useState } from 'react';

export const PAGE_SIZE = 10;

export const usePagination = (items, pageSize = PAGE_SIZE) => {
    const [rawPage, setCurrentPage] = useState(1);
    const total = items?.length || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(1, rawPage), totalPages);

    const pageItems = useMemo(() => {
        if (!items) return [];
        const start = (currentPage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, currentPage, pageSize]);

    const startIndex = (currentPage - 1) * pageSize;

    return { currentPage, setCurrentPage, pageItems, total, pageSize, startIndex };
};
