import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DonationForm = ({ facility }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    type: 'money',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Hide sidebar when form mounts
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar?.classList.contains('active')) {
      sidebar.classList.remove('active');
      overlay?.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }, []);

  // Debug logs
  useEffect(() => {
    console.log("formData:", formData);
    console.log("facility:", facility);
  }, [formData, facility]);

  if (!facility) {
    return <div>Please select a facility to donate.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('userData'));
      if (!user) {
        setError('You must be logged in to donate.');
        setLoading(false);
        return;
      }

      const donationData = {
        amount: formData.amount,
        type: formData.type,
        facilityId: facility._id,
        donorId: user.id,
        description: formData.description,
        facilityName: facility.name,
        status: 'pending',
        trackingId: `DON${Date.now()}${Math.floor(Math.random() * 1000)}`,
        donationDate: new Date().toISOString()
      };

      const response = await api.post('/donations/' + formData.type, donationData);

      if (response.data) {
        const newDonation = {
          ...donationData,
          id: response.data._id || Date.now()
        };

        // Update user's donations
        const updatedUser = {
          ...user,
          donations: [...(user.donations || []), newDonation]
        };

        localStorage.setItem('userData', JSON.stringify(updatedUser));

        // Show confirmation dialog
        const proceed = window.confirm(`
          Donation Submitted Successfully!
          Tracking ID: ${donationData.trackingId}
          Amount: ₹${formData.amount}
          Status: Pending Verification

          Would you like to view your donation status?
        `);

        if (proceed) {
          navigate('/profile');
        } else {
          navigate('/facilities');
        }
      }
    } catch (err) {
      setError('Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="donation-form">
      <h3>Donate to {facility.name}</h3>
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label>Donation Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        >
          {facility.needs.map(need => (
            <option key={need} value={need}>
              {need.charAt(0).toUpperCase() + need.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {formData.type === 'money' && (
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            min="100"
            required
          />
        </div>
      )}

      <div className="form-group">
        <label>Message</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="4"
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Submit Donation'}
      </button>
    </form>
  );
};

export default DonationForm;