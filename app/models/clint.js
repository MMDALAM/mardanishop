const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clintSchema = Schema(
  {
    name: { type: String, unique: true, required: true },
    addresses: { type: String, required: true },
    phone: { type: String, required: true },
    debtor: { type: Number, required: true },
    creditor: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clint", clintSchema);
