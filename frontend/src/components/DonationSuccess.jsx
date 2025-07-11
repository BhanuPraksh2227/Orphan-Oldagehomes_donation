import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/donationSuccess.css';

const DonationSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { amount, facilityName } = location.state || {};

    useEffect(() => {
        // Auto-redirect after 5 seconds
        const timer = setTimeout(() => {
            navigate('/profile');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="donation-success">
            <div className="success-card">
                <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                </div>
                <h2>Thank You!</h2>
                <p className="amount">₹{amount}</p>
                <p className="message">
                    Your donation to {facilityName} has been successfully processed.
                </p>
                <p className="redirect-message">
                    You will be redirected to your profile in 5 seconds...
                </p>
                <div className="buttons">
                    <button onClick={() => navigate('/profile')}>
                        View Profile
                    </button>
                    <button onClick={() => navigate('/orphanages')}>
                        Make Another Donation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonationSuccess;