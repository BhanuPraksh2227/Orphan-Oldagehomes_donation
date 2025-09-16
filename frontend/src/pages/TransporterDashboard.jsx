import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransporterNavbar from '../components/TransporterNavbar';
import '../styles/transporterDashboard.css';

const TransporterDashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalTransports: 0,
    completedTransports: 0,
    pendingTransports: 0,
    totalEarnings: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Mock stats - in real app, this would come from API
        setStats({
          totalTransports: 15,
          completedTransports: 12,
          pendingTransports: 3,
          totalEarnings: 4500
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const quickActions = [
    {
      title: "View Transport Requests",
      description: "Check available donation transport requests",
      icon: "🚚",
      action: () => navigate('/transport-requests'),
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "My Profile",
      description: "View and update your transporter profile",
      icon: "👤",
      action: () => navigate('/transporter-profile'),
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "About Platform",
      description: "Learn more about our donation platform",
      icon: "ℹ️",
      action: () => navigate('/transporter-about'),
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      title: "Transport History",
      description: "View your past transport activities",
      icon: "📋",
      action: () => navigate('/transporter-profile'),
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    }
  ];

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading transporter dashboard...</p>
      </div>
    );
  }

  return (
    <div className="transporter-dashboard">
      <TransporterNavbar onMenuClick={handleMenuClick} />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, {user.name || 'Transporter'}! 🚚</h1>
          <p>Manage your transport activities and track your deliveries</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>{stats.totalTransports}</h3>
                <p>Total Transports</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.completedTransports}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>{stats.pendingTransports}</h3>
                <p>Pending</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>₹{stats.totalEarnings}</h3>
                <p>Total Earnings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="action-card"
                style={{ background: action.color }}
                onClick={action.action}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <h4>Food donation delivered to Hope Orphanage</h4>
                <p>2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📦</div>
              <div className="activity-content">
                <h4>New transport request: Clothes donation</h4>
                <p>4 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💰</div>
              <div className="activity-content">
                <h4>Payment received for transport #1234</h4>
                <p>1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <h2>Transport Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🕒</div>
              <h4>Timely Delivery</h4>
              <p>Always deliver within the specified time window to maintain trust with facilities.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📱</div>
              <h4>Stay Connected</h4>
              <p>Keep your phone charged and respond promptly to facility coordinators.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📋</div>
              <h4>Document Everything</h4>
              <p>Take photos and get signatures for all deliveries for proper record keeping.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterDashboard; 