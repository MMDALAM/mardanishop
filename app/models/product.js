const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    name: { type: String, required: true },
    amountOfPackages: { type: Number, required: true },
    numberPerPackage: { type: Number, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    price_retail: { type: Number, required: true },
    price_total: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
