import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import OrphanagesPage from '../pages/OrphanagesPage';
import OldAgeHomesPage from '../pages/OldAgeHomesPage';
import DonationPage from '../pages/DonationPage';
import VolunteerPage from '../pages/VolunteerPage';
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;