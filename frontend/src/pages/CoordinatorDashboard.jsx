import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/main.css';

const CoordinatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('donations');
  const [data, setData] = useState({
    donations: [],
    volunteers: [],
    residents: [],
    inventory: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (tab) {
        case 'donations':
          endpoint = '/donations';
          break;
        case 'volunteers':
          endpoint = '/volunteer';
          break;
        case 'residents':
          endpoint = '/residents';
          break;
        case 'inventory':
          endpoint = '/inventory';
          break;
      }
      const response = await api.get(endpoint);
      setData(prev => ({ ...prev, [tab]: response.data }));
    } catch (err) {
      setError(`Failed to fetch ${tab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId, newStatus, type) => {
    try {
      await api.patch(`/${type}/${itemId}`, { status: newStatus });
      await fetchData(activeTab);
      setShowModal(false);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1 className="title">Facility Management Dashboard</h1>
      {error && <div className="error">{error}</div>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          Donations
        </button>
        <button 
          className={`tab ${activeTab === 'volunteers' ? 'active' : ''}`}
          onClick={() => setActiveTab('volunteers')}
        >
          Volunteers
        </button>
        <button 
          className={`tab ${activeTab === 'residents' ? 'active' : ''}`}
          onClick={() => setActiveTab('residents')}
        >
          Residents
        </button>
        <button 
          className={`tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
      </div>

      <div className="dashboard-content">
        <table className="table">
          <thead>
            <tr>
              {activeTab === 'donations' && (
                <>
                  <th>Type</th>
                  <th>Donor</th>
                  <th>Amount/Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              )}
              {activeTab === 'volunteers' && (
                <>
                  <th>Name</th>
                  <th>Activity</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              )}
              {activeTab === 'residents' && (
                <>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Join Date</th>
                  <th>Medical Needs</th>
                  <th>Actions</th>
                </>
              )}
              {activeTab === 'inventory' && (
                <>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data[activeTab].map((item) => (
              <tr key={item._id}>
                {/* Render cells based on activeTab */}
                {activeTab === 'donations' && (
                  <>
                    <td>{item.type}</td>
                    <td>{item.donor?.name || 'Anonymous'}</td>
                    <td>{item.amount || item.quantity}</td>
                    <td>
                      <span className={`status ${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowModal(true);
                        }}
                      >
                        Manage
                      </button>
                    </td>
                  </>
                )}
                {/* Add similar sections for other tabs */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <h2>Manage {activeTab.slice(0, -1)}</h2>
            {/* Render modal content based on activeTab */}
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorDashboard;