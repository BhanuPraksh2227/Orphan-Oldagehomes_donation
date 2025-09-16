import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        role: 'donor' // Add role field with default value
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            if (formData.role === 'donor') {
                // Handle donor registration
                const registerData = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    phone: formData.phone.trim(),
                    address: formData.address.trim()
                };

                console.log('Sending donor registration data:', registerData);

                const response = await api.post('/auth/register', registerData);

                console.log('Registration response:', response.data);

                if (response.data) {
                    // Store complete user data with all fields
                    const userData = {
                        id: response.data._id || response.data.id,
                        name: registerData.name,
                        email: registerData.email,
                        phone: registerData.phone,
                        address: registerData.address,
                        donations: [] // Initialize empty donations array
                    };

                    // Store in localStorage
                    localStorage.setItem('userData', JSON.stringify(userData));
                    console.log('Stored user data:', userData);

                    // Show success message and redirect to home page
                    alert('Registration successful! Welcome to our donation platform.');
                    navigate('/');
                }
            } else if (formData.role === 'transporter') {
                // Handle transporter registration - redirect to transporter register page
                // Store basic info in localStorage for transporter registration
                const transporterData = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    address: formData.address.trim()
                };
                
                localStorage.setItem('transporterBasicInfo', JSON.stringify(transporterData));
                navigate('/transporter-register');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(
                err.response?.data?.message || 
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-image">
                    <img src="/images/dona1.jpg" alt="Helping Hands" />
                </div>
                
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Join us in making a difference</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="error-message">{error}</div>}
                        
                        <div className="form-group">
                            <label htmlFor="role">Register as</label>
                            <div className="input-group">
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <option value="donor">Donor</option>
                                    <option value="transporter">Transporter</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-group">
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-group">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-group">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-group">
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="input-group">
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <div className="input-group">
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating Account...' : `Register as ${formData.role === 'donor' ? 'Donor' : 'Transporter'}`}
                        </button>

                        <p className="auth-redirect">
                            Already have an account? <a href="/login">Login here</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;