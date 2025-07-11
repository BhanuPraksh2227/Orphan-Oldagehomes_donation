import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/facilities.css';

const OldAgeHomesPage = ({ onDonate }) => {
  const [homes, setHomes] = useState([]);
  const [donations, setDonations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomes();
    // eslint-disable-next-line
  }, []);

  const fetchHomes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/facilities');
      const homesList = response.data.filter(f => f.type === 'oldAgeHome');
      setHomes(homesList);

      // Fetch donations for each old age home
      for (const home of homesList) {
        const res = await api.get(`/donations/facility/${home._id || home.id}`);
        setDonations(prev => ({ ...prev, [home._id || home.id]: res.data }));
      }
    } catch (err) {
      setError('Failed to load old age homes');
    } finally {
      setLoading(false);
    }
  };

  const handleDonateClick = (e, home) => {
    e.preventDefault();
    try {
      // Store facility info
      sessionStorage.setItem('selectedFacility', JSON.stringify(home));
      
      // Call the onDonate prop to open sidebar
      if (onDonate) {
        onDonate(home);
      }
    } catch (error) {
      console.error('Error in donate click:', error);
    }
  };

  if (loading) return <div className="loading">Loading old age homes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="facilities-container">
      <h1>Old Age Homes</h1>
      {homes.map(home => (
        <div key={home._id || home.id} className="facility-card">
          <div className="facility-header">
            <h2>{home.name}</h2>
            <p className="location">{home.location?.city}, {home.location?.state}</p>
          </div>
          <div className="facility-details">
            <p>{home.description}</p>
            
            <div className="info-section">
              <h3>Facility Features</h3>
              <ul className="features-list">
                <li>24/7 Medical Care Available</li>
                <li>Nutritious Meals (3 times a day)</li>
                <li>Regular Health Check-ups</li>
                <li>Recreation Activities</li>
                <li>Physiotherapy Services</li>
              </ul>
            </div>

            <div className="contact-info">
              <h3>Contact Information</h3>
              <p><i className="fas fa-phone"></i> Phone: {home.contactInfo?.phone}</p>
              <p><i className="fas fa-envelope"></i> Email: {home.contactInfo?.email}</p>
              <p><i className="fas fa-clock"></i> Visiting Hours: 10:00 AM - 5:00 PM</p>
            </div>

            <div className="needs-section">
              <h3>Current Needs</h3>
              <div className="needs-tags">
                <span className="need-tag money">Financial Support</span>
                <span className="need-tag health">Medical Supplies</span>
                <span className="need-tag clothes">Clothing</span>
                <span className="need-tag food">Food Items</span>
              </div>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <span className="stat-label">Current Residents</span>
                <span className="stat-value">{home.currentResidents || '30'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Staff Members</span>
                <span className="stat-value">{home.staffCount || '10'}</span>
              </div>
            </div>
          </div>
          <div className="facility-footer">
            <button 
              className="donate-btn"
              onClick={(e) => handleDonateClick(e, home)}
              type="button"
            >
              Donate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OldAgeHomesPage;