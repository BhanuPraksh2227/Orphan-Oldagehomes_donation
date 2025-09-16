import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TransporterNavbar from "../components/TransporterNavbar";
import "../styles/transportRequests.css";

const TransportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/donations/pending")
      .then(res => setRequests(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRequests([]));
  }, []);

  // Delete handler
  const handleDelete = async (donationId) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await api.delete(`/donations/${donationId}`);
      setRequests(requests.filter(d => d._id !== donationId));
    } catch {
      alert("Failed to delete request.");
    }
  };

  // Mark as delivered handler
  const handleMarkDelivered = async (donationId) => {
    if (!window.confirm("Are you sure you want to mark this donation as delivered?")) return;
    try {
      await api.put(`/donations/${donationId}/status`, { status: "delivered" });
      // Update the local state to reflect the change
      setRequests(requests.map(d => 
        d._id === donationId ? { ...d, status: "delivered" } : d
      ));
      alert("Donation marked as delivered successfully!");
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to mark as delivered. Please try again.");
    }
  };

  // Transport handler
  const handleTransport = (donation) => {
    navigate('/transporter-register', { 
      state: { request: donation } 
    });
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get gradient color based on donation type
  const getDonationGradient = (type) => {
    const gradients = {
      money: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      food: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      clothes: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      books: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      health: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    };
    return gradients[type] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  };

  // Get icon based on donation type
  const getDonationIcon = (type) => {
    const icons = {
      money: "💰",
      food: "🍽️",
      clothes: "👕",
      books: "📚",
      health: "💊"
    };
    return icons[type] || "📦";
  };

  return (
    <div className="transport-requests-container">
      <TransporterNavbar onMenuClick={handleMenuClick} />
      <div className="requests-header">
        <h1 className="animated-title">
          <span className="gradient-text">Available Transport Requests</span>
        </h1>
        <p className="subtitle">Manage and track donation deliveries</p>
      </div>

      {requests.length > 0 ? (
        <div className="requests-grid">
          {requests.map((donation, idx) => (
            <div 
              className="request-card animated-card"
              key={donation._id || idx}
              style={{
                background: getDonationGradient(donation.type),
                animationDelay: `${idx * 0.1}s`
              }}
            >
              <div className="card-header">
                <div className="donation-type">
                  <span className="type-icon">{getDonationIcon(donation.type)}</span>
                  <span className="type-text">{donation.type.toUpperCase()}</span>
                </div>
                <span
                  className={`status-badge ${
                    donation.status === "delivered" ? "delivered" : "pending"
                  }`}
                >
                  {donation.status === "delivered" ? "✅ Delivered" : "⏳ Pending"}
                </span>
              </div>

              <div className="card-content">
                <div className="facility-info">
                  <h3 className="facility-name">
                     {donation.facilityName}
                    {donation.facilityType && (
                      <span className="facility-type"> ({donation.facilityType})</span>
                    )}
                  </h3>
                </div>

                <div className="donation-details">
                  {donation.type === "money" && (
                    <div className="detail-item money-detail">
                      <span className="detail-label">💰 Amount:</span>
                      <span className="detail-value">₹{donation.amount}</span>
                    </div>
                  )}
                  
                  {donation.type === "food" && (
                    <div className="detail-item">
                      <span className="detail-label">🍽️ Food Type:</span>
                      <span className="detail-value">{donation.foodType}</span>
                    </div>
                  )}
                  
                  {donation.type === "clothes" && (
                    <div className="detail-item">
                      <span className="detail-label">👕 Clothes Type:</span>
                      <span className="detail-value">{donation.clothesType}</span>
                    </div>
                  )}
                  
                  {donation.type === "books" && (
                    <div className="detail-item">
                      <span className="detail-label">📚 Book Type:</span>
                      <span className="detail-value">{donation.bookType}</span>
                    </div>
                  )}
                  
                  {donation.type === "health" && (
                    <div className="detail-item">
                      <span className="detail-label">💊 Kit Type:</span>
                      <span className="detail-value">{donation.kitType}</span>
                    </div>
                  )}

                  <div className="detail-item">
                    <span className="detail-label">📦 Quantity:</span>
                    <span className="detail-value">{donation.quantity}</span>
                  </div>

                  {donation.pickupDate && (
                    <div className="detail-item">
                      <span className="detail-label">📅 Pickup Date:</span>
                      <span className="detail-value">{donation.pickupDate}</span>
                    </div>
                  )}

                  {donation.purpose && (
                    <div className="detail-item">
                      <span className="detail-label">🎯 Purpose:</span>
                      <span className="detail-value">{donation.purpose}</span>
                    </div>
                  )}

                  {donation.paymentMode && (
                    <div className="detail-item">
                      <span className="detail-label">💳 Payment Mode:</span>
                      <span className="detail-value">{donation.paymentMode}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(donation._id)}
                >
                  🗑️ Delete
                </button>
                <button
                  className="action-btn transport-btn"
                  onClick={() => handleTransport(donation)}
                >
                  🚚 Transport
                </button>
                {donation.status !== "delivered" && (
                  <button
                    className="action-btn delivered-btn"
                    onClick={() => handleMarkDelivered(donation._id)}
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.3)";
                    }}
                  >
                    ✅ Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-requests">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No Transport Requests Available</h3>
            <p>There are currently no pending donation requests for transport.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportRequests;