const express = require('express')
const Request = require('../models/Request')
const authMiddleware = require('../middlewares/auth')
const Order = require('../models/Order')

const router = express.Router()


// ########## AUTHENTICAÇÃO NECESSÁRIA ##########

// router.use(authMiddleware)

// ##############################################


//Rota para obter a lista de combinações entre doações e solicitações
//Endpoint: GET /matching
router.get('/', async (req, res) => {
    try {

        const requests = await Request.find().populate([ 'user', 'equipments.equipmentType' ])
        const orders = await Order.find().populate([ 'user', 'equipments.equipmentType' ])

        const requestEquipments = []

        console.log(
            requests.reduce((list, request) => {


                list.push(request.equipments)

            }, []))



    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

module.exports = app => app.use('/matching', router)