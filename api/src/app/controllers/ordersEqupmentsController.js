const express = require('express')
const authMiddleware = require('../middlewares/auth')

const Order = require('../models/Order')
const EquipmentList = require('../models/EquipmentList')

const router = express.Router()


// ########## AUTHENTICAÇÃO NECESSÁRIA ##########

router.use(authMiddleware)

// ##############################################




// ############################## ARRUMAR ##############################

// //Rota para adicionar uma ordem de doação de equipamento
// //Endpoint: POST /orders/{orderId}/equipments
// router.post('/:orderid/equipments/', async (req, res) => {
//     try {
//         const { user } = req.auth
//         const { orderId } = req.params
//         const data = req.body

//         delete data._id
//         delete data.createdAt
//         delete data.updatedAt

//         data.equipmentType = await EquipmentList.findOne({ equipmentType: data.equipmentType })

//         const order = await Order.findOne({ _id: orderId }).populate([ 'user', 'equipments.equipmentType' ])

//         order.equipments.push(data)

//         try {
//             await order.validate()
//         } catch (err) {
//             return res.status(400).json({ error: `${ err }` })
//         }

//         await order.save()

//         return res.status(201).json({ order })
//     } catch (err) {
//         console.warn(err)
//         return res.status(400).json({ error: 'Erro inesperado' })
//     }
// })

// //Rota para obter os dados de todas as ordens de doações de equipamentos
// //Endpoint: GET /orders
// router.get('/:orderid/equipments/', async (req, res) => {
//     try {

//         if (!req.auth.superuser) return res.status(403).json({ error: 'Acesso negado' })

//         const orders = await Order.find().populate([ 'user', 'equipments.equipmentType' ])

//         return res.status(200).json({ orders })
//     } catch (err) {
//         console.warn(err)
//         return res.status(400).json({ error: 'Erro inesperado' })
//     }
// })

// //Rota para obter os dados de uma ordem de doação de equipamento dado um id
// //Endpoint: GET /orders/{id}
// router.get('/:orderid/equipments/:id', async (req, res) => {
//     try {
//         const { auth } = req

//         const { id } = req.params

//         const order = await Order.findOne({ _id: id }).populate([ 'user', 'equipments.equipmentType' ])

//         if (!order) {
//             return res.status(404).json({ error: 'Ordem de doação não encontrada.' })
//         }

//         if (`${ order.user._id }` !== `${ auth.user._id }` && !auth.superuser) {
//             return res.status(403).json({ error: 'Acesso negado!' })
//         }

//         return res.status(200).json({ order })
//     } catch (err) {
//         console.warn(err)
//         return res.status(400).json({ error: 'Erro inesperado' })
//     }
// })

// ############################## ARRUMAR ##############################

//Rota para alterar os dados de uma ordem de doação de equipamento dado um id
//Endpoint: PUT /orders/{orderid}/equipments/{id}
router.put('/:orderid/equipments/:id', async (req, res) => {

    try {
        const { auth } = req
        const { orderid, id } = req.params
        const data = req.body

        const order = await Order.findOne({ _id: orderid }).populate([ 'user', 'equipments.equipmentType' ])

        if (!order) {
            return res.status(404).json({ error: 'Ordem de doação não encontrada.' })
        }

        if (`${ order.user._id }` !== `${ auth.user._id }` && !auth.superuser) {
            return res.status(403).json({ error: 'Acesso negado!' })
        }

        delete data._id
        delete data.createdAt
        delete data.updatedAt

        if (typeof data.equipmentType === 'string')
            data.equipmentType = await EquipmentList.findOne({ equipmentType: data.equipmentType })

        const [ equipment ] = await order.equipments.filter(({ _id }) => _id == id)

        Object.assign(equipment, { ...equipment, ...data })

        try {
            await order.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await order.save()

        return res.status(200).json({ equipment })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

// //Rota para deletar uma ordem de doação de equipamento dado um id
// //Endpoint: DELETE /orders/{id}
// router.delete('/:orderid/equipments/:id', async (req, res) => {

//     try {
//         const { auth } = req
//         const { id } = req.params

//         const order = await Order.findById(id).populate('user')

//         if (!order) {
//             return res.status(404).json({ error: 'Ordem de doação não encontrada.' })
//         }

//         if (`${ order.user._id }` !== `${ auth.user._id }` && !auth.superuser) {
//             return res.status(403).json({ error: 'Acesso negado!' })
//         }

//         await order.deleteOne()

//         return res.status(200).json({ order })
//     } catch (err) {
//         console.warn(err)
//         return res.status(400).json({ error: 'Erro inesperado' })
//     }
// })

module.exports = app => app.use('/orders', router)