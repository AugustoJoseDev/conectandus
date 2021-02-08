const express = require('express')
const ejs = require('ejs')
const path = require('path')

const app = express()

app.set('ejs', ejs.renderFile)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', express.static(path.join(__dirname, '../public')))


app.get('/', (req, res) => {

    return res.render('base', { titulo: 'teste' })

})

app.listen(8080, () => {
    console.log(`Rodando em http://localhost:8080`)
})