import React, { useEffect, useState } from "react";
import axios from "axios";

const TransportRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get("/api/donations/pending")
      .then(res => {
        // Ensure we always set an array
        if (Array.isArray(res.data)) {
          setRequests(res.data);
        } else if (Array.isArray(res.data.data)) {
          setRequests(res.data.data);
        } else {
          setRequests([]);
        }
      })
      .catch(() => setRequests([]));
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2>Available Transport Requests</h2>
      {(!requests || requests.length === 0) && <div>No requests available.</div>}
      {Array.isArray(requests) && requests.map(req => (
        <div key={req._id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div><strong>Donor:</strong> {req.donorName}</div>
          <div><strong>Pickup Location:</strong> {req.donorLocation}</div>
          <div><strong>Destination:</strong> {req.facilityName} ({req.facilityAddress})</div>
          <div><strong>Donation Type:</strong> {req.type}</div>
          <div><strong>Details:</strong> {req.quantity} {req.foodType || req.clothesType || req.bookType || req.kitType || ""}</div>
          <button style={{ marginTop: 8 }}>Accept & Contact Donor</button>
        </div>
      ))}
    </div>
  );
};

export default TransportRequests;