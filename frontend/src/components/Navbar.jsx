import { useState, useEffect, createContext, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import Profile from "./Profile";
import Sidebar from "./Sidebar"; // <-- Import your Sidebar component

export const SidebarContext = createContext();

const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [sidebarActive, setSidebarActive] = useState(false);

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                setUser(userData);
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user'); // Clear invalid data
        }
    }, []);

    return (
        <>
            <nav className="navbar">
                <div className="nav-brand">
                    <button className="menu-btn" onClick={onMenuClick}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <span className="brand-name">OrphanCare</span>
                </div>

                <div className="nav-links">
                    <button 
                        onClick={() => navigate('/home')} 
                        className="nav-button"
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => navigate('/orphanages')} 
                        className="nav-button"
                    >
                        Orphanages
                    </button>
                    <button 
                        onClick={() => navigate('/oldagehomes')} 
                        className="nav-button"
                    >
                        Old Age Homes
                    </button>
                    <button 
                        onClick={() => navigate('/about')} 
                        className="nav-button"
                    >
                        About
                    </button>
                </div>

                <div className="nav-profile">
                    {user && <Profile user={user} />}
                </div>
                <button
                    className="donate-btn"
                    onClick={() => {
                        sessionStorage.removeItem("selectedFacility"); // <-- Add this line!
                        setSidebarActive(true);
                    }}
                >
                    Donate
                </button>
                <Link to="/transporter-register" className="button">Transport Register</Link>
                <Link to="/transport-requests" className="button">View Transport Requests</Link>
                {/* Remove or comment out this button */}
                {/* 
                <button
                    className="tracking-btn"
                    onClick={() => navigate('/profile')}
                >
                    Tracking Details
                </button>
                */}
            </nav>

            {/* Use the Sidebar component for consistency */}
            <Sidebar open={sidebarActive} onClose={() => setSidebarActive(false)} />
        </>
    );
};

export default Navbar;