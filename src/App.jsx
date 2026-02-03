import { useEffect, useState } from 'react';
import {
  FaBars,
  FaCog,
  FaCrown,
  FaGift,
  FaHistory,
  FaHome,
  FaPlusCircle, FaSignOutAlt,
  FaTasks,
  FaUsers,
  FaUserShield
} from 'react-icons/fa';
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import AccountDelete from './pages/AccountDelete';
import ActiveOffers from './pages/ActiveOffers';
import ActiveUsers from './pages/ActiveUsers';
import AddOffer from './pages/AddOffer';
import AdminProfile from './pages/AdminProfile';
import AppSettings from './pages/AppSettings';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageOffers from './pages/ManageOffers';
import PaidWithdrawals from './pages/PaidWithdrawals';
import PendingWithdrawals from './pages/PendingWithdrawals';
import PromoCodes from './pages/PromoCodes';
import TopReferrers from './pages/TopReferrers';
import Users from './pages/Users';
import Withdrawals from './pages/Withdrawals';

const SidebarItem = ({ to, icon: Icon, label, onClick, active }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group mb-1 ${active ? 'bg-white/15 text-white shadow-sm' : 'text-indigo-100 hover:bg-white/10 hover:text-white'
      }`}
  >
    <Icon className={`mr-3 ${active ? 'text-white' : 'text-indigo-300 group-hover:text-white'} transition-colors`} size={18} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

const SectionTitle = ({ children }) => (
  <p className="px-4 mt-6 mb-2 text-[10px] uppercase font-black tracking-widest text-indigo-300/60">{children}</p>
);

const BottomNavItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${active ? 'text-indigo-600' : 'text-gray-400'
      }`}
  >
    <Icon size={20} className={active ? 'scale-110' : ''} />
    <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
  </Link>
);

const AppContent = ({ isSidebarOpen, setIsSidebarOpen, handleLogout, toggleSidebar }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 flex justify-between items-center px-6 py-4 border-b border-gray-100/50">
        <div>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-0.5">Control Panel</p>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter">REWARDS <span className="text-indigo-600">ADMIN</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <FaUserShield size={16} />
          </Link>
          <button onClick={toggleSidebar} className="text-gray-900 bg-gray-100 p-2 rounded-xl active:scale-95 transition-transform">
            <FaBars size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar - Desktop Only */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] w-72 bg-indigo-900 shadow-2xl z-50 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FaCrown className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-tight">Rewards <span className="text-indigo-400">Admin</span></h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                <p className="text-indigo-300/60 text-[10px] uppercase font-bold tracking-widest">Active Server</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pt-6 px-4 custom-scrollbar space-y-1">
          <SectionTitle>Main Menu</SectionTitle>
          <SidebarItem to="/" icon={FaHome} label="Dashboard" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/'} />
          <SidebarItem to="/manage-offers" icon={FaTasks} label="Manage Offers" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/manage-offers'} />
          <SidebarItem to="/users" icon={FaUsers} label="Users Directory" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/users'} />
          <SidebarItem to="/withdrawals" icon={FaHistory} label="Withdrawals" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/withdrawals'} />

          <SectionTitle>Quick Actions</SectionTitle>
          <SidebarItem to="/add-offer" icon={FaPlusCircle} label="Create New Offer" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/add-offer'} />
          <SidebarItem to="/promo-codes" icon={FaGift} label="Promo Codes" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/promo-codes'} />

          <SectionTitle>Control</SectionTitle>
          <SidebarItem to="/settings" icon={FaCog} label="App Settings" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/settings'} />
          <SidebarItem to="/profile" icon={FaUserShield} label="Admin Profile" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/profile'} />
        </nav>

        {/* Logout Button */}
        <div className="p-4 bg-black/20">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-100 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all duration-200 group">
            <FaSignOutAlt className="mr-3 group-hover:scale-110 transition-transform" size={16} />
            <span className="font-bold text-sm tracking-tight">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto pt-20 pb-24 md:pt-0 md:pb-0 custom-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/active-users" element={<ActiveUsers />} />
              <Route path="/top-referrers" element={<TopReferrers />} />
              <Route path="/account-delete" element={<AccountDelete />} />
              <Route path="/add-offer" element={<AddOffer />} />
              <Route path="/manage-offers" element={<ManageOffers />} />
              <Route path="/active-offers" element={<ActiveOffers />} />
              <Route path="/promo-codes" element={<PromoCodes />} />
              <Route path="/withdrawals" element={<Withdrawals />} />
              <Route path="/pending-withdrawals" element={<PendingWithdrawals />} />
              <Route path="/paid-withdrawals" element={<PaidWithdrawals />} />
              <Route path="/settings" element={<AppSettings />} />
              <Route path="/profile" element={<AdminProfile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center px-4 py-2 z-40 pb-safe-area-inset-bottom">
          <BottomNavItem to="/" icon={FaHome} label="Home" active={location.pathname === '/'} />
          <BottomNavItem to="/manage-offers" icon={FaTasks} label="Offers" active={location.pathname === '/manage-offers'} />
          <div className="relative -top-5">
            <Link to="/add-offer" className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 border-4 border-white active:scale-90 transition-transform">
              <FaPlusCircle size={24} />
            </Link>
          </div>
          <BottomNavItem to="/withdrawals" icon={FaHistory} label="Payout" active={location.pathname === '/withdrawals'} />
          <BottomNavItem to="/users" icon={FaUsers} label="Users" active={location.pathname === '/users'} />
        </div>
      </main>
    </div>
  );
};


const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    setIsAuthenticated(auth === 'true');
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/*" element={
          isAuthenticated ? (
            <AppContent
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              handleLogout={handleLogout}
              toggleSidebar={toggleSidebar}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  );
};


export default App;
