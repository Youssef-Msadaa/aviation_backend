const express = require('express');
const router = express.Router();
const Flight = require('../models/flight');

// Route to get available seats for a specific flight
router.get('/:flightId/seats/:class', async (req, res) => {
  const { flightNumber, class: seatClass } = req.params;

  try {
    // Fetch flight data
    const flight = await Flight.findOne(flightNumber);

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Get available seats for the requested class
    const availableSeats = flight.seats[seatClass]?.filter(seat => seat.available);
    console.log(availableSeats);
    

    if (!availableSeats) {
      return res.status(400).json({ message: `Invalid class: ${seatClass}` });
    }

    res.json({
      flightId: flight._id,
      class: seatClass,
      availableSeats,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});


// Route to reserve a seat for a flight
/*router.post('/:flightId/seats/:class/reserve', async (req, res) => {
    const { flightNumber, class: seatClass } = req.params;
    const { seatId } = req.body; // Seat ID from the request body
  
    try {
      const flight = await Flight.findOne(flightNumber);
  
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
  
      // Find the target seat in the given class
      const seatIndex = flight.seats[seatClass]?.findIndex(seat => seat.seatId === seatId);
  
      if (seatIndex === -1) {
        return res.status(404).json({ message: `Seat ${seatId} not found in ${seatClass} class` });
      }
  
      // Check if the seat is available
      if (!flight.seats[seatClass][seatIndex].available) {
        return res.status(400).json({ message: `Seat ${seatId} is already reserved` });
      }
  
      // Reserve the seat (mark as unavailable)
      flight.seats[seatClass][seatIndex].available = false;
  
      // Decrement seat count for the class
      const remainingSeats = flight.seats[seatClass].filter(seat => seat.available).length;
      flight[`${seatClass}AvailableSeats`] = remainingSeats;
  
      // Save the updated flight document
      await flight.save();
  
      res.json({
        message: `Seat ${seatId} reserved successfully`,
        availableSeats: remainingSeats,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });*/
  
  

module.exports = router;
