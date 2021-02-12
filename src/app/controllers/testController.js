const express = require('express')

const router = express.Router()

//Rota de teste, retorna 200 OK se a aplicação estiver levantada
//Endpoint: GET /test
router.get('/', async (req, res) => {
    return res.sendStatus(200)
})

//Exportação das rotas para a aplicação
module.exports = app => app.use('/test', router)
