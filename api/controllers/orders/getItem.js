const orders = require('../../models/orders')

const getItem = async (req, res) => {
    const { id } = req.params
    console.log(id)
    const userData = await orders.findOne({ localizator: id })
    res.send({ data: userData })
}

module.exports = { getItem }