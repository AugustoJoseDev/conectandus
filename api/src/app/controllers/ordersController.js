const express = require('express')
const authMiddleware = require('../middlewares/auth')

const Order = require('../models/Order')
const EquipmentList = require('../models/EquipmentList')

const router = express.Router()


// ########## AUTHENTICAÇÃO NECESSÁRIA ##########

router.use(authMiddleware)

// ##############################################


//Rota para adicionar uma ordem de doação de equipamento
//Endpoint: POST /orders
router.post('/', async (req, res) => {
    try {

        const data = req.body
        const {user} = req.auth

        delete data._id
        delete data.createdAt
        delete data.updatedAt

        if(data.equipments instanceof Array ){
            for (const i in data.equipments) {
                
                let e = data.equipments[i]

                if(typeof e === 'string')
                    e = {equipmentType: e}
                
                e.equipmentType = await EquipmentList.findOne({equipmentType:e.equipmentType})

                data.equipments[i] = e
            }
        }

        const order = new Order(data)

        order.user = user._id

        try {
            await order.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await order.save()

        return res.status(201).json({ order })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para obter os dados de todas as ordens de doações de equipamentos
//Endpoint: GET /orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate(['user', 'equipments.equipmentType'])

        return res.status(200).json({ orders })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para obter os dados de uma ordem de doação de equipamento dado um id
//Endpoint: GET /orders/{id}
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const order = await Order.findOne({ _id: id }).populate(['user', 'equipments.equipmentType'])

        if (!order) {
            return res.status(404).json({ error: 'Ordem de doação não encontrada.' })
        }

        return res.status(200).json({ order })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para alterar os dados de uma ordem de doação de equipamento dado um id
//Endpoint: PUT /orders/{id}
router.put('/:id', async (req, res) => {
    
    try {
        const {auth} = req
        const {id} = req.params
        const data = req.body
        const order = await Order.findById(id).populate(['user', 'equipments.equipmentType'])

        if (!order) {
            return res.status(404).json({ error: 'Ordem de doação não encontrada.' })
        }

        if (`${order.user._id}` !== `${auth.user._id}` && !auth.superuser) {
            return res.status(403).json({ error: 'Acesso negado!'})
        }

        delete data._id
        delete data.createdAt
        delete data.updatedAt

        if(data.equipments instanceof Array ){
            for (const i in data.equipments) {
                
                let e = data.equipments[i]

                if(typeof e === 'string')
                    e = {equipmentType: e}
                
                e.equipmentType = await EquipmentList.findOne({equipmentType:e.equipmentType})

                data.equipments[i] = e
            }
        }

        order.set(data)

        try {
            await order.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await order.save()

        return res.status(200).json({ order })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para deletar uma ordem de doação de equipamento dado um id
//Endpoint: DELETE /orders/{id}
router.delete('/:id', async (req, res) => {

    try {
        const {auth} = req
        const {id} = req.params

        const order = await Order.findById(id).populate('user')

        if (!order) {
            return res.status(404).json({ error: 'Ordem de doação não encontrada.' })
        }

        if (`${order.user._id}` !== `${auth.user._id}` && !auth.superuser) {
            return res.status(403).json({ error: 'Acesso negado!'})
        }

        await order.deleteOne()

        return res.status(200).json({ order })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

module.exports = app => app.use('/orders', router)