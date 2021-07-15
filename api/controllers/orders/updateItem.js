const orders = require('../../models/orders')
const { generatePaymentIntent, generatePaymentMethod } = require('../../services/stripe')

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.body
        const resOrder = await orders.findOne({ localizator: id })
        const responseMethod = await generatePaymentMethod(token)
        const resPaymentIntent = await generatePaymentIntent(
            {
                amount: resOrder.amount,
                user: resOrder.name,
                payment_method: responseMethod.id
            }
        )

        await orders.findOneAndUpdate({ localizator: id }, {
            stripeId: resPaymentIntent.id
        })

        console.log(resPaymentIntent)
        // const oderRes = await confirmPaymentIntent(id, token)

        res.send({ data: resPaymentIntent })

    } catch (e) {
        console.log(e.message)
        res.status(500);
        res.send({ error: 'Algo ocurrio' })
    }
}

module.exports = { updateItem }