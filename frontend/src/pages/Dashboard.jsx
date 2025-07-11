import { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonors: 0,
    totalVolunteers: 0,
    recentDonations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Donations</h3>
          <p className="stat-value">₹{stats.totalDonations}</p>
        </div>
        <div className="stat-card">
          <h3>Active Donors</h3>
          <p className="stat-value">{stats.activeDonors}</p>
        </div>
        <div className="stat-card">
          <h3>Total Volunteers</h3>
          <p className="stat-value">{stats.totalVolunteers}</p>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Donations</h2>
        <div className="activity-list">
          {stats.recentDonations.map((donation) => (
            <div key={donation._id} className="activity-item">
              <div className="activity-info">
                <p className="donor-name">{donation.donor.name}</p>
                <p className="donation-amount">₹{donation.amount}</p>
              </div>
              <p className="donation-date">
                {new Date(donation.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;