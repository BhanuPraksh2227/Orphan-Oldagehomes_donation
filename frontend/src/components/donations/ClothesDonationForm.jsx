import { useState, useEffect } from 'react';
import api from '../../services/api';

const ClothesDonationForm = ({ setAlert, facilities = [], loading }) => {
  const [user, setUser] = useState({ name: '', phone: '', address: '' });
  const [formData, setFormData] = useState({
    clothesType: '',
    quantity: '',
    condition: '',
    pickupAddress: '',
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
        setUser({ name: '', phone: '', address: '' });
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
      const response = await api.post('/donations/clothes', {
        ...formData,
        facilityId,
        facilityName, // <-- Add this!
        donorName: user.name,
        phone: user.phone,
        pickupAddress: user.address
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
        clothesType: '',
        quantity: '',
        condition: '',
        pickupAddress: '',
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
      <h2>Clothes Donation</h2>
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
          <label>Pickup Address</label>
          <input type="text" value={user.address} readOnly />
        </div>
        {/* Donation-specific fields */}
        <div className="form-group">
          <label>Type of Clothes</label>
          <select
            value={formData.clothesType}
            onChange={(e) => setFormData({...formData, clothesType: e.target.value})}
            required
          >
            <option value="">Select type</option>
            <option value="casual">Casual Wear</option>
            <option value="formal">Formal Wear</option>
            <option value="winter">Winter Wear</option>
            <option value="children">Children's Wear</option>
          </select>
        </div>
        <div className="form-group">
          <label>Quantity (pieces)</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Condition</label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData({...formData, condition: e.target.value})}
            required
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">
          Submit Donation
        </button>
      </form>
    </div>
  );
};

export default ClothesDonationForm;