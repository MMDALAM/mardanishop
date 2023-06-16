const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lineSchema = Schema({
    factor: { type: Schema.Types.ObjectId, ref: 'Factor' },
    product: { type : Schema.Types.ObjectId, ref:'Product' },
    name_product: { type: String, required: true },
    price_retail: { type: Number, required: true },
    number_retail: { type: Number, required: true },
    number_total: { type: Number, required: true },
    type: { type: String, required: true },
    price_total: { type: Number, required: true },
    cut: { type: Number, required: true },
    priceTotal: { type: Number, required: true },
}, { timestamps: true })

module.exports = mongoose.model('Line' , lineSchema);