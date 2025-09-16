import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransporterNavbar from "./TransporterNavbar";
import "../styles/profile.css";

const TransporterProfile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transportHistory, setTransportHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [transportStats, setTransportStats] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    byType: {},
    byFacility: {}
  });

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    console.log("TransporterProfile - Loaded userData from localStorage:", stored);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) {
          setUserData(parsed);
          // For transporters, we'll simulate transport history
          // In a real app, this would come from the backend
          const mockTransportHistory = [
            {
              id: 1,
              facilityName: "Hope Orphanage",
              facilityType: "orphanage",
              donationType: "food",
              status: "delivered",
              date: "2024-01-15",
              route: "Chennai - Anna Nagar"
            },
            {
              id: 2,
              facilityName: "Peace Old Age Home",
              facilityType: "oldagehome",
              donationType: "clothes",
              status: "pending",
              date: "2024-01-20",
              route: "Chennai - T Nagar"
            }
          ];
          setTransportHistory(mockTransportHistory);
          calculateTransportStats(mockTransportHistory);
        } else {
          setUserData(null);
          setTransportHistory([]);
        }
      } catch (e) {
        setUserData(null);
        setTransportHistory([]);
      }
    } else {
      setUserData(null);
      setTransportHistory([]);
    }
  }, []);

  const calculateTransportStats = (transportList) => {
    const stats = {
      total: transportList.length,
      delivered: transportList.filter(t => t.status === "delivered").length,
      pending: transportList.filter(t => t.status === "pending").length,
      byType: {},
      byFacility: {}
    };

    // Calculate by donation type
    transportList.forEach(transport => {
      stats.byType[transport.donationType] = (stats.byType[transport.donationType] || 0) + 1;
      
      const facilityKey = transport.facilityName || 'Unknown Facility';
      if (!stats.byFacility[facilityKey]) {
        stats.byFacility[facilityKey] = {
          name: facilityKey,
          type: transport.facilityType || 'Unknown',
          count: 0
        };
      }
      stats.byFacility[facilityKey].count += 1;
    });

    setTransportStats(stats);
  };

  // If no userData, redirect to login/register after a short delay
  useEffect(() => {
    if (userData === null) {
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [userData, navigate]);

  const handleMarkDelivered = (idx) => {
    const updated = transportHistory.map((transport, i) =>
      i === idx
        ? { ...transport, status: "delivered", date: new Date().toLocaleString() }
        : transport
    );
    setTransportHistory(updated);
    calculateTransportStats(updated);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    setUserData(null);
    setTransportHistory([]);
    navigate("/register");
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getDonationIcon = (type) => {
    const icons = {
      money: "💰",
      food: "🍜",
      clothes: "👕",
      books: "📚",
      health: "⚕️"
    };
    return icons[type] || "📦";
  };

  const getDonationColor = (type) => {
    const colors = {
      money: "linear-gradient(135deg, #10b981, #34d399)",
      food: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      clothes: "linear-gradient(135deg, #3b82f6, #60a5fa)",
      books: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
      health: "linear-gradient(135deg, #ef4444, #f87171)"
    };
    return colors[type] || "linear-gradient(135deg, #6b7280, #9ca3af)";
  };

  if (!userData) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>No user data found. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <TransporterNavbar onMenuClick={handleMenuClick} />
      <div className="profile-header">
        <div className="profile-avatar large">
          {userData.name ? userData.name.charAt(0).toUpperCase() : "T"}
        </div>
        <h2>{userData.name || "Transporter"}</h2>
        <p className="user-email">{userData.email || "transporter@example.com"}</p>
        <div className="profile-info">
          <p>
            <strong>Phone:</strong> {userData.phone || "Not provided"}
          </p>
          <p>
            <strong>Vehicle:</strong> {userData.vehicle || "Not provided"}
          </p>
          <p>
            <strong>Route:</strong> {userData.route || "Not provided"}
          </p>
          <p>
            <strong>Type:</strong> {userData.isVolunteer ? "Volunteer" : "Paid Transporter"}
          </p>
          {!userData.isVolunteer && userData.chargePerTrip && (
            <p>
              <strong>Charge per Trip:</strong> ₹{userData.chargePerTrip}
            </p>
          )}
        </div>
      </div>

      {/* Transport Statistics */}
      <div className="donation-stats">
        <h3>Transport Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">🚚</div>
            <div className="stat-content">
              <div className="stat-number">{transportStats.total}</div>
              <div className="stat-label">Total Transports</div>
            </div>
          </div>
          <div className="stat-card delivered">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{transportStats.delivered}</div>
              <div className="stat-label">Delivered</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{transportStats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transport Types Breakdown */}
      {Object.keys(transportStats.byType).length > 0 && (
        <div className="donation-types">
          <h3>Transports by Donation Type</h3>
          <div className="types-grid">
            {Object.entries(transportStats.byType).map(([type, count]) => (
              <div 
                key={type} 
                className="type-card"
                style={{ background: getDonationColor(type) }}
              >
                <div className="type-icon">{getDonationIcon(type)}</div>
                <div className="type-content">
                  <div className="type-name">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                  <div className="type-count">{count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facilities Served */}
      {Object.keys(transportStats.byFacility).length > 0 && (
        <div className="facilities-supported">
          <h3>Facilities Served</h3>
          <div className="facilities-grid">
            {Object.values(transportStats.byFacility).map((facility, index) => (
              <div key={index} className="facility-card">
                <div className="facility-icon">
                  {facility.type === 'orphanage' ? '🏠' : '🏡'}
                </div>
                <div className="facility-content">
                  <div className="facility-name">{facility.name}</div>
                  <div className="facility-type">{facility.type}</div>
                  <div className="facility-stats">
                    <span>Transports: {facility.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="donation-history">
        <h3>Transport History</h3>
        {transportHistory.length > 0 ? (
          <div className="donations-grid">
            {transportHistory.map((transport, idx) => (
              <div 
                className="donation-card" 
                key={transport.id || idx}
                style={{ borderLeft: `4px solid ${getDonationColor(transport.donationType).split(',')[0].replace('linear-gradient(135deg, #', '#')}` }}
              >
                <div className="donation-header">
                  <div className="donation-type-info">
                    <span className="donation-icon">{getDonationIcon(transport.donationType)}</span>
                    <span className="donation-facility">
                      {transport.facilityName}{" "}
                      {transport.facilityType ? `(${transport.facilityType})` : ""}
                    </span>
                  </div>
                  <span
                    className={`status ${
                      transport.status === "delivered" ? "delivered" : "pending"
                    }`}
                  >
                    {transport.status === "delivered" ? "✅ Delivered" : "⏳ Pending"}
                  </span>
                </div>
                <div className="donation-details">
                  <div className="detail-row">
                    <strong>Donation Type:</strong> {transport.donationType.charAt(0).toUpperCase() + transport.donationType.slice(1)}
                  </div>
                  <div className="detail-row">
                    <strong>Route:</strong> {transport.route}
                  </div>
                  <div className="detail-row">
                    <strong>Date:</strong>{" "}
                    {transport.status === "delivered" && transport.date
                      ? transport.date
                      : "Pending delivery"}
                  </div>
                </div>
                <div className="donation-actions">
                  {transport.status !== "delivered" && (
                    <>
                      <button
                        className="status-btn success"
                        onClick={() => handleMarkDelivered(idx)}
                      >
                        Mark as Delivered
                      </button>
                      <button className="status-btn pending" disabled>
                        Pending
                      </button>
                    </>
                  )}
                  {transport.status === "delivered" && (
                    <button className="status-btn success" disabled>
                      ✅ Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-donations">
            <div className="empty-icon">🚚</div>
            <h4>No transport history yet</h4>
            <p>Start transporting donations to make a difference!</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button 
          className="action-btn primary"
          onClick={() => navigate('/transport-requests')}
        >
          View Transport Requests
        </button>
        <button 
          className="action-btn secondary"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TransporterProfile; 