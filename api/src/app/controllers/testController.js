const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router()

//Rota de teste, retorna 200 OK se a aplicação estiver levantada
//Endpoint: GET /test
router.get('/', async (req, res) => {

    const {headers,body} = req

    console.log({headers,body});

    return res.status(200).json({headers,body})
})

//Rota de teste de autenticação, retorna 200 OK se a autenticação for aceita
//Endpoint: GET /test/auth
router.get('/auth',auth, async (req, res) => {

    const {auth,headers,body} = req

    console.log({auth,headers,body});

    return res.status(200).json({auth,headers,body})
})

//Exportação das rotas para a aplicação
module.exports = app => app.use('/test', router)
