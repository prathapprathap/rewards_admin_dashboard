import { useEffect, useState } from 'react';
import { FaTasks, FaUsers } from 'react-icons/fa';
import { getStats } from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-4 bg-blue-100 rounded-full mr-4">
                        <FaUsers className="text-blue-500 text-2xl" />
                    </div>
                    <div>
                        <p className="text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-4 bg-green-100 rounded-full mr-4">
                        <FaTasks className="text-green-500 text-2xl" />
                    </div>
                    <div>
                        <p className="text-gray-500">Total Tasks</p>
                        <p className="text-2xl font-bold">{stats.totalTasks}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
