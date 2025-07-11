import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowTransportOptions = ({ facility }) => {
  const [transporters, setTransporters] = useState([]);

  useEffect(() => {
    if (facility?.route) {
      axios
        .get(`/api/transporters?route=${encodeURIComponent(facility.route)}`)
        .then((res) => setTransporters(res.data))
        .catch(() => setTransporters([]));
    }
  }, [facility]);

  const requestTransport = (transporterId, donationId) => {
    // Implement your request logic here
    alert(`Requested transporter ${transporterId} for donation ${donationId}`);
  };

  return (
    <div>
      <h3>Available Transporters</h3>
      {transporters.length > 0 ? (
        transporters.map((t) => (
          <div key={t._id} style={{ marginBottom: 8 }}>
            <span>
              {t.name} ({t.vehicle}) - {t.isVolunteer ? "Volunteer (Free)" : "Paid"}
            </span>
            <button
              style={{ marginLeft: 12 }}
              onClick={() => requestTransport(t._id, /* donationId */ "")}
            >
              Request Pickup
            </button>
          </div>
        ))
      ) : (
        <div>No transporters available for this route right now.</div>
      )}
    </div>
  );
};

export default ShowTransportOptions;