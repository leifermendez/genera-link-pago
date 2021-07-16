const mongoose = require('mongoose')
const nanoid = require('nanoid')

const OrdersSchema = new mongoose.Schema({
    name: {
        type: String
    },
    amount: {
        type: Number
    },
    localizator: {
        type: String,
        default: () => nanoid.nanoid()
    },
    stripeId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['success', 'fail', 'wait'],
        default: 'wait'
    }
},
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongoose.model('orders', OrdersSchema);