import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const UserProfile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [donationStats, setDonationStats] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    byType: {},
    byFacility: {}
  });

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    console.log("UserProfile - Loaded userData from localStorage:", stored);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) {
          setUserData(parsed);
          const userDonations = parsed.donations || [];
          setDonations(userDonations);
          calculateDonationStats(userDonations);
        } else {
          setUserData(null);
          setDonations([]);
        }
      } catch (e) {
        setUserData(null);
        setDonations([]);
      }
    } else {
      setUserData(null);
      setDonations([]);
    }
  }, []);

  const calculateDonationStats = (donationList) => {
    const stats = {
      total: donationList.length,
      delivered: donationList.filter(d => d.status === "delivered").length,
      pending: donationList.filter(d => d.status === "pending").length,
      byType: {},
      byFacility: {}
    };

    // Calculate by donation type
    donationList.forEach(donation => {
      stats.byType[donation.type] = (stats.byType[donation.type] || 0) + 1;
      
      const facilityKey = donation.facilityName || 'Unknown Facility';
      if (!stats.byFacility[facilityKey]) {
        stats.byFacility[facilityKey] = {
          name: facilityKey,
          type: donation.facilityType || 'Unknown',
          count: 0,
          totalAmount: 0
        };
      }
      stats.byFacility[facilityKey].count += 1;
      if (donation.type === 'money' && donation.amount) {
        stats.byFacility[facilityKey].totalAmount += parseFloat(donation.amount);
      }
    });

    setDonationStats(stats);
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

  const handleSuccess = (idx) => {
    const updated = donations.map((don, i) =>
      i === idx
        ? { ...don, status: "delivered", date: new Date().toLocaleString() }
        : don
    );
    setDonations(updated);
    calculateDonationStats(updated);
    
    // Update localStorage as well:
    const userDataLS = JSON.parse(localStorage.getItem("userData"));
    userDataLS.donations = updated;
    localStorage.setItem("userData", JSON.stringify(userDataLS));
  };

  const handleDelete = (idx) => {
    const updated = donations.filter((_, i) => i !== idx);
    setDonations(updated);
    calculateDonationStats(updated);
    
    // Update localStorage as well:
    const userDataLS = JSON.parse(localStorage.getItem("userData"));
    userDataLS.donations = updated;
    localStorage.setItem("userData", JSON.stringify(userDataLS));
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    setUserData(null);
    setDonations([]);
    navigate("/register");
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
      <div className="profile-header">
        <div className="profile-avatar large">
          {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
        </div>
        <h2>{userData.name || "User"}</h2>
        <p className="user-email">{userData.email}</p>
        <div className="profile-info">
          <p>
            <strong>Phone:</strong> {userData.phone || "Not provided"}
          </p>
          <p>
            <strong>Address:</strong> {userData.address || "Not provided"}
          </p>
        </div>
      </div>

      {/* Donation Statistics */}
      <div className="donation-stats">
        <h3>Donation Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{donationStats.total}</div>
              <div className="stat-label">Total Donations</div>
            </div>
          </div>
          <div className="stat-card delivered">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{donationStats.delivered}</div>
              <div className="stat-label">Delivered</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{donationStats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Types Breakdown */}
      {Object.keys(donationStats.byType).length > 0 && (
        <div className="donation-types">
          <h3>Donations by Type</h3>
          <div className="types-grid">
            {Object.entries(donationStats.byType).map(([type, count]) => (
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

      {/* Facilities Supported */}
      {Object.keys(donationStats.byFacility).length > 0 && (
        <div className="facilities-supported">
          <h3>Facilities Supported</h3>
          <div className="facilities-grid">
            {Object.values(donationStats.byFacility).map((facility, index) => (
              <div key={index} className="facility-card">
                <div className="facility-icon">
                  {facility.type === 'orphanage' ? '🏠' : '🏡'}
                </div>
                <div className="facility-content">
                  <div className="facility-name">{facility.name}</div>
                  <div className="facility-type">{facility.type}</div>
                  <div className="facility-stats">
                    <span>Donations: {facility.count}</span>
                    {facility.totalAmount > 0 && (
                      <span>Amount: ₹{facility.totalAmount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="donation-history">
        <h3>Donation History</h3>
        {donations.length > 0 ? (
          <div className="donations-grid">
            {donations.map((donation, idx) => (
              <div 
                className="donation-card" 
                key={donation.id || idx}
                style={{ borderLeft: `4px solid ${getDonationColor(donation.type).split(',')[0].replace('linear-gradient(135deg, #', '#')}` }}
              >
                <div className="donation-header">
                  <div className="donation-type-info">
                    <span className="donation-icon">{getDonationIcon(donation.type)}</span>
                    <span className="donation-facility">
                      {donation.facilityName}{" "}
                      {donation.facilityType ? `(${donation.facilityType})` : ""}
                    </span>
                  </div>
                  <span
                    className={`status ${
                      donation.status === "delivered" ? "delivered" : "pending"
                    }`}
                  >
                    {donation.status === "delivered" ? "✅ Delivered" : "⏳ Pending"}
                  </span>
                </div>
                <div className="donation-details">
                  <div className="detail-row">
                    <strong>Type:</strong> {donation.type.charAt(0).toUpperCase() + donation.type.slice(1)}
                  </div>
                  <div className="detail-row">
                    <strong>Date:</strong>{" "}
                    {donation.status === "delivered" && donation.date
                      ? donation.date
                      : "Pending delivery"}
                  </div>
                  {/* Show details based on donation type */}
                  {donation.type === "money" && (
                    <>
                      <div className="detail-row">
                        <strong>Amount:</strong> ₹{donation.amount}
                      </div>
                      <div className="detail-row">
                        <strong>Purpose:</strong> {donation.purpose}
                      </div>
                      <div className="detail-row">
                        <strong>Payment Mode:</strong> {donation.paymentMode}
                      </div>
                    </>
                  )}
                  {donation.type === "food" && (
                    <>
                      <div className="detail-row">
                        <strong>Food Type:</strong> {donation.foodType}
                      </div>
                      <div className="detail-row">
                        <strong>Quantity:</strong> {donation.quantity}
                      </div>
                      <div className="detail-row">
                        <strong>Pickup Date:</strong> {donation.pickupDate}
                      </div>
                    </>
                  )}
                  {donation.type === "clothes" && (
                    <>
                      <div className="detail-row">
                        <strong>Clothes Type:</strong> {donation.clothesType}
                      </div>
                      <div className="detail-row">
                        <strong>Quantity:</strong> {donation.quantity}
                      </div>
                      <div className="detail-row">
                        <strong>Condition:</strong> {donation.condition}
                      </div>
                    </>
                  )}
                  {donation.type === "books" && (
                    <>
                      <div className="detail-row">
                        <strong>Book Type:</strong> {donation.bookType}
                      </div>
                      <div className="detail-row">
                        <strong>Quantity:</strong> {donation.quantity}
                      </div>
                      <div className="detail-row">
                        <strong>Language:</strong> {donation.language}
                      </div>
                    </>
                  )}
                  {donation.type === "health" && (
                    <>
                      <div className="detail-row">
                        <strong>Kit Type:</strong> {donation.kitType}
                      </div>
                      <div className="detail-row">
                        <strong>Quantity:</strong> {donation.quantity}
                      </div>
                      <div className="detail-row">
                        <strong>Expiry Date:</strong> {donation.expiryDate}
                      </div>
                    </>
                  )}
                </div>
                <div className="donation-actions">
                  {donation.status !== "delivered" && (
                    <>
                      <button
                        className="status-btn success"
                        onClick={() => handleSuccess(idx)}
                      >
                        Mark as Delivered
                      </button>
                      <button className="status-btn pending" disabled>
                        Pending
                      </button>
                    </>
                  )}
                  {donation.status === "delivered" && (
                    <button className="status-btn success" disabled>
                      ✅ Delivered
                    </button>
                  )}
                  <button
                    className="status-btn delete"
                    onClick={() => handleDelete(idx)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-donations">
            <div className="empty-icon">📦</div>
            <h4>No donations made yet</h4>
            <p>Start making a difference by donating to orphanages and old age homes!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
