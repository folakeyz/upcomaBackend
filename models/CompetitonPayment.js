const mongoose = require("mongoose");

const competitonPaymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    competiton: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Competiton",
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

module.exports = mongoose.model("CompetitonPayment", competitonPaymentSchema);
