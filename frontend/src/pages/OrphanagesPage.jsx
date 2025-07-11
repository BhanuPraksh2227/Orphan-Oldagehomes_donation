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
          // Continue with other facilities even if one fails
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
        
        // Refresh donations after status update
        fetchOrphanages();
    } catch (err) {
        console.error('Failed to update donation status:', err);
    }
  };

  const handleDonateClick = (e, facility) => {
    e.preventDefault();
    try {
        // Store facility data
        sessionStorage.setItem('selectedFacility', JSON.stringify(facility));
        // Call the onDonate prop to open sidebar
        if (onDonate) {
            onDonate(facility);
        }
    } catch (error) {
        console.error('Error in handleDonateClick:', error);
    }
};

  // Optimize donation fetching by using a Set to track unique IDs
  useEffect(() => {
    const fetchedIds = new Set();
    
    orphanages.forEach(orphanage => {
        if (!fetchedIds.has(orphanage._id)) {
            fetchedIds.add(orphanage._id);
            // Your existing fetchDonations call here
        }
    });
  }, [orphanages]);

  if (loading) return <div className="loading">Loading orphanages...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="facilities-container">
        <h1>Orphanages</h1>
        {orphanages.map(facility => (
            <div className="facility-card" key={facility._id}>
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
                            ].map((feature, index) => (
                                <li key={`feature-${index}`}>{feature}</li>
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
                                { type: 'money', text: 'Financial Support' },
                                { type: 'books', text: 'Educational Materials' },
                                { type: 'clothes', text: 'Children\'s Clothing' },
                                { type: 'food', text: 'Nutritional Support' },
                                { type: 'health', text: 'Healthcare Supplies' }
                            ].map((need, index) => (
                                <span 
                                    key={`need-${index}`} 
                                    className={`need-tag ${need.type}`}
                                >
                                    {need.text}
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

                    <div className="education-section info-section">
                        <h3>Education Support</h3>
                        <ul className="features-list">
                            <li>School Enrollment Assistance</li>
                            <li>After-school Tutoring</li>
                            <li>Computer Training</li>
                            <li>Skill Development Programs</li>
                            <li>Career Guidance</li>
                        </ul>
                    </div>
                </div>
                <div className="facility-footer">
                    <button 
                        className="donate-btn"
                        onClick={(e) => handleDonateClick(e, facility)}
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

export default OrphanagesPage;