import { useEffect, useMemo, useState } from 'react';
import {
  FaBolt,
  FaCalendarCheck,
  FaCheckCircle,
  FaDownload,
  FaGift,
  FaHeadset,
  FaPlay,
  FaShareAlt,
  FaShieldAlt,
  FaStar,
  FaUserFriends,
  FaUserShield,
  FaWallet,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const APK_PATH = '/RewardsApp.apk';
const SETTINGS_URL = 'https://rewards-backend-zkhh.onrender.com/api/users/app/settings';

const normalizeDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (!/drive\.google\.com/i.test(url)) return url;
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/uc?export=download&id=${m[1]}` : url;
};

const FEATURES = [
  { icon: FaBolt, title: 'Instant Rewards', text: 'Earn coins instantly the moment you finish a task or offer.' },
  { icon: FaCalendarCheck, title: 'Daily Login Bonus', text: 'Open the app every day and collect free coins.' },
  { icon: FaPlay, title: 'Watch & Earn', text: 'Play short videos in the app and rack up rewards.' },
  { icon: FaGift, title: 'Spin & Win', text: 'Try your luck with the spin wheel for bonus coins.' },
  { icon: FaUserFriends, title: 'Refer & Earn', text: 'Invite friends and earn a cut of every reward they win.' },
  { icon: FaWallet, title: 'Fast Withdrawals', text: 'Cash out to UPI, Paytm, or gift cards in minutes.' },
  { icon: FaShieldAlt, title: 'Verified Offers', text: 'Every offer is hand-checked so you never waste a tap.' },
  { icon: FaHeadset, title: '24/7 Support', text: 'Our team is always one message away to help you.' },
];

const FAQS = [
  { q: 'How do I earn coins?', a: 'Complete offers, watch videos, spin the wheel, login daily, and refer friends — every action gives coins.' },
  { q: 'How fast are withdrawals?', a: 'Most UPI and Paytm withdrawals are processed within a few minutes after approval.' },
  { q: 'What payout options are available?', a: 'UPI, Paytm Wallet, Bank Transfer, and popular gift cards (Amazon, Google Play, etc.).' },
  { q: 'Is the app safe to use?', a: 'Yes — we use Google sign-in, encrypted APIs and verified offers only. No password ever stored.' },
  { q: 'Can I use multiple accounts?', a: 'No. One account per user. Multi-account usage will result in permanent ban and forfeited balance.' },
  { q: 'How does the referral bonus work?', a: 'Share your referral link. When your friend signs up and earns, you get an automatic commission credited to your wallet.' },
  { q: 'Are there any hidden charges?', a: 'No charges, ever. The app is 100% free and earnings are real.' },
];

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const [apkUrl, setApkUrl] = useState(APK_PATH);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(SETTINGS_URL);
        const data = await res.json();
        const row = Array.isArray(data) ? data[0] : data;
        const raw = row?.apk_download_url || row?.update_url;
        const url = normalizeDriveUrl(raw);
        if (!cancelled && url) setApkUrl(url);
      } catch (_) {}
    })();
    return () => { cancelled = true; };
  }, []);

  const refCode = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('referral') || params.get('code');
    if (!ref) return null;
    const cleaned = ref.toString().trim().toUpperCase();
    return /^[A-Z0-9]{4,12}$/.test(cleaned) ? cleaned : null;
  }, []);

  useEffect(() => {
    if (refCode) {
      try { localStorage.setItem('pendingRef', refCode); } catch (_) {}
    }
  }, [refCode]);

  const handleDownload = async (e) => {
    e?.preventDefault?.();
    const code = refCode || (typeof window !== 'undefined' ? localStorage.getItem('pendingRef') : null);
    if (code) {
      const payload = `Join me on RewardsApp! Use my referral code: ${code} (ref=${code})`;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(payload);
        } else {
          const ta = document.createElement('textarea');
          ta.value = payload;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 4000);
      } catch (_) {}
    }
    // Trigger APK download (Drive URLs need a redirect; local files can use anchor)
    const isCrossOrigin = /^https?:\/\//i.test(apkUrl) && !apkUrl.startsWith(window.location.origin);
    if (isCrossOrigin) {
      window.location.href = apkUrl;
    } else {
      const a = document.createElement('a');
      a.href = apkUrl;
      a.download = 'RewardsApp.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleShare = async () => {
    const shareUrl = refCode
      ? `${window.location.origin}/?ref=${refCode}`
      : window.location.origin;
    const text = `Earn real cash by completing offers! ${refCode ? `Use my code ${refCode} for a bonus. ` : ''}${shareUrl}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'RewardsApp', text, url: shareUrl }); return; } catch (_) {}
    }
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 3000);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 text-slate-800 font-sans">
      {/* Floating "copied" toast */}
      {showCopied && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
          <FaCheckCircle /> Referral code copied! Open the app to claim.
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/70 border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="RewardsApp" className="w-9 h-9 rounded-xl shadow" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">RewardsApp</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#how" className="hover:text-indigo-600">How it works</a>
            <a href="#faq" className="hover:text-indigo-600">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              title="Admin Login"
              className="hidden sm:inline-flex items-center gap-2 border-2 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold px-4 py-2 rounded-full text-sm transition"
            >
              <FaUserShield /> Admin
            </Link>
            <Link
              to="/login"
              aria-label="Admin Login"
              className="sm:hidden text-indigo-700 border-2 border-indigo-200 hover:border-indigo-400 p-2 rounded-full"
            >
              <FaUserShield />
            </Link>
            <button onClick={handleDownload} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-4 sm:px-5 py-2 rounded-full shadow-md flex items-center gap-2 text-sm">
              <FaDownload /> <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid md:grid-cols-2 gap-10 items-center relative">
          <div>
            {refCode && (
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-full text-sm mb-5 animate-fade-in">
                <FaGift /> Referral <span className="font-black">{refCode}</span> will be auto-applied!
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Turn Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Free Time</span> Into Real Cash
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-lg">
              Complete simple offers, watch videos, spin the wheel and refer friends — withdraw to UPI, Paytm or gift cards in minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={handleDownload} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold px-7 py-4 rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center gap-3 text-lg active:scale-95 transition">
                <FaDownload size={20} /> Download App
              </button>
              <button onClick={handleShare} className="bg-white border-2 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold px-6 py-4 rounded-2xl flex items-center gap-2 text-base">
                <FaShareAlt /> Share
              </button>
            </div>

            <div className="mt-6 flex items-center gap-5 text-sm text-slate-500">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => <FaStar key={i} />)}
              </div>
              <span className="font-semibold">4.8 / 5 · 50k+ users</span>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative flex justify-center">
            <div className="relative w-64 sm:w-72 aspect-[9/19] bg-slate-900 rounded-[3rem] p-3 shadow-2xl shadow-indigo-500/40 border-4 border-slate-800">
              <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                <img src="/screenshots/1.png" alt="App preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl" />
            </div>
            <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-2xl shadow-lg rotate-6 text-sm">
              ₹500 Bonus 🎉
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white py-8 border-y border-indigo-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ['50K+', 'Active Users'],
            ['₹10L+', 'Paid Out'],
            ['200+', 'Live Offers'],
            ['24/7', 'Support'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{n}</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Why RewardsApp</p>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">Everything you need to earn</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-extrabold text-lg">{title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 sm:py-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Get Started</p>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">3 simple steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ['Download', 'Tap the download button & install the APK on your Android phone.'],
              ['Sign in & Earn', 'Sign in with Google, complete offers, spin the wheel, watch videos.'],
              ['Withdraw', 'Cash out instantly to UPI, Paytm, or claim gift cards.'],
            ].map(([t, d], i) => (
              <div key={t} className="relative bg-white rounded-3xl p-7 shadow-md border border-indigo-100">
                <div className="absolute -top-5 left-7 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-xl shadow-lg">{i + 1}</div>
                <h3 className="font-extrabold text-xl mt-4">{t}</h3>
                <p className="text-slate-600 mt-2 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Help Center</p>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">Frequently asked</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-slate-800 hover:bg-indigo-50/50 transition">
                  <span>{f.q}</span>
                  <span className={`text-indigo-600 text-xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-10 sm:p-14 text-center text-white shadow-2xl shadow-purple-500/40 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            <h2 className="text-3xl sm:text-5xl font-black">Ready to start earning?</h2>
            <p className="mt-3 text-lg text-indigo-100">Download now and grab your welcome bonus.</p>
            <button onClick={handleDownload} className="mt-8 bg-white text-indigo-700 font-extrabold px-8 py-4 rounded-2xl shadow-xl text-lg inline-flex items-center gap-3 hover:scale-105 transition">
              <FaDownload /> Download Free APK
            </button>
            {refCode && (
              <p className="mt-4 text-sm text-indigo-100">Your bonus code <span className="font-black bg-white/20 px-2 py-1 rounded">{refCode}</span> is locked in 🎁</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-indigo-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-7 h-7 rounded-lg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-bold text-slate-700">RewardsApp</span>
          </div>
          <div className="flex gap-5 font-semibold">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="/admin" className="hover:text-indigo-600">Admin</a>
          </div>
          <div>© {new Date().getFullYear()} RewardsApp. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
