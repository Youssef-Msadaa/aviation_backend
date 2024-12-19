const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Flights = require("../models/flight");



// API Route to retrieve flights based on search criteria (POST)
router.post("/", async (req, res) => {
  try {
    const { fromLocation, toLocation, travelDates } = req.body; 
    let query = {};

    // Create query object based on form input
    if (fromLocation) query.from = fromLocation;
    if (toLocation) query.to = toLocation;
    if (travelDates) query.date = travelDates;

    console.log('Generated Query:', query);

    // Fetch flights from database
    const flights = await Flights.find(query);

    // Check the result before sending response
    console.log('Found flights:', flights);

    if (flights.length > 0) {
      res.status(200).json(flights); // Return found flights
    } else {
      res.status(404).json({ message: "No flights found matching your criteria." });
    }
  } catch (err) {
    console.error('❌ Error fetching flights:', err);
    res.status(500).send({ error: "Failed to fetch flights" });
  }
});


// Export the flight routes
module.exports = router;
