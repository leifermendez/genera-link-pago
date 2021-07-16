const orders = require('../../models/orders')
const { generatePaymentIntent, generatePaymentMethod } = require('../../services/stripe')

//TODO: Buscamos orden y genramos intencion de pago

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.body

        //TODO: Buscamos orden en nuestra base de datos

        const resOrder = await orders.findOne({ localizator: id })

        //TODO: Generamos metodo de pago en Stripe

        const responseMethod = await generatePaymentMethod(token) //TODO: 🔴 Token magico!

        //TODO: Generamos intencion de pago

        const resPaymentIntent = await generatePaymentIntent(
            {
                amount: resOrder.amount,
                user: resOrder.name,
                payment_method: responseMethod.id
            }
        )

        //TODO: Actualizamos  orden con id de intencion de pago
        await orders.findOneAndUpdate({ localizator: id }, {
            stripeId: resPaymentIntent.id
        })

        res.send({ data: resPaymentIntent })

    } catch (e) {
        console.log(e.message)
        res.status(500);
        res.send({ error: 'Algo ocurrio' })
    }
}

module.exports = { updateItem }