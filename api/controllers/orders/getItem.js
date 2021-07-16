const orders = require('../../models/orders')

//TODO: Buscamos en la base de datos si existe una orden con el localizador

const getItem = async (req, res) => {
    const { id } = req.params
    const userData = await orders.findOne({ localizator: id })
    res.send({ data: userData })
}

module.exports = { getItem }