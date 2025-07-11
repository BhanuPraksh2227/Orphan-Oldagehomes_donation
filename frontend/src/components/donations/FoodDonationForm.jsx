import { useState, useEffect } from 'react';
import api from '../../services/api';

const FoodDonationForm = ({ setAlert, facilities = [], loading }) => {
  const [user, setUser] = useState({ name: '', phone: '', address: '', email: '' });
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    pickupAddress: '',
    pickupDate: '',
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

  // Filter facilities by search
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
      const response = await api.post('/donations/food', {
        ...formData,
        facilityId,
        facilityName, // <-- Add this!
        donorName: user.name,
        phone: user.phone,
        pickupAddress: user.address,
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
        foodType: '',
        quantity: '',
        pickupAddress: '',
        pickupDate: '',
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
      <h2>Food Donation</h2>
      <form onSubmit={handleSubmit}>
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
          <div className="form-group">
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
                <option key={facility.id || facility._id} value={facility.id || facility._id}>
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
          <label>Address</label>
          <input type="text" value={user.address} readOnly />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="text" value={user.email} readOnly />
        </div>
        {/* Donation-specific fields */}
        <div className="form-group">
          <label>Food Type</label>
          <select
            value={formData.foodType}
            onChange={(e) => setFormData({...formData, foodType: e.target.value})}
            required
          >
            <option value="">Select type</option>
            <option value="cooked">Cooked Food</option>
            <option value="raw">Raw Materials</option>
            <option value="packaged">Packaged Food</option>
          </select>
        </div>
        <div className="form-group">
          <label>Quantity (servings)</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Pickup Date</label>
          <input
            type="date"
            value={formData.pickupDate}
            onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <button type="submit" className="submit-btn">
          Submit Donation
        </button>
      </form>
    </div>
  );
};

export default FoodDonationForm;