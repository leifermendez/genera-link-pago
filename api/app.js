require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

const { dbConnect } = require('./handler/dbHandler')

const PORT = 3000 || process.env.PORT;

//TODO: Importamos rutas

app.use(require('./routers'))

//TODO: Conectamos con base de datos

dbConnect()

app.listen(PORT, () => {
    console.log(`Servidor listo escuchando por el puerto ${PORT}`);
})