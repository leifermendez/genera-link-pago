const orders = require('../../models/orders')

const { getPaymentDetail } = require('../../services/stripe')

const postItem = async (req, res) => {
    try {
        const { id } = req.params
        console.log('-.-', id)
        const orderDetail = await orders.findOne({ localizator: id })
        console.log('orderDetail', orderDetail)
        const { status } = await getPaymentDetail(orderDetail.stripeId)
        const statusParse = status.includes('succe') ? 'success' : status
        await orders.findOneAndUpdate({ localizator: id }, { status: statusParse })
        res.send({ data: status })
    } catch (e) {
        console.log(e)
        res.status(500);
        res.send({ error: 'Algo ocurrio' })
    }
}

module.exports = { postItem }