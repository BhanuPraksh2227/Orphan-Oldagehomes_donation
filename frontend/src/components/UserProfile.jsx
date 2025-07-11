import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const UserProfile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    console.log("UserProfile - Loaded userData from localStorage:", stored);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) {
          setUserData(parsed);
          setDonations(parsed.donations || []);
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
    // Update localStorage as well:
    const userDataLS = JSON.parse(localStorage.getItem("userData"));
    userDataLS.donations = updated;
    localStorage.setItem("userData", JSON.stringify(userDataLS));
  };

  const handleDelete = (idx) => {
    const updated = donations.filter((_, i) => i !== idx);
    setDonations(updated);
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

  if (!userData) {
    return (
      <div className="profile-loading">
        No user data found. Redirecting to login...
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>{userData.name || "User"}</h2>
        <p>{userData.email}</p>
        <div className="profile-info">
          <p>
            <strong>Phone:</strong> {userData.phone || "Not provided"}
          </p>
          <p>
            <strong>Address:</strong> {userData.address || "Not provided"}
          </p>
        </div>
        <button className="profile-dropdown-toggle" onClick={toggleDropdown}>
          {showDropdown ? "▲" : "▼"}
        </button>
      </div>

      {showDropdown && (
        <div className="profile-dropdown">
          <div className="profile-name">{userData.name}</div>
          <div className="profile-email">{userData.email}</div>
          <button className="profile-action" onClick={logout}>
            Logout
          </button>
        </div>
      )}

      <div className="donation-history">
        <h4>Donation History</h4>
        {donations.length > 0 ? (
          <div className="donations-grid">
            {donations.map((donation, idx) => (
              <div className="donation-card" key={donation.id || idx}>
                <div className="donation-header">
                  <span className="donation-facility">
                    {donation.facilityName}{" "}
                    {donation.facilityType
                      ? `(${donation.facilityType})`
                      : ""}
                  </span>
                  <span
                    className={`status ${
                      donation.status === "delivered" ? "delivered" : "pending"
                    }`}
                  >
                    {donation.status === "delivered" ? "Delivered" : "Pending"}
                  </span>
                </div>
                <div className="donation-details">
                  <div>
                    <strong>Type:</strong> {donation.type}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {donation.status === "delivered" && donation.date
                      ? donation.date
                      : ""}
                  </div>
                  {/* Show details based on donation type */}
                  {donation.type === "money" && (
                    <>
                      <div>
                        <strong>Amount:</strong> ₹{donation.amount}
                      </div>
                      <div>
                        <strong>Purpose:</strong> {donation.purpose}
                      </div>
                      <div>
                        <strong>Payment Mode:</strong> {donation.paymentMode}
                      </div>
                    </>
                  )}
                  {donation.type === "food" && (
                    <>
                      <div>
                        <strong>Food Type:</strong> {donation.foodType}
                      </div>
                      <div>
                        <strong>Quantity:</strong> {donation.quantity}
                      </div>
                      <div>
                        <strong>Pickup Date:</strong> {donation.pickupDate}
                      </div>
                    </>
                  )}
                  {donation.type === "clothes" && (
                    <>
                      <div>
                        <strong>Clothes Type:</strong> {donation.clothesType}
                      </div>
                      <div>
                        <strong>Quantity:</strong> {donation.quantity}
                      </div>
                      <div>
                        <strong>Condition:</strong> {donation.condition}
                      </div>
                    </>
                  )}
                  {donation.type === "books" && (
                    <>
                      <div>
                        <strong>Book Type:</strong> {donation.bookType}
                      </div>
                      <div>
                        <strong>Quantity:</strong> {donation.quantity}
                      </div>
                      <div>
                        <strong>Language:</strong> {donation.language}
                      </div>
                    </>
                  )}
                  {donation.type === "health" && (
                    <>
                      <div>
                        <strong>Kit Type:</strong> {donation.kitType}
                      </div>
                      <div>
                        <strong>Quantity:</strong> {donation.quantity}
                      </div>
                      <div>
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
                      Delivered
                    </button>
                  )}
                  <button
                    className="status-btn delete"
                    onClick={() => handleDelete(idx)}
                    style={{ background: "#ef4444", marginLeft: "auto" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-donations">No donations made yet</div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
