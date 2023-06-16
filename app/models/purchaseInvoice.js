const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseInvoiceSchema = Schema(
  {
    nameFactor: { type: String, unique: true, required: true },
    namePart: { type: String, required: true },
    nameVisitor: { type: String, required: true },
    images: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseInvoice", purchaseInvoiceSchema);
