import React, { useState, useEffect } from "react";
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

const TransporterRegister = () => {
  const [tab, setTab] = useState("volunteer");
  const [volunteer, setVolunteer] = useState(initialVolunteer);
  const [paid, setPaid] = useState(initialPaid);
  const [loggedIn, setLoggedIn] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
      await axios.post(
        "http://localhost:5000/api/transporters/register",
        volunteer
      );
      setLoggedIn(true);
    } catch {
      alert("Registration failed.");
    }
  };

  // Handle Paid Register/Login
  const handlePaidSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/transporters/register", paid);
      setLoggedIn(true);
    } catch {
      alert("Registration failed.");
    }
  };

  // Show details of a selected request
  if (loggedIn && selectedRequest) {
    return (
      <div
        style={{
          maxWidth: 500,
          margin: "2rem auto",
          background: "#fff",
          borderRadius: 8,
          padding: 24,
        }}
      >
        <button
          onClick={() => setSelectedRequest(null)}
          style={{ marginBottom: 16 }}
        >
          ← Back
        </button>
        <h2>Transport Request Details</h2>
        <div>
          <strong>Donor:</strong> {selectedRequest.donorName}
        </div>
        <div>
          <strong>Pickup Location:</strong> {selectedRequest.donorLocation}
        </div>
        <div>
          <strong>Destination:</strong> {selectedRequest.facilityName} (
          {selectedRequest.facilityAddress})
        </div>
        <div>
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
        <button
          style={{ marginTop: 16 }}
          onClick={() => alert("You have accepted this transport request!")}
        >
          Accept & Contact Donor
        </button>
      </div>
    );
  }

  // Show requests as cards after login/register
  if (loggedIn) {
    return (
      <div style={{ maxWidth: 700, margin: "2rem auto" }}>
        <h2>Available Transport Requests</h2>
        {requests.length === 0 && <div>No requests available.</div>}
        {requests.map((req) => (
          <div
            key={req._id}
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              cursor: "pointer",
              background: "#f9fafb",
            }}
            onClick={() => setSelectedRequest(req)}
          >
            <div>
              <strong>Donor:</strong> {req.donorName}
            </div>
            <div>
              <strong>Pickup Location:</strong> {req.donorLocation}
            </div>
            <div>
              <strong>Destination:</strong> {req.facilityName} (
              {req.facilityAddress})
            </div>
            <div>
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
    );
  }

  // Show registration/login form
  return (
    <div
      style={{
        maxWidth: 420,
        margin: "2rem auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px #e0e7ff",
        padding: 24,
      }}
    >
      <div style={{ display: "flex", marginBottom: 24 }}>
        <button
          className={tab === "volunteer" ? "button" : ""}
          style={{
            flex: 1,
            border: "none",
            background: tab === "volunteer" ? "#38bdf8" : "#f1f5f9",
            color: tab === "volunteer" ? "#fff" : "#222",
            padding: "0.7rem 0",
            borderRadius: "8px 0 0 8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => setTab("volunteer")}
        >
          Volunteer (Free)
        </button>
        <button
          className={tab === "paid" ? "button" : ""}
          style={{
            flex: 1,
            border: "none",
            background: tab === "paid" ? "#38bdf8" : "#f1f5f9",
            color: tab === "paid" ? "#fff" : "#222",
            padding: "0.7rem 0",
            borderRadius: "0 8px 8px 0",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => setTab("paid")}
        >
          Paid Transporter
        </button>
      </div>

      {tab === "volunteer" && (
        <form onSubmit={handleVolunteerSubmit}>
          <h3>Volunteer Transporter Registration</h3>
          <input
            name="name"
            placeholder="Name"
            value={volunteer.name}
            onChange={(e) =>
              setVolunteer({ ...volunteer, name: e.target.value })
            }
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={volunteer.phone}
            onChange={(e) =>
              setVolunteer({ ...volunteer, phone: e.target.value })
            }
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            name="vehicle"
            placeholder="Vehicle Type"
            value={volunteer.vehicle}
            onChange={(e) =>
              setVolunteer({ ...volunteer, vehicle: e.target.value })
            }
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            name="route"
            placeholder="Route (e.g. Chennai - Anna Nagar)"
            value={volunteer.route}
            onChange={(e) =>
              setVolunteer({ ...volunteer, route: e.target.value })
            }
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <button type="submit" style={{ width: "100%", marginTop: 12 }}>
            Register as Volunteer
          </button>
        </form>
      )}

      {tab === "paid" && (
        <form onSubmit={handlePaidSubmit}>
          <h3>Paid Transporter Registration</h3>
          <input
            name="name"
            placeholder="Name"
            value={paid.name}
            onChange={(e) => setPaid({ ...paid, name: e.target.value })}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={paid.phone}
            onChange={(e) => setPaid({ ...paid, phone: e.target.value })}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            name="vehicle"
            placeholder="Vehicle Type"
            value={paid.vehicle}
            onChange={(e) => setPaid({ ...paid, vehicle: e.target.value })}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            name="route"
            placeholder="Route (e.g. Chennai - Anna Nagar)"
            value={paid.route}
            onChange={(e) => setPaid({ ...paid, route: e.target.value })}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            name="chargePerTrip"
            placeholder="Charge per Trip (₹)"
            value={paid.chargePerTrip}
            onChange={(e) => setPaid({ ...paid, chargePerTrip: e.target.value })}
            required
            style={{ width: "100%", marginBottom: 8 }}
            type="number"
            min="0"
          />
          <button type="submit" style={{ width: "100%", marginTop: 12 }}>
            Register as Paid Transporter
          </button>
        </form>
      )}
    </div>
  );
};

export default TransporterRegister;