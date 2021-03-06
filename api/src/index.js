const express = require('express')
const cors = require('cors')

//criação do app
const app = express()


//Habilitando CORS, para usar como API
app.use(cors())

//Configuração para tratar requisições em JSON
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//Importando controladores
require('./app/controllers')(app)

//Iniciando a aplicação
app.listen(5000, () => {
    console.log(`Escutando em http://localhost:5000`)
})