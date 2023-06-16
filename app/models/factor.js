const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const factorSchema = Schema(
  {
    clint: { type: Schema.Types.ObjectId, ref: "Clint" },
    codeFactor: { type: Number, required: true },
    line: { type: Object },
    name_factor: { type: String },
    name_clint: { type: String },
    phone: { type: String },
    addresses: { type: String },
    priceTotal: { type: Number },
    discount: { type: Number },
    unpaid: { type: Boolean, default: true },
    debtor: { type: Boolean, default: false },
    debtorPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Factor", factorSchema);
