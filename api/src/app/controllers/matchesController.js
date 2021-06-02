const express = require('express')
const Request = require('../models/Request')
const authMiddleware = require('../middlewares/auth')
const Order = require('../models/Order')
const EquipmentList = require('../models/EquipmentList')
const e = require('express')

const router = express.Router()


// ########## AUTHENTICAÇÃO NECESSÁRIA ##########

// router.use(authMiddleware)

// ##############################################


//Rota para obter a lista de combinações entre doações e solicitações
//Endpoint: GET /matches
router.get('/', async (req, res) => {
    try {

        //Realiza as consultas
        const requests = await Request.find().populate([ 'user', 'equipments.equipmentType' ])
        const orders = await Order.find().populate([ 'user', 'equipments.equipmentType' ])
        const equipmentTypes = await EquipmentList.find()

        //Obtem a lista do equipamentos das solicitações
        const requestEquipments = requests.reduce((list, request) => {

            return [ ...list, ...request.equipments.map(e => ({ _id: e._id, equipmentType: e.equipmentType, createdAt: e.createdAt, request })) ]

        }, [])

        //Obtem a lista do equipamentos das intenções de doações
        const ordersEquipments = orders.reduce((list, order) => {

            return [ ...list, ...order.equipments.filter(e => !e.repairNeed).map(e => ({ _id: e._id, equipmentType: e.equipmentType, repairNeed: e.repairNeed, createdAt: e.createdAt, order })) ]

        }, [])


        //Ordena os equipamentos por ordem de data (do mais antigo para o mais novo)
        requestEquipments.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
        ordersEquipments.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))


        const matches = []

        equipmentTypes.forEach(equipmentType => {

            let requestEquipmentsFiltered = requestEquipments.filter(e => `${ e.equipmentType._id }` == `${ equipmentType._id }`)
            let ordersEquipmentsFiltered = ordersEquipments.filter(e => `${ e.equipmentType._id }` == `${ equipmentType._id }`)

            while (requestEquipmentsFiltered.length > 0 && ordersEquipmentsFiltered.length > 0) {

                matches.push({

                    equipmentType,

                    requestEquipment: requestEquipmentsFiltered.shift(),
                    orderEquipment: ordersEquipmentsFiltered.shift()

                })

            }

        })

        return res.status(200).json({
            matches
        })

    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

module.exports = app => app.use('/matches', router)