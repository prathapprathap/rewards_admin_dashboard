import { useEffect, useState } from 'react';
import { FaBars, FaCog, FaHome, FaMoneyBillWave, FaPlusCircle, FaSignOutAlt, FaTasks, FaTimes, FaUsers } from 'react-icons/fa';
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddOffer from './pages/AddOffer';
import AppSettings from './pages/AppSettings';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ManageOffers from './pages/ManageOffers';
import Users from './pages/Users';
import Withdrawals from './pages/Withdrawals';

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

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Redirect authenticated users from login to dashboard */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* All other routes use the dashboard layout */}
        <Route path="/*" element={
          <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Mobile Header */}
            <div className="md:hidden fixed w-full bg-white shadow-lg z-20 flex justify-between items-center px-4 py-3 border-b-2 border-indigo-500">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Rewards Admin</h1>
              <button onClick={toggleSidebar} className="text-gray-700 focus:outline-none hover:text-indigo-600 transition-colors">
                {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-all duration-300 ease-in-out w-72 bg-gradient-to-b from-indigo-600 via-indigo-700 to-purple-700 shadow-2xl z-30 flex flex-col`}>
              {/* Sidebar Header */}
              <div className="p-6 border-b border-indigo-500/30 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Rewards Admin</h1>
                  <p className="text-indigo-200 text-sm">Management Portal</p>
                </div>
                <button onClick={toggleSidebar} className="md:hidden text-white hover:text-indigo-200 transition-colors">
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="mt-4 flex-1 px-3 space-y-1">
                <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-all duration-200 group">
                  <FaHome className="mr-3 text-indigo-200 group-hover:text-white transition-colors" size={18} />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link to="/users" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-all duration-200 group">
                  <FaUsers className="mr-3 text-indigo-200 group-hover:text-white transition-colors" size={18} />
                  <span className="font-medium">Users</span>
                </Link>
                <Link to="/add-offer" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-all duration-200 group">
                  <FaPlusCircle className="mr-3 text-indigo-200 group-hover:text-white transition-colors" size={18} />
                  <span className="font-medium">Add Offer</span>
                </Link>
                <Link to="/manage-offers" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-all duration-200 group">
                  <FaTasks className="mr-3 text-indigo-200 group-hover:text-white transition-colors" size={18} />
                  <span className="font-medium">Manage Offers</span>
                </Link>
                <Link to="/withdrawals" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-all duration-200 group">
                  <FaMoneyBillWave className="mr-3 text-indigo-200 group-hover:text-white transition-colors" size={18} />
                  <span className="font-medium">Withdrawals</span>
                </Link>
                <Link to="/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-all duration-200 group">
                  <FaCog className="mr-3 text-indigo-200 group-hover:text-white transition-colors" size={18} />
                  <span className="font-medium">App Settings</span>
                </Link>
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-indigo-500/30">
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-white bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all duration-200 group">
                  <FaSignOutAlt className="mr-3 group-hover:scale-110 transition-transform" size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
              <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 md:hidden"></div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto pt-16 md:pt-0">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/add-offer" element={<AddOffer />} />
                <Route path="/manage-offers" element={<ManageOffers />} />
                <Route path="/withdrawals" element={<Withdrawals />} />
                <Route path="/settings" element={<AppSettings />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
