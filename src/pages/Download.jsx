import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCheckCircle, FaDownload, FaExclamationTriangle, FaGift, FaSpinner } from 'react-icons/fa';

const API_BASE = import.meta.env.PROD
    ? 'https://api.rupirewards.xyz'
    : 'https://rewards-backend-zkhh.onrender.com';
const SETTINGS_URL = `${API_BASE}/api/users/app/settings`;
const FALLBACK_APK = '/RewardsApp.apk';

// Convert a Google Drive sharing URL into a direct-download URL.
// Accepts forms like:
//   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
//   https://drive.google.com/open?id=FILE_ID
//   https://drive.google.com/uc?id=FILE_ID&export=download
// Returns the input unchanged if it doesn't look like a Drive URL.
const normalizeDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (!/drive\.google\.com/i.test(url)) return url;
  let id = null;
  const m1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m1) id = m1[1];
  else if (m2) id = m2[1];
  if (!id) return url;
  return `https://drive.google.com/uc?export=download&id=${id}`;
};

const Download = () => {
  const [status, setStatus] = useState('loading'); // loading | ready | downloading | done | error
  const [apkUrl, setApkUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const triggered = useRef(false);

  const refCode = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('referral') || params.get('code');
    const fallback = ref || (typeof localStorage !== 'undefined' ? localStorage.getItem('pendingRef') : null);
    if (!fallback) return null;
    const cleaned = fallback.toString().trim().toUpperCase();
    return /^[A-Z0-9]{4,12}$/.test(cleaned) ? cleaned : null;
  }, []);

  // Fetch admin-controlled APK URL.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(SETTINGS_URL);
        const data = await res.json();
        const row = Array.isArray(data) ? data[0] : data;
        const raw = row?.apk_download_url || row?.update_url;
        const url = normalizeDriveUrl(raw) || FALLBACK_APK;
        if (!cancelled) {
          setApkUrl(url);
          setStatus('ready');
        }
      } catch (_) {
        if (!cancelled) {
          setApkUrl(FALLBACK_APK);
          setStatus('ready');
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const startDownload = (url) => {
    const target = url || apkUrl;
    if (!target) return;
    // For cross-origin URLs (e.g. Google Drive) the `download` attribute is
    // ignored — sending the user to the URL lets the browser/Drive handle it.
    const isCrossOrigin = /^https?:\/\//i.test(target) && !target.startsWith(window.location.origin);
    if (isCrossOrigin) {
      window.location.href = target;
    } else {
      const a = document.createElement('a');
      a.href = target;
      a.download = 'RewardsApp.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setStatus('done');
  };

  // Auto-trigger once the URL is loaded.
  useEffect(() => {
    if (status !== 'ready' || triggered.current) return;
    triggered.current = true;

    if (refCode) {
      try { localStorage.setItem('pendingRef', refCode); } catch (_) {}
      const payload = `Join me on RewardsApp! Use my referral code: ${refCode} (ref=${refCode})`;
      (async () => {
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(payload);
            setCopied(true);
          }
        } catch (_) {}
      })();
    }

    setStatus('downloading');
    const t = setTimeout(() => startDownload(apkUrl), 600);
    return () => clearTimeout(t);
  }, [status, apkUrl, refCode]);

  const isWorking = status === 'loading' || status === 'downloading';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/40">
          {status === 'done'
            ? <FaCheckCircle className="text-white" size={40} />
            : status === 'error'
              ? <FaExclamationTriangle className="text-white" size={36} />
              : <FaSpinner className="text-white animate-spin" size={36} />}
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {status === 'done' ? 'Download started!' :
            status === 'loading' ? 'Fetching latest version…' :
            'Preparing your download…'}
        </h1>
        <p className="text-slate-600 mt-2 text-sm">
          {status === 'done'
            ? 'Check your notifications for the APK. Tap it to install RewardsApp.'
            : 'Your download will begin in a moment.'}
        </p>

        {refCode && (
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-left">
            <FaGift className="text-emerald-600 shrink-0" size={22} />
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-700">Referral locked in</div>
              <div className="font-black text-emerald-900 text-lg leading-tight">{refCode}</div>
              {copied && <div className="text-[11px] text-emerald-700 mt-0.5">Copied to clipboard — paste it in the app if asked.</div>}
            </div>
          </div>
        )}

        <button
          onClick={() => startDownload()}
          disabled={isWorking || !apkUrl}
          className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold px-6 py-4 rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-95 transition"
        >
          <FaDownload /> {status === 'done' ? 'Download again' : 'Download APK'}
        </button>

        <p className="mt-5 text-[11px] text-slate-400">
          Android only · Allow installs from unknown sources to install the APK.
        </p>
      </div>
    </div>
  );
};

export default Download;
