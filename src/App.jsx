import { useEffect, useState } from 'react';
import {
  FaBars,
  FaBell,
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
import Download from './pages/Download';
import AccountDelete from './pages/AccountDelete';
import ActiveOffers from './pages/ActiveOffers';
import ActiveUsers from './pages/ActiveUsers';
import AddOffer from './pages/AddOffer';
import AdminProfile from './pages/AdminProfile';
import AppSettings from './pages/AppSettings';
import Dashboard from './pages/Dashboard';
import ImageSlider from './pages/ImageSlider';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import ManageOffers from './pages/ManageOffers';
import PaidWithdrawals from './pages/PaidWithdrawals';
import PendingWithdrawals from './pages/PendingWithdrawals';
import PromoCodes from './pages/PromoCodes';
import TaskSubmissions from './pages/TaskSubmissions';
import TopReferrers from './pages/TopReferrers';
import Users from './pages/Users';
import Withdrawals from './pages/Withdrawals';

const SidebarItem = ({ to, icon: Icon, label, onClick, active, collapsed }) => (
  <Link
    to={to}
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-6'} py-3.5 rounded-2xl transition-all duration-300 group mb-2 ${active
      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 font-bold' + (collapsed ? '' : ' translate-x-2')
      : 'text-indigo-200/60 hover:bg-white/10 hover:text-white'
      }`}
  >
    <Icon className={`${collapsed ? '' : 'mr-4'} ${active ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-200'} transition-transform group-hover:scale-110`} size={18} />
    {!collapsed && <span className="text-sm tracking-tight">{label}</span>}
  </Link>
);

const SectionTitle = ({ children, collapsed }) => (
  collapsed
    ? <div className="mx-4 my-3 border-t border-white/10" />
    : <p className="px-6 mt-8 mb-3 text-[10px] uppercase font-black tracking-[0.25em] text-indigo-400/50">{children}</p>
);

const AppContent = ({ isSidebarOpen, setIsSidebarOpen, isDesktopCollapsed, handleLogout, toggleSidebar, isDesktop }) => {
  const location = useLocation();

  const closeOnMobile = () => {
    if (!isDesktop) setIsSidebarOpen(false);
  };

  // Visible sidebar logic
  const sidebarVisible = isDesktop ? true : isSidebarOpen;
  const collapsed = isDesktop && isDesktopCollapsed;
  const sidebarWidth = collapsed ? 'w-20' : 'w-72';

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Top Header */}
      <div
        className={`fixed top-0 right-0 bg-white/80 backdrop-blur-md z-40 flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100/50 transition-all duration-300`}
        style={{
          left: isDesktop ? (collapsed ? '5rem' : '18rem') : 0,
        }}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-xl active:scale-95 transition-transform"
          >
            <FaBars size={20} />
          </button>
          <div>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-0.5 hidden sm:block">Control Panel</p>
            <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tighter">REWARDS <span className="text-indigo-600">ADMIN</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/admin/profile" className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-200 transition-colors">
            <FaUserShield size={16} />
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 ${sidebarWidth} bg-indigo-900 shadow-2xl z-50 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          sidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } ${isDesktop ? '' : 'max-w-[85vw]'}`}
      >
        {/* Sidebar Header */}
        <div className={`${collapsed ? 'p-4' : 'p-8'} border-b border-white/5`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} mb-2`}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <FaHistory className="text-white" size={20} />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-tight">Rewards <span className="text-indigo-400">Admin</span></h1>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <p className="text-indigo-300/60 text-[10px] uppercase font-bold tracking-widest">Active Server</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'pt-4 px-2' : 'pt-6 px-4'} custom-scrollbar space-y-1`}>
          <SectionTitle collapsed={collapsed}>Main Menu</SectionTitle>
          <SidebarItem to="/admin" icon={FaHome} label="Dashboard" onClick={closeOnMobile} active={location.pathname === '/admin'} collapsed={collapsed} />
          <SidebarItem to="/admin/manage-offers" icon={FaTasks} label="Manage Offers" onClick={closeOnMobile} active={location.pathname === '/admin/manage-offers'} collapsed={collapsed} />
          <SidebarItem to="/admin/active-offers" icon={FaTasks} label="Active Offer" onClick={closeOnMobile} active={location.pathname === '/admin/active-offers'} collapsed={collapsed} />
          <SidebarItem to="/admin/task-submissions" icon={FaTasks} label="Task Submissions" onClick={closeOnMobile} active={location.pathname === '/admin/task-submissions'} collapsed={collapsed} />

          <SectionTitle collapsed={collapsed}>User Management</SectionTitle>
          <SidebarItem to="/admin/active-users" icon={FaUsers} label="Active Users" onClick={closeOnMobile} active={location.pathname === '/admin/active-users'} collapsed={collapsed} />
          <SidebarItem to="/admin/top-referrers" icon={FaUsers} label="Top Referrers" onClick={closeOnMobile} active={location.pathname === '/admin/top-referrers'} collapsed={collapsed} />
          <SidebarItem to="/admin/account-delete" icon={FaTrashAlt} label="Account Delete" onClick={closeOnMobile} active={location.pathname === '/admin/account-delete'} collapsed={collapsed} />

          <SectionTitle collapsed={collapsed}>Financials</SectionTitle>
          <SidebarItem to="/admin/pending-withdrawals" icon={FaHistory} label="Pending Payouts" onClick={closeOnMobile} active={location.pathname === '/admin/pending-withdrawals'} collapsed={collapsed} />
          <SidebarItem to="/admin/paid-withdrawals" icon={FaHistory} label="Paid History" onClick={closeOnMobile} active={location.pathname === '/admin/paid-withdrawals'} collapsed={collapsed} />

          <SectionTitle collapsed={collapsed}>Configuration</SectionTitle>
          <SidebarItem to="/admin/promo-codes" icon={FaGift} label="Promo Codes" onClick={closeOnMobile} active={location.pathname === '/admin/promo-codes'} collapsed={collapsed} />
          <SidebarItem to="/admin/image-slider" icon={FaHistory} label="Image Slider" onClick={closeOnMobile} active={location.pathname === '/admin/image-slider'} collapsed={collapsed} />
          <SidebarItem to="/admin/notifications" icon={FaBell} label="Notifications" onClick={closeOnMobile} active={location.pathname === '/admin/notifications'} collapsed={collapsed} />
          <SidebarItem to="/admin/settings" icon={FaCog} label="System Settings" onClick={closeOnMobile} active={location.pathname === '/admin/settings'} collapsed={collapsed} />
        </nav>

        {/* Logout */}
        <div className={`${collapsed ? 'p-2' : 'p-4'} bg-black/20`}>
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`flex items-center w-full ${collapsed ? 'justify-center px-2' : 'px-4'} py-3.5 text-red-100 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-all duration-200 group`}
          >
            <FaSignOutAlt className={`${collapsed ? '' : 'mr-3'} group-hover:scale-110 transition-transform`} size={16} />
            {!collapsed && <span className="font-bold text-sm tracking-tight text-center flex-1">Logout Account</span>}
          </button>
        </div>
      </aside>

      {/* Overlay (mobile only) */}
      {!isDesktop && isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 animate-fade-in"></div>
      )}

      {/* Main Content Area */}
      <main
        className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden transition-all duration-300"
        style={{
          marginLeft: isDesktop ? (collapsed ? '5rem' : '18rem') : 0,
        }}
      >
        <div className="flex-1 overflow-y-auto pt-20 pb-24 md:pb-6 custom-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="active-users" element={<ActiveUsers />} />
              <Route path="top-referrers" element={<TopReferrers />} />
              <Route path="account-delete" element={<AccountDelete />} />
              <Route path="add-offer" element={<AddOffer />} />
              <Route path="manage-offers" element={<ManageOffers />} />
              <Route path="active-offers" element={<ActiveOffers />} />
              <Route path="task-submissions" element={<TaskSubmissions />} />
              <Route path="promo-codes" element={<PromoCodes />} />
              <Route path="withdrawals" element={<Withdrawals />} />
              <Route path="pending-withdrawals" element={<PendingWithdrawals />} />
              <Route path="paid-withdrawals" element={<PaidWithdrawals />} />
              <Route path="image-slider" element={<ImageSlider />} />
              <Route path="settings" element={<AppSettings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        {!isDesktop && (
          <div className="mobile-bottom-nav fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center px-4 py-2 z-40 pb-safe-area-inset-bottom">
            <BottomNavItem to="/admin" icon={FaHome} label="Home" active={location.pathname === '/admin'} />
            <BottomNavItem to="/admin/manage-offers" icon={FaTasks} label="Offers" active={location.pathname === '/admin/manage-offers'} />
            <div className="relative -top-5">
              <Link to="/admin/add-offer" className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 border-4 border-white active:scale-90 transition-transform">
                <FaPlusCircle size={24} />
              </Link>
            </div>
            <BottomNavItem to="/admin/withdrawals" icon={FaHistory} label="Payout" active={location.pathname === '/admin/withdrawals'} />
            <BottomNavItem to="/admin/users" icon={FaUsers} label="Users" active={location.pathname === '/admin/users'} />
          </div>
        )}
      </main>
    </div>
  );
};

const BottomNavItem = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-indigo-600 scale-110' : 'text-gray-400'}`}>
    <Icon size={20} />
    <span className="text-[10px] font-bold">{label}</span>
  </Link>
);


const App = () => {
  const getIsDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 768;

  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile drawer
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false); // desktop icon-only
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    const token = localStorage.getItem('adminToken');
    // Require BOTH the flag and a real JWT — the token is what the backend checks.
    setIsAuthenticated(auth === 'true' && !!token);
  }, []);

  useEffect(() => {
    const onResize = () => setIsDesktop(getIsDesktop());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleSidebar = () => {
    if (isDesktop) {
      setIsDesktopCollapsed((v) => !v);
    } else {
      setIsSidebarOpen((v) => !v);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/admin" : "/login"} replace />} />
        <Route path="/download" element={<Download />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login />} />
        <Route path="/admin/*" element={
          isAuthenticated ? (
            <AppContent
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              isDesktopCollapsed={isDesktopCollapsed}
              handleLogout={handleLogout}
              toggleSidebar={toggleSidebar}
              isDesktop={isDesktop}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/admin" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};


export default App;
