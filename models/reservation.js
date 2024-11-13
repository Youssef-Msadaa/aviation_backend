// Reservation Model
const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AviationTrack",
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "pending", "canceled"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
