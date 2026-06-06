// Helpers shared by the Pending / Paid withdrawal pages.

const isBankMethod = (method = '') => {
    const m = method.toLowerCase();
    return m.includes('bank') || m.includes('imps') || m.includes('neft');
};

/**
 * Parse a withdrawal's `details` string into structured payout info.
 *
 * Bank transfers from the mobile app are stored as a pipe-delimited
 * "Key: Value" string e.g. "Name: John | A/C: 123456 | IFSC: SBIN0001234 | Bank: SBI".
 * UPI / Paytm store the raw id / number. Older bank records may be free text.
 */
export const parseWithdrawalDetails = (method = '', details = '') => {
    const raw = (details ?? '').toString().trim();
    const bank = isBankMethod(method);

    // Try to parse "Key: Value | Key: Value" pairs.
    const fields = {};
    if (raw.includes(':')) {
        raw.split(/[|\n]/).forEach((part) => {
            const idx = part.indexOf(':');
            if (idx === -1) return;
            const key = part.slice(0, idx).trim().toLowerCase();
            const value = part.slice(idx + 1).trim();
            if (!value) return;
            if (key.startsWith('name') || key.includes('holder')) fields.accountName = value;
            else if (key.startsWith('a/c') || key.includes('account')) fields.accountNumber = value;
            else if (key.includes('ifsc')) fields.ifsc = value;
            else if (key.includes('bank')) fields.bankName = value;
            else if (key.includes('upi')) fields.upiId = value;
        });
    }

    if (bank) {
        return {
            type: 'bank',
            accountName: fields.accountName || '',
            accountNumber: fields.accountNumber || '',
            ifsc: fields.ifsc || '',
            bankName: fields.bankName || '',
            // Fall back to the raw string when nothing structured was found
            // (e.g. legacy free-text bank entries).
            raw: !fields.accountNumber && !fields.ifsc ? raw : '',
        };
    }

    return {
        type: method && method.toLowerCase().includes('upi') ? 'upi' : 'other',
        value: fields.upiId || raw,
    };
};

/** Single-line summary of the payout details, used for CSV / search. */
export const detailsSummary = (method, details) => {
    const p = parseWithdrawalDetails(method, details);
    if (p.type === 'bank') {
        if (p.raw) return p.raw;
        return [
            p.accountName && `Name: ${p.accountName}`,
            p.accountNumber && `A/C: ${p.accountNumber}`,
            p.ifsc && `IFSC: ${p.ifsc}`,
            p.bankName && `Bank: ${p.bankName}`,
        ].filter(Boolean).join(' | ');
    }
    return p.value || '';
};

const csvCell = (value) => {
    const s = value === null || value === undefined ? '' : String(value);
    // Escape per RFC 4180 and guard against CSV/formula injection.
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
};

const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-IN');
};

/**
 * Download an array of withdrawal rows as a CSV file.
 * @param rows  withdrawal objects (as returned by the API)
 * @param filename  output file name
 */
export const downloadWithdrawalsCsv = (rows, filename = 'withdrawals.csv') => {
    const header = [
        'ID', 'User Name', 'Email', 'Mobile', 'Amount', 'Method',
        'Account Holder', 'Account Number', 'IFSC', 'Bank / UPI / Details',
        'Requested Date', 'Paid Date', 'Status',
    ];

    const lines = rows.map((w) => {
        const p = parseWithdrawalDetails(w.method, w.details);
        const accountHolder = p.type === 'bank' ? p.accountName : '';
        const accountNumber = p.type === 'bank' ? p.accountNumber : '';
        const ifsc = p.type === 'bank' ? p.ifsc : '';
        const misc = p.type === 'bank'
            ? (p.bankName || p.raw)
            : (p.value || '');
        return [
            w.id, w.name, w.email, w.mobile, w.amount, w.method,
            accountHolder, accountNumber, ifsc, misc,
            formatDate(w.created_at), formatDate(w.paid_at), w.status,
        ].map(csvCell).join(',');
    });

    const csv = [header.map(csvCell).join(','), ...lines].join('\r\n');
    const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/** True if `dateValue` falls within [from, to] (inclusive). Empty bounds are open. */
export const withinDateRange = (dateValue, from, to) => {
    if (!dateValue) return !from && !to;
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return false;
    if (from) {
        const f = new Date(from);
        f.setHours(0, 0, 0, 0);
        if (d < f) return false;
    }
    if (to) {
        const t = new Date(to);
        t.setHours(23, 59, 59, 999);
        if (d > t) return false;
    }
    return true;
};

/** Returns today's date as YYYY-MM-DD (local). */
export const todayStr = () => {
    const now = new Date();
    const off = now.getTimezoneOffset();
    return new Date(now.getTime() - off * 60000).toISOString().slice(0, 10);
};
