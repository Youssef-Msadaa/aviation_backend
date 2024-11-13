// Payment Model
const PaymentSchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["paid", "pending", "failed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);
