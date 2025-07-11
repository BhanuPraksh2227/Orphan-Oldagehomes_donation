import { useState, useEffect } from 'react';
import api from '../../services/api';

const MoneyDonationForm = ({ setAlert, facilities = [], loading }) => {
  const [user, setUser] = useState({ name: '', phone: '', address: '', email: '' });
  const [formData, setFormData] = useState({
    amount: '',
    paymentMode: '',
    purpose: '',
    facilityId: ''
  });
  const [search, setSearch] = useState('');
  const [facility, setFacility] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser({ name: '', phone: '', address: '', email: '' });
      }
    }
    // Facility detection
    const stored = sessionStorage.getItem("selectedFacility");
    if (stored) {
      try {
        setFacility(JSON.parse(stored));
      } catch {
        setFacility(null);
      }
    }
  }, []);

  const filteredFacilities = facilities.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.location?.city?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const facilityId = facility ? (facility._id || facility.id) : formData.facilityId;
    const facilityName = facility
      ? facility.name
      : (facilities.find(f => (f._id || f.id) === formData.facilityId)?.name || "");

    try {
      const response = await api.post('/donations/money', {
        ...formData,
        facilityId,
        facilityName, // <-- Add this!
        donorName: user.name,
        phone: user.phone,
        email: user.email
      });

      // Save to user donation history in localStorage
      const donation = {
        ...(response.data.donation || response.data),
        facilityName // <-- Add this!
      };
      const userData = JSON.parse(localStorage.getItem('userData'));
      userData.donations = [...(userData.donations || []), donation];
      localStorage.setItem('userData', JSON.stringify(userData));

      alert(
        `Donation submitted!\nTracking ID: ${donation.trackingId}\nStatus: ${donation.status}\n\nYou can track your donation in your profile.`
      );

      setAlert({
        type: 'success',
        message: 'Your donation has been submitted successfully! We will contact you for collection.'
      });
      setFormData({
        amount: '',
        paymentMode: '',
        purpose: '',
        facilityId: ''
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to submit donation'
      });
    }
  };

  return (
    <div className="donation-form">
      <h2>Money Donation</h2>
      <form onSubmit={handleSubmit} className="donation-form money-donation">
        {/* Facility selection */}
        {facility ? (
          <div className="form-group">
            <label>Facility</label>
            <input
              type="text"
              value={
                facility.name +
                (facility.location?.city ? ` (${facility.location.city})` : "")
              }
              readOnly
            />
          </div>
        ) : (
          <div className="form-group" style={{ "--i": 1 }}>
            <label>Search Orphanage/Old Age Home</label>
            <input
              type="text"
              placeholder="Type name or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              disabled={loading}
            />
            <select
              value={formData.facilityId}
              onChange={e => setFormData({ ...formData, facilityId: e.target.value })}
              required
              disabled={loading || filteredFacilities.length === 0}
            >
              <option value="">Select Facility</option>
              {filteredFacilities.map(facility => (
                <option key={facility._id || facility.id} value={facility._id || facility.id}>
                  {facility.name} ({facility.location?.city})
                </option>
              ))}
            </select>
          </div>
        )}
        {/* Auto-filled user details */}
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={user.name} readOnly />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" value={user.phone} readOnly />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="text" value={user.email} readOnly />
        </div>
        {/* Donation-specific fields */}
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Payment Mode</label>
          <select
            value={formData.paymentMode}
            onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
            required
          >
            <option value="">Select payment mode</option>
            <option value="upi">UPI</option>
            <option value="netbanking">Net Banking</option>
            <option value="card">Debit/Credit Card</option>
          </select>
        </div>
        <div className="form-group">
          <label>Purpose</label>
          <select
            value={formData.purpose}
            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            required
          >
            <option value="">Select purpose</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="general">General Support</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default MoneyDonationForm;