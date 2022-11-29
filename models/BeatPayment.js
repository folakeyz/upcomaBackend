const mongoose = require("mongoose");

const beatPaymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    beat: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Beat",
    },

    paymentMethod: {
      type: String,
      default: "Paystack",
    },
    paymentResult: {
      message: { type: String },
      redirecturl: { type: String },
      reference: { type: String },
      status: { type: String },
      trans: { type: String },
      transaction: { type: String },
      trxref: { type: String },
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BeatPayment", beatPaymentSchema);
