import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/oldAgeHomes.css';

const OldAgeHomesPage = ({ onDonate }) => {
  const [homes, setHomes] = useState([]);
  const [donations, setDonations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/facilities');
      const homesList = response.data.filter(f => f.type === 'oldAgeHome');
      setHomes(homesList);

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
      sessionStorage.setItem('selectedFacility', JSON.stringify(home));
      if (onDonate) {
        onDonate(home);
      }
    } catch (error) {
      console.error('Error in donate click:', error);
    }
  };

  if (loading) return (
    <div className="loading" style={{ animation: "slideInUp 0.6s ease-out" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏡</div>
      Loading old age homes...
    </div>
  );
  
  if (error) return (
    <div className="error" style={{ animation: "slideInUp 0.6s ease-out" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
      {error}
    </div>
  );

  return (
    <div className="facilities-container">
      <h1>🏡 Old Age Homes</h1>
      {homes.map((home, index) => (
        <div 
          key={home._id || home.id} 
          className="facility-card"
          style={{
            animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
          }}
        >
          <div className="facility-header">
            <h2>{home.name}</h2>
            <p className="location">
              <i className="fas fa-map-marker-alt"></i>
              {home.location?.city}, {home.location?.state}
            </p>
          </div>
          <div className="facility-details">
            <p>{home.description}</p>
            
            <div className="info-section">
              <h3>Facility Features</h3>
              <ul className="features-list">
                {[
                  '24/7 Medical Care Available',
                  'Nutritious Meals (3 times a day)',
                  'Regular Health Check-ups',
                  'Recreation Activities',
                  'Physiotherapy Services'
                ].map((feature, featureIndex) => (
                  <li 
                    key={`feature-${featureIndex}`}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${(index * 0.1) + (featureIndex * 0.1)}s both`
                    }}
                  >
                    {feature}
                  </li>
                ))}
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
                {[
                  { type: 'money', text: 'Financial Support', icon: '💰' },
                  { type: 'health', text: 'Medical Supplies', icon: '🏥' },
                  { type: 'clothes', text: 'Clothing', icon: '👕' },
                  { type: 'food', text: 'Food Items', icon: '🍎' }
                ].map((need, needIndex) => (
                  <span 
                    key={`need-${needIndex}`} 
                    className={`need-tag ${need.type}`}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${(index * 0.1) + (needIndex * 0.1)}s both`
                    }}
                  >
                    {need.icon} {need.text}
                  </span>
                ))}
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
              💝 Donate Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OldAgeHomesPage;