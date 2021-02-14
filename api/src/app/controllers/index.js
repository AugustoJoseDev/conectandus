const fs = require('fs')
const path = require('path')

//Este arquivo apenas importa todos os outros arquivos da mesma pasta quando é invocado

module.exports = app => {
    fs.readdirSync(__dirname)
        .filter(file => file.charAt(0) !== '.' && file !== 'index.js')
        .forEach(file => require(path.resolve(__dirname, file))(app))
}