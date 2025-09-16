import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const initialVolunteer = {
  name: "",
  phone: "",
  vehicle: "",
  route: "",
  isVolunteer: true,
};

const initialPaid = {
  name: "",
  phone: "",
  vehicle: "",
  route: "",
  chargePerTrip: "",
  isVolunteer: false,
};

const formStyles = {
  container: {
    maxWidth: 480,
    margin: "3rem auto",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: 24,
    boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
    padding: "40px 32px 32px 32px",
    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
    animation: "slideInUp 0.6s ease-out",
  },
  containerBefore: {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    borderRadius: 24,
    zIndex: 1,
  },
  tabs: {
    display: "flex",
    marginBottom: 32,
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    position: "relative",
    zIndex: 2,
  },
  tab: (active) => ({
    flex: 1,
    border: "none",
    background: active
      ? "linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%)"
      : "transparent",
    color: active ? "#fff" : "rgba(255, 255, 255, 0.8)",
    padding: "1rem 0",
    borderRadius: "16px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1.1rem",
    letterSpacing: "0.5px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: active ? "0 4px 15px rgba(255, 107, 107, 0.4)" : "none",
    position: "relative",
    overflow: "hidden",
  }),
  tabHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(255, 107, 107, 0.3)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "32px 24px 24px 24px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    marginTop: -4,
    position: "relative",
    zIndex: 2,
    animation: "fadeInUp 0.8s ease-out 0.2s both",
  },
  heading: {
    marginBottom: 16,
    color: "#2c3e50",
    textAlign: "center",
    fontWeight: 700,
    letterSpacing: 1,
    fontSize: "1.4rem",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  headingAfter: {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: "translateX(-50%)",
    width: 60,
    height: 3,
    background: "linear-gradient(90deg, #ff6b6b, #ee5a24)",
    borderRadius: 2,
  },
  inputGroup: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: "16px 20px",
    border: "2px solid #e1e8ed",
    borderRadius: 12,
    fontSize: "1rem",
    background: "#f8fafc",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    position: "relative",
  },
  inputFocus: {
    borderColor: "#667eea",
    background: "#fff",
    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.15)",
    transform: "translateY(-2px)",
  },
  inputLabel: {
    position: "absolute",
    top: "-8px",
    left: "12px",
    background: "#fff",
    padding: "0 8px",
    fontSize: "0.75rem",
    color: "#667eea",
    fontWeight: 600,
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    zIndex: 10,
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e1e8ed",
  },
  inputLabelFocus: {
    color: "#667eea",
    borderColor: "#667eea",
    boxShadow: "0 2px 6px rgba(102, 126, 234, 0.2)",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "16px 0",
    fontSize: "1.1rem",
    fontWeight: 600,
    marginTop: 12,
    cursor: "pointer",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    letterSpacing: "0.5px",
    position: "relative",
    overflow: "hidden",
  },
  submitBtnHover: {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
  },
  submitBtnActive: {
    transform: "translateY(-1px)",
  },
  submitBtnBefore: {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.5s",
  },
  submitBtnHoverBefore: {
    left: "100%",
  },
  floatingAnimation: {
    animation: "float 6s ease-in-out infinite",
  },
  pulseAnimation: {
    animation: "pulse 2s infinite",
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  .input-focus {
    border-color: #667eea !important;
    background: #fff !important;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15) !important;
    transform: translateY(-2px) !important;
  }
  
  .tab-active {
    background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%) !important;
    color: #fff !important;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4) !important;
  }
  
  .submit-btn-hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4) !important;
  }
