// AviationTrack (Flight) Model
const AviationTrackSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
  },
  departure: {
    airport: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  arrival: {
    airport: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  pilot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model (pilot role)
  },
  status: {
    type: String,
    enum: ["scheduled", "delayed", "canceled", "completed"],
    default: "scheduled",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AviationTrack", AviationTrackSchema);
