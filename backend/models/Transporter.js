const mongoose = require('mongoose');

const transporterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  vehicle: { type: String, required: true },
  route: { type: String, required: true },
  isVolunteer: { type: Boolean, default: false },
  chargePerTrip: { type: Number } // <-- Add this line
});

module.exports = mongoose.model('Transporter', transporterSchema);