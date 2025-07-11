import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    console.log('Profile Component - User Data:', userData); // Debug log

    if (!userData) {
        console.log('No user data found in localStorage');
        return null;
    }

    return (
        <div className="profile-container">
            <div className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
                <div className="profile-avatar">
                    {userData.name?.charAt(0)}
                </div>
            </div>

            {isOpen && (
                <div className="profile-dropdown">
                    <div className="profile-header">
                        <div className="profile-avatar large">
                            {userData.name?.charAt(0)}
                        </div>
                        <h3>{userData.name}</h3>
                        <p>{userData.email}</p>
                    </div>

                    <div className="profile-info">
                        <h4>Personal Information</h4>
                        <div className="info-item">
                            <label>Phone:</label>
                            <p>{userData.phone}</p>
                        </div>
                        <div className="info-item">
                            <label>Address:</label>
                            <p>{userData.address}</p>
                        </div>
                    </div>

                    <div className="profile-menu">
                        <button onClick={() => navigate('/profile')}>
                            View Full Profile
                        </button>
                        <button 
                            onClick={() => {
                                localStorage.removeItem('userData');
                                localStorage.removeItem('token');
                                navigate('/login');
                            }} 
                            className="logout-btn"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;