import { useState, useEffect, createContext, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import Profile from "./Profile";
import Sidebar from "./Sidebar";

export const SidebarContext = createContext();

const TransporterNavbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [sidebarActive, setSidebarActive] = useState(false);

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('userData');
            if (userStr) {
                const userData = JSON.parse(userStr);
                setUser(userData);
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('userData');
        }
    }, []);

    return (
        <>
            <nav className="navbar">
                {/* Left side - Brand and Menu */}
                <div className="nav-left">
                    <button className="menu-btn" onClick={onMenuClick}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <span className="brand-name">OrphanCare</span>
                </div>

                {/* Center - Navigation Links */}
                <div className="nav-center">
                    <button 
                        onClick={() => navigate('/transporter-dashboard')} 
                        className="nav-link-btn"
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => navigate('/transport-requests')} 
                        className="nav-link-btn"
                    >
                        Transport Requests
                    </button>
                    <button 
                        onClick={() => navigate('/transporter-about')} 
                        className="nav-link-btn"
                    >
                        About
                    </button>
                </div>

                {/* Right side - Transporter Specific Actions */}
                <div className="nav-right">
                    <button
                        className="action-btn"
                        onClick={() => navigate('/transport-requests')}
                    >
                        Transport Requests
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => navigate('/profile')}
                    >
                        Profile
                    </button>
                    {user && <Profile user={user} />}
                </div>
            </nav>

            <Sidebar open={sidebarActive} onClose={() => setSidebarActive(false)} />
        </>
    );
};

export default TransporterNavbar; 