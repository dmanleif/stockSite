const mongoose = require("mongoose")

const StockSchema = new mongoose.Schema({
    ticker: {
      type: String,
      required: true,
    },
    purchasePrice: {
        type: Number,
        required: false,
    },
    sellThresholdPrice: {
        type: Number,
        required: false,
    },
    amountBought: {
        type: Number,
        required: false,
    }
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock