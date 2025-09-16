import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransporterNavbar from '../components/TransporterNavbar';
import '../styles/transporterAbout.css';

const TransporterAboutPage = () => {
    const cardsRef = useRef([]);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    const handleMenuClick = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="transporter-about-container">
            <TransporterNavbar onMenuClick={handleMenuClick} />
            
            <div className="about-content">
                <div className="about-header">
                    <h1>About Our Transport Platform</h1>
                    <p>Connecting donors with facilities through reliable transportation</p>
                </div>

                <div className="cards-container">
                    <div className="about-card" ref={(el) => (cardsRef.current[0] = el)}>
                        <div className="card-icon">🚚</div>
                        <h2 className="card-title">Your Role as a Transporter</h2>
                        <p className="card-text">
                            As a transporter, you play a crucial role in our donation ecosystem. Your responsibilities include:
                            <ul className="feature-list">
                                <li>Picking up donations from donors' locations</li>
                                <li>Ensuring safe and timely delivery to facilities</li>
                                <li>Maintaining proper documentation of deliveries</li>
                                <li>Communicating with facility coordinators</li>
                                <li>Following safety protocols for different donation types</li>
                            </ul>
                            Your dedication helps bridge the gap between generous donors and facilities in need.
                        </p>
                    </div>

                    <div className="about-card" ref={(el) => (cardsRef.current[1] = el)}>
                        <div className="card-icon">📦</div>
                        <h2 className="card-title">Types of Donations You'll Transport</h2>
                        <p className="card-text">
                            You'll handle various types of donations, each requiring specific care:
                            <ul className="feature-list">
                                <li><strong>Food Donations:</strong> Fresh meals, packaged food, and groceries</li>
                                <li><strong>Clothing:</strong> New and gently used clothes for all ages</li>
                                <li><strong>Books:</strong> Educational materials and reading books</li>
                                <li><strong>Health Supplies:</strong> Medical kits and hygiene products</li>
                                <li><strong>Monetary Donations:</strong> Secure cash or check deliveries</li>
                            </ul>
                            Each type has specific handling requirements to ensure quality preservation.
                        </p>
                    </div>

                    <div className="about-card" ref={(el) => (cardsRef.current[2] = el)}>
                        <div className="card-icon">🏠</div>
                        <h2 className="card-title">Facilities You'll Serve</h2>
                        <p className="card-text">
                            You'll deliver to various facilities across the region:
                            <ul className="feature-list">
                                <li><strong>Orphanages:</strong> Providing for children in need</li>
                                <li><strong>Old Age Homes:</strong> Supporting elderly care facilities</li>
                                <li><strong>Rehabilitation Centers:</strong> Helping recovery programs</li>
                                <li><strong>Community Centers:</strong> Serving local communities</li>
                                <li><strong>Emergency Shelters:</strong> Supporting crisis situations</li>
                            </ul>
                            Each facility has specific needs and delivery requirements.
                        </p>
                    </div>

                    <div className="about-card" ref={(el) => (cardsRef.current[3] = el)}>
                        <div className="card-icon">💰</div>
                        <h2 className="card-title">Earnings & Compensation</h2>
                        <p className="card-text">
                            We offer competitive compensation for your services:
                            <ul className="feature-list">
                                <li>Base payment per successful delivery</li>
                                <li>Distance-based compensation</li>
                                <li>Bonus for urgent deliveries</li>
                                <li>Performance-based incentives</li>
                                <li>Weekly payment processing</li>
                            </ul>
                            Your earnings depend on the number of successful deliveries and distance covered.
                        </p>
                    </div>

                    <div className="about-card" ref={(el) => (cardsRef.current[4] = el)}>
                        <div className="card-icon">📱</div>
                        <h2 className="card-title">Platform Features</h2>
                        <p className="card-text">
                            Our platform provides tools to help you succeed:
                            <ul className="feature-list">
                                <li>Real-time transport request notifications</li>
                                <li>Route optimization and GPS tracking</li>
                                <li>Digital delivery confirmation system</li>
                                <li>Earnings tracking and payment history</li>
                                <li>24/7 support and emergency contacts</li>
                            </ul>
                            Stay connected and efficient with our comprehensive transport management system.
                        </p>
                    </div>

                    <div className="about-card" ref={(el) => (cardsRef.current[5] = el)}>
                        <div className="card-icon">🤝</div>
                        <h2 className="card-title">Community Impact</h2>
                        <p className="card-text">
                            Your work creates meaningful impact:
                            <ul className="feature-list">
                                <li>Reducing food waste through timely delivery</li>
                                <li>Providing essential supplies to vulnerable populations</li>
                                <li>Supporting educational initiatives through book donations</li>
                                <li>Improving healthcare access through medical supplies</li>
                                <li>Building stronger, more caring communities</li>
                            </ul>
                            Every delivery you make contributes to positive change in someone's life.
                        </p>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Ready to Make a Difference?</h2>
                    <p>Start transporting donations and help us connect generosity with need.</p>
                    <div className="cta-buttons">
                        <button 
                            className="cta-btn primary"
                            onClick={() => navigate('/transport-requests')}
                        >
                            View Transport Requests
                        </button>
                        <button 
                            className="cta-btn secondary"
                            onClick={() => navigate('/transporter-dashboard')}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransporterAboutPage; 