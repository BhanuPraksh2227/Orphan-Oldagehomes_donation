import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({ name: '', phone: '', address: '', email: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', formData);

            if (response.data?.token) {
                // Make sure all user data is properly stored
                const userData = {
                    id: response.data.user._id || response.data.user.id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    phone: response.data.user.phone || '',
                    address: response.data.user.address || '',
                    donations: response.data.user.donations || []
                };

                // Debug log to check data
                console.log('Storing user data:', userData);

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userData', JSON.stringify(userData));
                setUser(userData);
                navigate('/home');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch {
                setUser({ name: '', phone: '', address: '', email: '' });
            }
        }
    }, []);

    console.log(localStorage.getItem('userData'));

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-image">
                    <img src="/images/dona5.webp" alt="Welcome Back" />
                </div>
                
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Continue your journey of helping others</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={user.name || ''} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" value={user.phone || ''} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" value={user.address || ''} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" value={user.email || ''} readOnly />
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <p className="auth-redirect">
                            Don't have an account? <a href="/register">Register here</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;