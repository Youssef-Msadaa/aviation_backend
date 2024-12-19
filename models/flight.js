const mongoose = require('mongoose');

// Schéma des sièges
const seatSchema = new mongoose.Schema({
  seatId: { type: String, required: true },
  available: { type: Boolean, required: true, default: true },
});

// Schéma du vol
const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  timeDeparture: { type: String, required: true },
  estimatedArrival: { type: String, required: true },
  businessClassPrice: { type: Number, required: true },
  economyClassPrice: { type: Number, required: true },
  seats: {
    business: [seatSchema],
    economy: [seatSchema],
  },
},{collection: "Flights" });

module.exports = mongoose.model('Flight', flightSchema);
