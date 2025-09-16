import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrphanagesPage from "./pages/OrphanagesPage";
import OldAgeHomesPage from "./pages/OldAgeHomesPage";
import DonationPage from './pages/DonationPage';
import Navbar from './components/Navbar';
import TransporterNavbar from './components/TransporterNavbar';
import AboutPage from './pages/AboutPage';
import UserProfile from './components/UserProfile'; // Update the import path
import TransporterProfile from './components/TransporterProfile';
import DonationSuccess from './components/DonationSuccess';
import TransporterRegister from './pages/TransporterRegister';
import TransportRequests from './pages/TransportRequests';
import "./styles/app.css";
import './styles/global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Check user role from localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                // Check if user is a transporter (has transporter-specific fields or role)
                if (user.role === 'transporter' || user.vehicle || user.route || user.isVolunteer !== undefined) {
                    setUserRole('transporter');
                } else {
                    setUserRole('donor');
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                setUserRole('donor'); // Default to donor
            }
        }
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const handleDonate = (facility) => {
        setSelectedFacility(facility);
        setSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
        setSelectedFacility(null);
    };

    // Check if user is logged in
    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null;
    };

    // Determine which navbar to render
    const renderNavbar = () => {
        if (userRole === 'transporter') {
            return <TransporterNavbar onMenuClick={toggleSidebar} />;
        }
        return <Navbar onMenuClick={toggleSidebar} />;
    };

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    {/* Auth routes without Navbar */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* All other routes with Navbar */}
                    <Route path="/*" element={
                        <>
                            {renderNavbar()}
                            <div className="content-wrapper">
                                <Sidebar 
                                    open={isSidebarOpen} 
                                    onClose={handleCloseSidebar} 
                                    facility={selectedFacility}
                                />
                                <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/register" />} />
                                        <Route path="/home" element={
                                            <ProtectedRoute>
                                                <HomePage />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/orphanages" element={
                                            <ProtectedRoute>
                                                <OrphanagesPage onDonate={handleDonate} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/oldagehomes" element={
                                            <ProtectedRoute>
                                                <OldAgeHomesPage onDonate={handleDonate} />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/donate/:type" element={
                                            <ProtectedRoute>
                                                <DonationPage />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/about" element={<AboutPage />} />
                                        <Route path="/profile" element={
                                            <ProtectedRoute>
                                                {userRole === 'transporter' ? <TransporterProfile /> : <UserProfile />}
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/donation-success" element={<DonationSuccess />} />
                                        <Route path="/transporter-register" element={<TransporterRegister />} />
                                        <Route path="/transport-requests" element={
                                            <ProtectedRoute>
                                                <TransportRequests />
                                            </ProtectedRoute>
                                        } />
                                    </Routes>
                                </main>
                            </div>
                        </>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = () => localStorage.getItem('token') !== null;
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default App;
