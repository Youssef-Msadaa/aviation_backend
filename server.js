const express = require("express");
const cors = require("cors");

require("./config/connect");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const flightRoute = require("./routes/flights"); // Import flight routes
const userroute = require("./routes/users");
const seatRoute = require("./routes/flightSeats");
const PaymentRoute = require("./routes/confirmandpay");
const adminroute = require("./routes/admins");
app.use(express.json());
app.use("/users", userroute);
app.use("/api/flights", flightRoute); // Use flight routes here
app.use("/api/seatsflight", seatRoute);
app.use("/api/payment", PaymentRoute);
app.use("/admin", adminroute);

app.listen(3000, () => {
  console.log("server works successfully");
});
