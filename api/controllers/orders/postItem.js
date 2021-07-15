const orders = require('../../models/orders')
const { generatePaymentIntent } = require('../../services/stripe')

const postItem = async (req, res) => {
    try {
        const { amount, name } = req.body
        const oderRes = await orders.create({
            name,
            amount
        })


        res.send({ data: oderRes })
    } catch (e) {
        res.status(500);
        res.send({ error: 'Algo ocurrio' })
    }
}

module.exports = { postItem }