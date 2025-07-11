import { useNavigate } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = ({ open, onClose, facility }) => {
    const navigate = useNavigate();

    const donationItems = [
        { text: 'Money Donation', path: '/donate/money', icon: '💰' },
        { text: 'Food Donation', path: '/donate/food', icon: '🍱' },
        { text: 'Clothes Donation', path: '/donate/clothes', icon: '👕' },
        { text: 'Books Donation', path: '/donate/books', icon: '📚' },
        { text: 'Health Kit Donation', path: '/donate/health', icon: '🏥' }
    ];

    const handleDonationClick = (path) => {
        try {
            // Close sidebar using the prop
            if (onClose) {
                onClose();
            }

            // Navigate to donation form with facility data
            const facilityData = sessionStorage.getItem('selectedFacility');
            navigate(path, { state: { facility: facilityData } });

        } catch (error) {
            console.error('Error in handleDonationClick:', error);
        }
    };

    return (
        <>
            <aside className={`sidebar ${open ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <button className="close-btn" onClick={onClose}>&times;</button>
                    {facility && <h3>{facility.name}</h3>}
                </div>
                
                <div className="donation-list">
                    {donationItems.map((item) => (
                        <button
                            key={item.text}
                            className="donation-button"
                            onClick={() => handleDonationClick(item.path)}
                        >
                            <span className="donation-icon">{item.icon}</span>
                            <span className="donation-text">{item.text}</span>
                        </button>
                    ))}
                </div>
            </aside>
            {open && <div className="sidebar-overlay" onClick={onClose}></div>}
        </>
    );
};

export default Sidebar;