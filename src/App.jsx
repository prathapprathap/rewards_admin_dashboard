import { useEffect, useState } from 'react';
import { FaBars, FaCog, FaHome, FaPlusCircle, FaSignOutAlt, FaTimes, FaUsers } from 'react-icons/fa';
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddOffer from './pages/AddOffer';
import AppSettings from './pages/AppSettings';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';

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
      <div className="flex h-screen bg-gray-100">
        {/* Mobile Header */}
        <div className="md:hidden fixed w-full bg-white shadow-md z-20 flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
          <button onClick={toggleSidebar} className="text-gray-700 focus:outline-none">
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out w-64 bg-white shadow-lg z-30 flex flex-col`}>
          <div className="p-6 border-b flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
            <button onClick={toggleSidebar} className="md:hidden text-gray-700">
              <FaTimes size={24} />
            </button>
          </div>
          <nav className="mt-6 flex-1">
            <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <FaHome className="mr-3" />
              Dashboard
            </Link>
            <Link to="/users" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <FaUsers className="mr-3" />
              Users
            </Link>
            <Link to="/add-offer" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <FaPlusCircle className="mr-3" />
              Add Offer
            </Link>
            <Link to="/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <FaCog className="mr-3" />
              App Settings
            </Link>
          </nav>
          <div className="p-4 border-t">
            <button onClick={handleLogout} className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50 transition-colors">
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"></div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto pt-16 md:pt-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/add-offer" element={<AddOffer />} />
            <Route path="/settings" element={<AppSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
