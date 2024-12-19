const mongoose = require('mongoose');

// Reservation schema
const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',    // Link to Users model
    required: true
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',   // Link to Flight model
    required: true
  },
  seatId: {
    type: String,    // ID of the reserved seat
    required: true
  },
  seatClass: {
    type: String,
    enum: ['economy', 'business'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'], // Pending until confirmed, can be cancelled
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model from this schema
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
