const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const Flight = require('../models/flight');
const User = require('../models/users');

// Route: Confirm and Pay
// Route to create reservation and process payment at the same time
router.post('/create-and-confirm', async (req, res) => {
  try {
    const { flightId, seatId, seatClass, date, paymentDetails, userName } = req.body; // User input

    // 1. Check if the flight exists and is available
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    // 2. Check seat availability
    const seat = flight.seats[seatClass].find(s => s.seatId === seatId);
    if (!seat || !seat.available) {
      return res.status(400).json({ error: 'Seat is not available' });
    }

    // 3. Create the reservation before processing payment
    const newReservation = new Reservation({
      user: req.user.id, // User who is logged in
      flight: flightId,
      seatId: seatId,
      seatClass: seatClass,
      date: date,
      status: 'pending',   // Initially 'pending'
      paymentStatus: 'pending',
      userName: userName,  // Captured from frontend
    });

    // Save the reservation
    await newReservation.save();

    // Mark the seat as unavailable since it's reserved
    seat.available = false;
    await flight.save();


    // 5. After successful payment, update reservation status
    newReservation.status = 'confirmed';
    newReservation.paymentStatus = 'paid';
    await newReservation.save();

    // Optionally, update the available seat status in the Flight model
    flight.seats[seatClass].find(s => s.seatId === seatId).available = false;
    await flight.save();

    // 6. Return the successful reservation confirmation
    res.status(200).json({
      message: 'Reservation created and confirmed successfully',
      reservation: newReservation
    });
  } catch (error) {
    console.error('Error during reservation creation and payment:', error);
    res.status(500).json({ error: 'Server error during reservation creation and payment' });
  }
});

  
module.exports = router;
