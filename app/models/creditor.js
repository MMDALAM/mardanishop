const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditorSchema = Schema(
  {
    clint: { type: Schema.Types.ObjectId, ref: "Clint" },
    name_clint: { type: String, required: true },
    type: { type: String, required: true },
    amount_creditor: { type: Number, required: true },
    receipt_payment: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Creditor", creditorSchema);