`;
document.head.appendChild(styleSheet);

const TransporterRegister = () => {
  const [tab, setTab] = useState("volunteer");
  const [volunteer, setVolunteer] = useState(initialVolunteer);
  const [paid, setPaid] = useState(initialPaid);
  const [loggedIn, setLoggedIn] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [focusedInput, setFocusedInput] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const requestFromLocation = location.state?.request || null;
  const [showStatusButtons, setShowStatusButtons] = useState(false);
  const [transportStatus, setTransportStatus] = useState("");

  // Pre-fill form with basic info from localStorage if available
  useEffect(() => {
    const transporterBasicInfo = localStorage.getItem('transporterBasicInfo');
    if (transporterBasicInfo) {
      const basicInfo = JSON.parse(transporterBasicInfo);
      setVolunteer(prev => ({
        ...prev,
        name: basicInfo.name || "",
        phone: basicInfo.phone || ""
      }));
      setPaid(prev => ({
        ...prev,
        name: basicInfo.name || "",
        phone: basicInfo.phone || ""
      }));
      // Clear the localStorage after using it
      localStorage.removeItem('transporterBasicInfo');
    }
  }, []);

  // Fetch requests after login/register
  useEffect(() => {
    if (loggedIn) {
      axios
        .get("/api/donations/pending")
        .then((res) =>
          Array.isArray(res.data) ? setRequests(res.data) : setRequests([])
        )
        .catch(() => setRequests([]));
    }
  }, [loggedIn]);

  // Handle Volunteer Register/Login
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/transporters/register",
        volunteer
      );
      // Store transporter data in localStorage
      const transporterData = {
        ...volunteer,
        id: response.data._id || response.data.id,
        role: 'transporter'
      };
      localStorage.setItem('userData', JSON.stringify(transporterData));
      localStorage.setItem('token', response.data.token || 'transporter-token');
      setLoggedIn(true);
    } catch (error) {
      console.error('Registration failed:', error);
      alert("Registration failed.");
    }
  };

  // Handle Paid Register/Login
  const handlePaidSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/transporters/register", paid);
      // Store transporter data in localStorage
      const transporterData = {
        ...paid,
        id: response.data._id || response.data.id,
        role: 'transporter'
      };
      localStorage.setItem('userData', JSON.stringify(transporterData));
      localStorage.setItem('token', response.data.token || 'transporter-token');
      setLoggedIn(true);
    } catch (error) {
      console.error('Registration failed:', error);
      alert("Registration failed.");
    }
  };

  // After registration, show status buttons if a request was selected
  useEffect(() => {
    if (loggedIn && requestFromLocation) {
      setSelectedRequest(requestFromLocation);
      setShowStatusButtons(true);
      setTransportStatus(requestFromLocation.status || "pending");
    }
  }, [loggedIn, requestFromLocation]);

  // Handler for marking as delivered
  const handleMarkDelivered = async () => {
    try {
      await axios.put(
        `/donations/${selectedRequest._id}/status`,
        { status: "delivered" }
      );
      setTransportStatus("delivered");
      alert("Transport marked as delivered!");
    } catch {
      alert("Failed to update status.");
    }
  };

  // Handler for not delivered (keep as pending)
  const handleNotDelivered = () => {
    alert("Transport not delivered. Status remains pending.");
  };

  // Show status buttons after registration and request selection
  if (loggedIn && selectedRequest) {
    return (
      <div
        style={{
          maxWidth: 500,
          margin: "2rem auto",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 20,
          padding: 32,
          color: "white",
          boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
          animation: "slideInUp 0.6s ease-out",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{ 
            marginBottom: 16,
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          ← Back
        </button>
        <h2 style={{ marginBottom: 24, textAlign: "center" }}>Transport Request Details</h2>
        <div style={{ background: "rgba(255, 255, 255, 0.1)", padding: 24, borderRadius: 12, marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <strong>Donor:</strong> {selectedRequest.donorName}
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong>Pickup Location:</strong> {selectedRequest.donorLocation}
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong>Destination:</strong> {selectedRequest.facilityName} (
            {selectedRequest.facilityAddress})
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong>Donation Type:</strong> {selectedRequest.type}
          </div>
          <div>
            <strong>Details:</strong>{" "}
            {selectedRequest.quantity}{" "}
            {selectedRequest.foodType ||
              selectedRequest.clothesType ||
              selectedRequest.bookType ||
              selectedRequest.kitType ||
              ""}
          </div>
        </div>
        {showStatusButtons && (
          <div style={{ textAlign: "center" }}>
            {transportStatus !== "delivered" ? (
              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                <button
                  style={{
                    background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                    color: "#fff",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)"
                  }}
                  onClick={handleMarkDelivered}
                >
                  Transport Delivered
                </button>
                <button
                  style={{
                    background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                    color: "#fff",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)"
                  }}
                  onClick={handleNotDelivered}
                >
                  Not Delivered
                </button>
              </div>
            ) : (
              <div
                style={{
                  color: "#10b981",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  background: "rgba(16, 185, 129, 0.2)",
                  padding: "16px",
                  borderRadius: 12,
                  border: "2px solid #10b981"
                }}
              >
                ✓ Delivered Successfully
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Show requests as cards after login/register
  if (loggedIn) {
    return (
      <div style={{ 
        maxWidth: 800, 
        margin: "3rem auto",
        animation: "slideInUp 0.6s ease-out"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: 32,
          color: "#2c3e50",
          fontSize: "2rem",
          fontWeight: 700
        }}>Available Transport Requests</h2>
        {requests.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: 48,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 20,
            color: "white",
            fontSize: "1.2rem"
          }}>
            No requests available at the moment.
          </div>
        )}
        <div style={{ display: "grid", gap: 20 }}>
          {requests.map((req, index) => (
            <div
              key={req._id}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 16,
                padding: 24,
                cursor: "pointer",
                color: "white",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 25px rgba(102, 126, 234, 0.2)",
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.2)";
              }}
              onClick={() => setSelectedRequest(req)}
            >
              <div style={{ marginBottom: 8 }}>
                <strong>Donor:</strong> {req.donorName}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Pickup Location:</strong> {req.donorLocation}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Destination:</strong> {req.facilityName} (
                {req.facilityAddress})
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Donation Type:</strong> {req.type}
              </div>
              <div>
                <strong>Details:</strong>{" "}
                {req.quantity}{" "}
                {req.foodType ||
                  req.clothesType ||
                  req.bookType ||
                  req.kitType ||
                  ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show registration/login form
  return (
    <div style={formStyles.container}>
      <div style={formStyles.containerBefore}></div>
      
      {/* Back button */}
      <button
        onClick={() => navigate('/register')}
        style={{ 
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(255, 255, 255, 0.2)",
          border: "none",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255, 255, 255, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255, 255, 255, 0.2)";
        }}
      >
        ← Back to Registration
      </button>
      
      <div style={formStyles.tabs}>
        <button
          style={{
            ...formStyles.tab(tab === "volunteer"),
            ...(tab === "volunteer" ? formStyles.tabHover : {})
          }}
          className={tab === "volunteer" ? "tab-active" : ""}
          onClick={() => setTab("volunteer")}
        >
          Volunteer (Free)
        </button>
        <button
          style={{
            ...formStyles.tab(tab === "paid"),
            ...(tab === "paid" ? formStyles.tabHover : {})
          }}
          className={tab === "paid" ? "tab-active" : ""}
          onClick={() => setTab("paid")}
        >
          Paid Transporter
        </button>
      </div>

      {tab === "volunteer" && (
        <form style={formStyles.form} onSubmit={handleVolunteerSubmit}>
          <h3 style={formStyles.heading}>
            Volunteer Transporter Registration
            <div style={formStyles.headingAfter}></div>
          </h3>
          
          <div style={formStyles.inputGroup}>
            <label 
              style={{
                ...formStyles.inputLabel,
                ...(focusedInput === "name" ? formStyles.inputLabelFocus : {})
              }}
            >
              Name
            </label>
            <input
              name="name"
              placeholder="Enter your full name"
              value={volunteer.name}
              onChange={(e) =>
                setVolunteer({ ...volunteer, name: e.target.value })
              }
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput("")}
              required
              style={{
                ...formStyles.input,
                ...(focusedInput === "name" ? formStyles.inputFocus : {})
              }}
              className={focusedInput === "name" ? "input-focus" : ""}
            />
          </div>
          
          <div style={formStyles.inputGroup}>
            <label 
              style={{
                ...formStyles.inputLabel,
                ...(focusedInput === "phone" ? formStyles.inputLabelFocus : {})
              }}
            >
              Phone
            </label>
            <input
              name="phone"
              placeholder="Enter your phone number"
              value={volunteer.phone}
              onChange={(e) =>
                setVolunteer({ ...volunteer, phone: e.target.value })
              }
              onFocus={() => setFocusedInput("phone")}
              onBlur={() => setFocusedInput("")}
              required
              style={{
                ...formStyles.input,
                ...(focusedInput === "phone" ? formStyles.inputFocus : {})
              }}
              className={focusedInput === "phone" ? "input-focus" : ""}
            />
          </div>
          
          <div style={formStyles.inputGroup}>
            <label 
              style={{
                ...formStyles.inputLabel,
                ...(focusedInput === "vehicle" ? formStyles.inputLabelFocus : {})
              }}
            >
              Vehicle
            </label>
            <input
              name="vehicle"
              placeholder="Type of vehicle (e.g., Car, Bike, Van)"
              value={volunteer.vehicle}
              onChange={(e) =>
                setVolunteer({ ...volunteer, vehicle: e.target.value })
              }
              onFocus={() => setFocusedInput("vehicle")}
              onBlur={() => setFocusedInput("")}
              required
              style={{
                ...formStyles.input,
                ...(focusedInput === "vehicle" ? formStyles.inputFocus : {})
              }}
              className={focusedInput === "vehicle" ? "input-focus" : ""}
            />
          </div>
          
          <div style={formStyles.inputGroup}>
            <label 
              style={{
                ...formStyles.inputLabel,
                ...(focusedInput === "route" ? formStyles.inputLabelFocus : {})
              }}
            >
              Route
            </label>
            <input
              name="route"
              placeholder="Route (e.g. Chennai - Anna Nagar)"
              value={volunteer.route}
              onChange={(e) =>
                setVolunteer({ ...volunteer, route: e.target.value })
              }
              onFocus={() => setFocusedInput("route")}
              onBlur={() => setFocusedInput("")}
              required
              style={{
                ...formStyles.input,
                ...(focusedInput === "route" ? formStyles.inputFocus : {})
              }}
              className={focusedInput === "route" ? "input-focus" : ""}
            />
          </div>
          
          <button 
            type="submit" 
            style={formStyles.submitBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 12px 35px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)";
            }}
            className="submit-btn-hover"
          >
            Register as Volunteer
          </button>
        </form>
      )}

      {tab === "paid" && (
        <form style={formStyles.form} onSubmit={handlePaidSubmit}>
          <h3 style={formStyles.heading}>
            Paid Transporter Registration
            <div style={formStyles.headingAfter}></div>
          </h3>
          
          <div style={formStyles.inputGroup}>
            <label 
              style={{
                ...formStyles.inputLabel,
                ...(focusedInput === "paidName" ? formStyles.inputLabelFocus : {})
              }}
            >
              Name
            </label>
            <input
              name="name"
              placeholder="Enter your full name"
              value={paid.name}
              onChange={(e) => setPaid({ ...paid, name: e.target.value })}
              onFocus={() => setFocusedInput("paidName")}
              onBlur={() => setFocusedInput("")}
              required
              style={{
                ...formStyles.input,
                ...(focusedInput === "paidName" ? formStyles.inputFocus : {})
              }}
              className={focusedInput === "paidName" ? "input-focus" : ""}
            />
          </div>
          
          <div style={formStyles.inputGroup}>
            <label 
              style={{
                ...formStyles.inputLabel,
                ...(focusedInput === "paidPhone" ? formStyles.inputLabelFocus : {})
              }}
            >
              Phone
            </label>
            <input
              name="phone"
              placeholder="Enter your phone number"
              value={paid.phone}
              onChange={(e) => setPaid({ ...paid, phone: e.target.value })}
              onFocus={() => setFocusedInput("paidPhone")}
              onBlur={() => setFocusedInput("")}
              required
              style={{
                ...formStyles.input,
                ...(focusedInput === "paidPhone" ? formStyles.inputFocus : {})
              }}
              className={focusedInput === "paidPhone" ? "input-focus" : ""}
            />
          </div>
          
          <div style={formStyles.inputGroup}>
            <label 
              style={{
                ...formStyles.inputLabel,
                ...(focusedInput === "paidVehicle" ? formStyles.inputLabelFocus : {})
              }}
            >
              Vehicle
            </label>
            <input
              name="vehicle"
              placeholder="Type of vehicle (e.g., Car, Bike, Van)"
              value={paid.vehicle}
              onChange={(e) => setPaid({ ...paid, vehicle: e.target.value })}
              onFocus={() => setFocusedInput("paidVehicle")}
              onBlur={() => setFocusedInput("")}
              required
              style={{
                ...formStyles.input,
                ...(focusedInput === "paidVehicle" ? formStyles.inputFocus : {})
              }}
              className={focusedInput === "paidVehicle" ? "input-focus" : ""}
            />
          </div>
          
          <div style={formStyles.inputGroup}>
            <label 
              style={{
                ...formStyles.inputLabel,
                ...(focusedInput === "paidRoute" ? formStyles.inputLabelFocus : {})
              }}
            >
              Route
            </label>
            <input
              name="route"
              placeholder="Route (e.g. Chennai - Anna Nagar)"
              value={paid.route}
              onChange={(e) => setPaid({ ...paid, route: e.target.value })}
              onFocus={() => setFocusedInput("paidRoute")}
              onBlur={() => setFocusedInput("")}
              required
              style={{
                ...formStyles.input,
                ...(focusedInput === "paidRoute" ? formStyles.inputFocus : {})
              }}
              className={focusedInput === "paidRoute" ? "input-focus" : ""}
            />
          </div>
          
          <div style={formStyles.inputGroup}>
            <label 
              style={{
                ...formStyles.inputLabel,
                ...(focusedInput === "paidCharge" ? formStyles.inputLabelFocus : {})
              }}
            >
              Charge per Trip
            </label>
            <input
              name="chargePerTrip"
              placeholder="Charge per Trip (₹)"
              value={paid.chargePerTrip}
              onChange={(e) =>
                setPaid({ ...paid, chargePerTrip: e.target.value })
              }
              onFocus={() => setFocusedInput("paidCharge")}
              onBlur={() => setFocusedInput("")}
              required
              type="number"
              min="0"
              style={{
                ...formStyles.input,
                ...(focusedInput === "paidCharge" ? formStyles.inputFocus : {})
              }}
              className={focusedInput === "paidCharge" ? "input-focus" : ""}
            />
          </div>
          
          <button 
            type="submit" 
            style={formStyles.submitBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 12px 35px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)";
            }}
            className="submit-btn-hover"
          >
            Register as Paid Transporter
          </button>
        </form>
      )}
    </div>
  );
};

export default TransporterRegister;