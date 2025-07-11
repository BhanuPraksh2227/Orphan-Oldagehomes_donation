const mongoose = require('mongoose');

const volunteerTimeSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  activityType: {
    type: String,
    enum: ['teaching', 'reading', 'playing', 'medical_checkup', 'general_visit'],
    required: true
  },
  numberOfPeople: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed'],
    default: 'pending'
  }
});

module.exports = mongoose.model('VolunteerTime', volunteerTimeSchema);