const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const debtorSchema = Schema(
  {
    clint: { type: Schema.Types.ObjectId, ref: "Clint" },
    name_clint: { type: String, required: true },
    debtor_clint: { type: Number, required: true },
    type: { type: String, required: true },
    amount_debtor: { type: Number, required: true },
    receipt_payment: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Debtor", debtorSchema);
