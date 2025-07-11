import { useState } from 'react';
import api from '../services/api';
import '../styles/main.css';

const timeSlots = [
  '10:00 AM - 12:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM'
];

const activities = [
  { value: 'teaching', label: 'Teaching' },
  { value: 'reading', label: 'Reading with Children' },
  { value: 'playing', label: 'Playing Games' },
  { value: 'medical_checkup', label: 'Medical Check-up' },
  { value: 'general_visit', label: 'General Visit' }
];

const VolunteerPage = () => {
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    activityType: '',
    numberOfPeople: 1,
    facility: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/volunteer', formData);
      setSuccess('Volunteer schedule submitted successfully!');
      setFormData({
        date: '',
        timeSlot: '',
        activityType: '',
        numberOfPeople: 1,
        facility: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Volunteer Registration</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="date">Select Date</label>
            <input
              type="date"
              id="date"
              className="input-field"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="timeSlot">Time Slot</label>
            <select
              id="timeSlot"
              className="input-field"
              value={formData.timeSlot}
              onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              required
            >
              <option value="">Select Time Slot</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="activityType">Activity Type</label>
            <select
              id="activityType"
              className="input-field"
              value={formData.activityType}
              onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
              required
            >
              <option value="">Select Activity</option>
              {activities.map(activity => (
                <option key={activity.value} value={activity.value}>
                  {activity.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="numberOfPeople">Number of People</label>
            <input
              type="number"
              id="numberOfPeople"
              className="input-field"
              value={formData.numberOfPeople}
              onChange={(e) => setFormData({ 
                ...formData, 
                numberOfPeople: parseInt(e.target.value) 
              })}
              min="1"
              max="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message (Optional)</label>
            <textarea
              id="message"
              className="input-field"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="4"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerPage;