import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import TransporterDashboard from '../pages/TransporterDashboard';
import OrphanagesPage from '../pages/OrphanagesPage';
import OldAgeHomesPage from '../pages/OldAgeHomesPage';
import DonationPage from '../pages/DonationPage';
import VolunteerPage from '../pages/VolunteerPage';
import TransporterRegister from '../pages/TransporterRegister';
import TransportRequests from '../pages/TransportRequests';
import TransporterProfile from '../components/TransporterProfile';
import AboutPage from '../pages/AboutPage';
import TransporterAboutPage from '../pages/TransporterAboutPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/orphanages" element={<OrphanagesPage />} />
      <Route path="/oldagehomes" element={<OldAgeHomesPage />} />
      <Route 
        path="/donate/:facilityId?" 
        element={
          <ProtectedRoute>
            <DonationPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/volunteer/:facilityId?" 
        element={
          <ProtectedRoute>
            <VolunteerPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/transporter-register" element={<TransporterRegister />} />
      <Route 
        path="/transporter-dashboard" 
        element={
          <ProtectedRoute>
            <TransporterDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transport-requests" 
        element={
          <ProtectedRoute>
            <TransportRequests />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transporter-profile" 
        element={
          <ProtectedRoute>
            <TransporterProfile />
          </ProtectedRoute>
        } 
      />
      <Route path="/about" element={<AboutPage />} />
      <Route 
        path="/transporter-about" 
        element={
          <ProtectedRoute>
            <TransporterAboutPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;