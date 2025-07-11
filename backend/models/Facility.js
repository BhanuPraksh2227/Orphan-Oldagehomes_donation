const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['orphanage', 'oldAgeHome'] },
  description: String,
  location: {
    city: String,
    state: String
  },
  capacity: {
    total: Number,
    current: Number
  },
  needs: [String],
  contactInfo: {
    phone: String,
    email: String
  }
});

module.exports = mongoose.model('Facility', facilitySchema);