import { useEffect, useState } from 'react';
import {
  FaBars,
  FaCheckCircle,
  FaClock,
  FaCog,
  FaCrown,
  FaGift,
  FaHistory,
  FaHome,
  FaPlusCircle, FaSignOutAlt,
  FaTasks, FaTimes,
  FaTrashAlt,
  FaUserCheck,
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

const AppContent = ({ isSidebarOpen, setIsSidebarOpen, handleLogout, toggleSidebar }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white shadow-md z-20 flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-tighter">Rewards</h1>
        <button onClick={toggleSidebar} className="text-gray-700 p-1">
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-all duration-300 ease-in-out w-64 bg-indigo-700 shadow-2xl z-30 flex flex-col border-r border-indigo-800/50`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-indigo-500/30">
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Rewards <span className="text-indigo-300">Admin</span></h1>
          <div className="flex items-center mt-2 gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <p className="text-indigo-200 text-[10px] uppercase font-bold tracking-widest">Live Control Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <SectionTitle>Overview</SectionTitle>
          <SidebarItem to="/" icon={FaHome} label="Dashboard" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/'} />

          <SectionTitle>Offer Management</SectionTitle>
          <SidebarItem to="/manage-offers" icon={FaTasks} label="All Offers" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/manage-offers'} />
          <SidebarItem to="/active-offers" icon={FaCheckCircle} label="Active Offers" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/active-offers'} />
          <SidebarItem to="/add-offer" icon={FaPlusCircle} label="Add New Offer" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/add-offer'} />
          <SidebarItem to="/promo-codes" icon={FaGift} label="Promo Codes" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/promo-codes'} />

          <SectionTitle>Withdrawals</SectionTitle>
          <SidebarItem to="/pending-withdrawals" icon={FaClock} label="Pending Requests" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/pending-withdrawals'} />
          <SidebarItem to="/paid-withdrawals" icon={FaCheckCircle} label="Paid Withdrawals" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/paid-withdrawals'} />
          <SidebarItem to="/withdrawals" icon={FaHistory} label="All Withdrawals" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/withdrawals'} />

          <SectionTitle>User Management</SectionTitle>
          <SidebarItem to="/users" icon={FaUsers} label="All Users" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/users'} />
          <SidebarItem to="/active-users" icon={FaUserCheck} label="Active Users" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/active-users'} />
          <SidebarItem to="/top-referrers" icon={FaCrown} label="Top Referrers" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/top-referrers'} />
          <SidebarItem to="/account-delete" icon={FaTrashAlt} label="Delete Account" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/account-delete'} />

          <SectionTitle>System</SectionTitle>
          <SidebarItem to="/settings" icon={FaCog} label="App Settings" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/settings'} />
          <SidebarItem to="/profile" icon={FaUserShield} label="Admin Profile" onClick={() => setIsSidebarOpen(false)} active={location.pathname === '/profile'} />
        </nav>

        {/* Logout Button */}
        <div className="p-4 bg-indigo-800/50">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-red-100 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all duration-200 group">
            <FaSignOutAlt className="mr-3 group-hover:scale-110 transition-transform" size={16} />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm z-10 md:hidden transition-opacity duration-300"></div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto pt-16 md:pt-0">
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
