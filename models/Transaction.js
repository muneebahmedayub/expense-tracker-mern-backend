const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    income: {
        type: Boolean,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Transactions', transactionSchema)