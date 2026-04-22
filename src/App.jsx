import { useEffect, useState } from 'react';
import {
  FaBars,
  FaCog,
  FaGift,
  FaHistory,
  FaHome,
  FaPlusCircle,
  FaSignOutAlt,
  FaTasks,
  FaTrashAlt,
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
import ConversionAnalytics from './pages/ConversionAnalytics';
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
    className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group mb-1 ${active ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
      }`}
  >
    <Icon className={`mr-3 ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'} transition-colors`} size={16} />
    <span className="text-sm">{label}</span>
  </Link>
);

const SectionTitle = ({ children }) => (
  <p className="px-4 mt-6 mb-2 text-[10px] uppercase font-bold tracking-widest text-gray-400">{children}</p>
);

const AppContent = ({ isSidebarOpen, setIsSidebarOpen, handleLogout, toggleSidebar }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#f1f4f9] overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white z-40 flex justify-between items-center px-6 py-4 border-b border-gray-100 shadow-sm">
        <h1 className="text-lg font-black text-indigo-700 tracking-tighter">ADMINISTRATOR</h1>
        <button onClick={toggleSidebar} className="text-gray-500 bg-gray-100 p-2 rounded-lg">
          <FaBars size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-all duration-300 ease-in-out w-64 bg-white border-r border-gray-200 z-50 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-700 tracking-tight">Administrator</h1>
          <button className="md:hidden text-indigo-500" onClick={toggleSidebar}>
            <FaPlusCircle className="rotate-45" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 custom-scrollbar">
          <SidebarItem to="/" icon={FaHome} label="Dashboard" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/'} />

          <SectionTitle>Manage Offer</SectionTitle>
          <SidebarItem to="/manage-offers" icon={FaTasks} label="All Offer" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/manage-offers'} />
          <SidebarItem to="/active-offers" icon={FaTasks} label="Active Offer" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/active-offers'} />

          <SectionTitle>Withdrawals</SectionTitle>
          <SidebarItem to="/pending-withdrawals" icon={FaHistory} label="Pending Withdrawal" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/pending-withdrawals'} />
          <SidebarItem to="/paid-withdrawals" icon={FaHistory} label="Paid Withdrawal" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/paid-withdrawals'} />

          <SectionTitle>User Manage</SectionTitle>
          <SidebarItem to="/active-users" icon={FaUsers} label="Active Users" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/active-users'} />
          <SidebarItem to="/top-referrers" icon={FaUsers} label="Top Reffers" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/top-referrers'} />
          <SidebarItem to="/account-delete" icon={FaTrashAlt} label="Account Delete" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/account-delete'} />

          <SectionTitle>Manage</SectionTitle>
          <SidebarItem to="/promo-codes" icon={FaGift} label="Promocode" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/promo-codes'} />
          <SidebarItem to="/image-slider" icon={FaHistory} label="Image Slider" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/image-slider'} />

          <SectionTitle>Setting</SectionTitle>
          <SidebarItem to="/profile" icon={FaUserShield} label="Admin Profile" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/profile'} />
          <SidebarItem to="/settings" icon={FaCog} label="App Setting" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/settings'} />

          <div className="mt-8 border-t border-gray-100 pt-4 pb-4">
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group">
              <FaSignOutAlt className="mr-3" size={16} />
              <span className="font-bold text-sm">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity"></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
        {/* Header (Desktop) */}
        <header className="hidden md:flex bg-white h-16 border-b border-gray-200 items-center justify-end px-8 gap-6 shadow-sm z-30">
          <button className="text-gray-400 hover:text-indigo-600 transition-colors">
            <FaTasks size={18} />
          </button>
          <div className="flex items-center gap-3 cursor-pointer group pl-6 border-l border-gray-100">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors leading-none">Administrator</p>
              <p className="text-[10px] text-gray-400 font-medium">RewardMobi</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-indigo-100 p-0.5 group-hover:border-indigo-500 transition-all shadow-sm">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=RM&background=4f46e5&color=fff'} />
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto pt-20 pb-24 md:pt-0 md:pb-0 custom-scrollbar relative">
          <div className="p-4 md:p-8">
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
              <Route path="/image-slider" element={<ImageSlider />} />
              <Route path="/settings" element={<AppSettings />} />
              <Route path="/profile" element={<AdminProfile />} />
              <Route path="/analytics" element={<ConversionAnalytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
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
