import { parseWithdrawalDetails } from '../utils/withdrawals';

// Renders a withdrawal's payout details: account no + IFSC for bank
// transfers, or the UPI id / number for everything else.
const WithdrawalDetailsCell = ({ method, details }) => {
    const p = parseWithdrawalDetails(method, details);

    if (p.type === 'bank') {
        if (p.raw) {
            // Legacy free-text bank entry — show as-is.
            return <span className="text-sm text-gray-600">{p.raw}</span>;
        }
        return (
            <div className="text-sm leading-5">
                {p.accountName && (
                    <div className="text-gray-700">{p.accountName}</div>
                )}
                <div className="font-mono text-gray-900">
                    A/C: {p.accountNumber || '—'}
                </div>
                <div className="font-mono text-gray-500">
                    IFSC: {p.ifsc || '—'}
                </div>
                {p.bankName && (
                    <div className="text-xs text-gray-400">{p.bankName}</div>
                )}
            </div>
        );
    }

    return <span className="text-sm text-gray-600 font-mono break-all">{p.value || '—'}</span>;
};

export default WithdrawalDetailsCell;
