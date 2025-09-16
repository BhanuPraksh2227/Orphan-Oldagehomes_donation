import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/facilities.css';

const OrphanagesPage = ({ onDonate }) => {
  const [orphanages, setOrphanages] = useState([]);
  const [donations, setDonations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrphanages();
  }, []);

  const fetchOrphanages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/facilities');
      const orphanagesList = response.data.filter(f => f.type === 'orphanage');
      setOrphanages(orphanagesList);

      // Fetch donations for each orphanage
      for (const orphanage of orphanagesList) {
        try {
          const donationsRes = await api.get(`/donations/facility/${orphanage._id || orphanage.id}`);
          setDonations(prev => ({ 
            ...prev, 
            [orphanage._id || orphanage.id]: donationsRes.data.donations || [] 
          }));
        } catch (err) {
          console.error(`Failed to fetch donations for facility ${orphanage._id || orphanage.id}:`, err);
        }
      }
    } catch (err) {
      setError('Failed to load orphanages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId) => {
    try {
        await api.put(`/donations/${donationId}/status`, { status: 'delivered' });
        fetchOrphanages();
    } catch (err) {
        console.error('Failed to update donation status:', err);
    }
  };

  const handleDonateClick = (e, facility) => {
    e.preventDefault();
    try {
        sessionStorage.setItem('selectedFacility', JSON.stringify(facility));
        if (onDonate) {
            onDonate(facility);
        }
    } catch (error) {
        console.error('Error in handleDonateClick:', error);
    }
  };

  if (loading) return (
    <div className="loading" style={{ animation: "slideInUp 0.6s ease-out" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏠</div>
      Loading orphanages...
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
        <h1>🏠 Orphanages</h1>
        {orphanages.map((facility, index) => (
            <div 
                className="facility-card" 
                key={facility._id}
                style={{
                    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                }}
            >
                <div className="facility-header">
                    <h2>{facility.name}</h2>
                    <p className="location">
                        <i className="fas fa-map-marker-alt"></i>
                        {typeof facility.location === 'object' 
                            ? `${facility.location.city}, ${facility.location.state}`
                            : facility.location}
                    </p>
                </div>
                <div className="facility-details">
                    <p className="description">{facility.description}</p>
                    
                    <div className="info-section">
                        <h3>Facility Features</h3>
                        <ul className="features-list">
                            {[
                                '24/7 Care & Supervision',
                                'Quality Education Access',
                                'Regular Health Check-ups',
                                'Recreational Activities',
                                'Counseling Services'
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
                        <p><i className="fas fa-phone"></i> Phone: {facility.contact}</p>
                        <p><i className="fas fa-envelope"></i> Email: {facility.email}</p>
                        <p><i className="fas fa-clock"></i> Visiting Hours: 9:00 AM - 6:00 PM</p>
                    </div>

                    <div className="needs-section">
                        <h3>Current Needs</h3>
                        <div className="needs-tags">
                            {[
                                { type: 'money', text: 'Financial Support', icon: '💰' },
                                { type: 'books', text: 'Educational Materials', icon: '📚' },
                                { type: 'clothes', text: 'Children\'s Clothing', icon: '👕' },
                                { type: 'food', text: 'Nutritional Support', icon: '🍎' },
                                { type: 'health', text: 'Healthcare Supplies', icon: '🏥' }
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
                            <span className="stat-label">Current Children</span>
                            <span className="stat-value">{facility.currentChildren || '25'}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Staff Members</span>
                            <span className="stat-value">{facility.staffCount || '8'}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Age Range</span>
                            <span className="stat-value">3-16 yrs</span>
                        </div>
                    </div>
                </div>
                <div className="facility-footer">
                    <button 
                        className="donate-btn"
                        onClick={(e) => handleDonateClick(e, facility)}
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

export default OrphanagesPage;