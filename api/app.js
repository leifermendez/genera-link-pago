require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

const { dbConnect } = require('./handler/dbHandler')

const PORT = 3000 || process.env.PORT;

/** Routers */
app.use(require('./routers'))

/** Conectamos con la base de datos */
dbConnect()

app.listen(PORT, () => {
    console.log(`Servidor listo escuchando por el puerto ${PORT}`);
})