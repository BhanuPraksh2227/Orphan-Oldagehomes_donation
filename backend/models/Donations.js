const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['money', 'food', 'clothes', 'books', 'health']
  },
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true,
    validate: {
      validator: function(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: props => `${props.value} is not a valid facility ID!`
    }
  },
  // Money specific
  amount: {
    type: Number,
    required: function() {
      return this.type === 'money';
    }
  },
  // Non-money specific
  quantity: {
    type: Number,
    required: function() {
      return this.type !== 'money';
    }
  },
  pickupAddress: {
    type: String,
    required: function() {
      return this.type !== 'money';
    }
  },
  // Type specific details
  foodType: {
    type: String,
    required: function() {
      return this.type === 'food';
    }
  },
  clothesType: {
    type: String,
    required: function() {
      return this.type === 'clothes';
    }
  },
  bookType: {
    type: String,
    required: function() {
      return this.type === 'books';
    }
  },
  kitType: {
    type: String,
    required: function() {
      return this.type === 'health';
    }
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'collected', 'completed']
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);