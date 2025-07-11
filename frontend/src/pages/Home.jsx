import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    // Add animation classes after mount
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome to OrphanCare, {user.name}!</h1>
        <p>Make a difference in someone's life today</p>
      </div>
      
      <div className="cards-grid">
        <div className="card" onClick={() => navigate('/orphanages')}>
          <h2>Orphanages</h2>
          <p>Support children in need</p>
        </div>
        
        <div className="card" onClick={() => navigate('/oldagehomes')}>
          <h2>Old Age Homes</h2>
          <p>Care for our elderly</p>
        </div>
        
        <div className="card donate-card" onClick={() => navigate('/donate')}>
          <h2>Make a Donation</h2>
          <p>Every contribution matters</p>
        </div>
      </div>

      <section className="hero-section animate-on-scroll">
        <h1>Make a Difference Today</h1>
        <p>Support orphanages and old age homes with care and compassion</p>
        <button 
          className="cta-button"
          onClick={() => navigate('/donate')}
        >
          Donate Now
        </button>
      </section>

      <section className="features-section">
        <div className="feature-card animate-on-scroll">
          <span className="icon">🏠</span>
          <h3>Find Facilities</h3>
          <p>Discover verified orphanages and old age homes near you</p>
        </div>

        <div className="feature-card animate-on-scroll">
          <span className="icon">❤️</span>
          <h3>Make Donations</h3>
          <p>Support with monetary or material donations</p>
        </div>

        <div className="feature-card animate-on-scroll">
          <span className="icon">🤝</span>
          <h3>Volunteer</h3>
          <p>Spend time with children and elderly</p>
        </div>
      </section>

      <section className="impact-section animate-on-scroll">
        <h2>Our Impact</h2>
        <div className="impact-stats">
          <div className="stat">
            <span className="number">50+</span>
            <span className="label">Facilities</span>
          </div>
          <div className="stat">
            <span className="number">1000+</span>
            <span className="label">Lives Touched</span>
          </div>
          <div className="stat">
            <span className="number">500+</span>
            <span className="label">Volunteers</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;