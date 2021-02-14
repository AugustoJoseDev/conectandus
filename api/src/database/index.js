const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

//importando arquivo de configurações do banco de dados
const { host, dbname } = require('../../config/database.json')

//importando certificado para conexão
const credentials = fs.readFileSync(path.resolve('certs/database/credentials.pem'))

//estabelecendo conexão
mongoose.connect(
    `${ host }/${ dbname }?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority`,
    {
        sslKey: credentials,
        sslCert: credentials,
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    err => {
        if (err) {
            console.error('Não foi possivel conectar-se ao banco de dados.')
            process.exit(1)
        } else {
            console.log('Conexão com o banco de dados realizada com sucesso!')
        }
    }
)

mongoose.Promise = global.Promise

module.exports = mongoose