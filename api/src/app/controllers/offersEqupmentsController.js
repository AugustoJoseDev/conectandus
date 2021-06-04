const express = require('express')
const authMiddleware = require('../middlewares/auth')

const Offer = require('../models/Offer')
const EquipmentList = require('../models/EquipmentList')

const router = express.Router()


// ########## AUTHENTICAÇÃO NECESSÁRIA ##########

router.use(authMiddleware)

// ##############################################




// ############################## ARRUMAR ##############################

// //Rota para adicionar uma ordem de doação de equipamento
// //Endpoint: POST /offers/{offerId}/equipments
// router.post('/:offerid/equipments/', async (req, res) => {
//     try {
//         const { user } = req.auth
//         const { offerId } = req.params
//         const data = req.body

//         delete data._id
//         delete data.createdAt
//         delete data.updatedAt

//         data.equipmentType = await EquipmentList.findOne({ equipmentType: data.equipmentType })

//         const offer = await Offer.findOne({ _id: offerId }).populate([ 'user', 'equipments.equipmentType' ])

//         offer.equipments.push(data)

//         try {
//             await offer.validate()
//         } catch (err) {
//             return res.status(400).json({ error: `${ err }` })
//         }

//         await offer.save()

//         return res.status(201).json({ offer })
//     } catch (err) {
//         console.warn(err)
//         return res.status(400).json({ error: 'Erro inesperado' })
//     }
// })

// //Rota para obter os dados de todas as ordens de doações de equipamentos
// //Endpoint: GET /offers
// router.get('/:offerid/equipments/', async (req, res) => {
//     try {

//         if (!req.auth.superuser) return res.status(403).json({ error: 'Acesso negado' })

//         const offers = await Offer.find().populate([ 'user', 'equipments.equipmentType' ])

//         return res.status(200).json({ offers })
//     } catch (err) {
//         console.warn(err)
//         return res.status(400).json({ error: 'Erro inesperado' })
//     }
// })

// //Rota para obter os dados de uma ordem de doação de equipamento dado um id
// //Endpoint: GET /offers/{id}
// router.get('/:offerid/equipments/:id', async (req, res) => {
//     try {
//         const { auth } = req

//         const { id } = req.params

//         const offer = await Offer.findOne({ _id: id }).populate([ 'user', 'equipments.equipmentType' ])

//         if (!offer) {
//             return res.status(404).json({ error: 'Ordem de doação não encontrada.' })
//         }

//         if (`${ offer.user._id }` !== `${ auth.user._id }` && !auth.superuser) {
//             return res.status(403).json({ error: 'Acesso negado!' })
//         }

//         return res.status(200).json({ offer })
//     } catch (err) {
//         console.warn(err)
//         return res.status(400).json({ error: 'Erro inesperado' })
//     }
// })

// ############################## ARRUMAR ##############################

//Rota para alterar os dados de uma ordem de doação de equipamento dado um id
//Endpoint: PUT /offers/{offerid}/equipments/{id}
router.put('/:offerid/equipments/:id', async (req, res) => {

    try {
        const { auth } = req
        const { offerid, id } = req.params
        const data = req.body

        const offer = await Offer.findOne({ _id: offerid }).populate([ 'user', 'equipments.equipmentType' ])

        if (!offer) {
            return res.status(404).json({ error: 'Ordem de doação não encontrada.' })
        }

        if (`${ offer.user._id }` !== `${ auth.user._id }` && !auth.superuser) {
            return res.status(403).json({ error: 'Acesso negado!' })
        }

        delete data._id
        delete data.createdAt
        delete data.updatedAt

        if (typeof data.equipmentType === 'string')
            data.equipmentType = await EquipmentList.findOne({ equipmentType: data.equipmentType })

        const [ equipment ] = await offer.equipments.filter(({ _id }) => _id == id)

        Object.assign(equipment, { ...equipment, ...data })

        try {
            await offer.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await offer.save()

        return res.status(200).json({ equipment })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

// //Rota para deletar uma ordem de doação de equipamento dado um id
// //Endpoint: DELETE /offers/{id}
// router.delete('/:offerid/equipments/:id', async (req, res) => {

//     try {
//         const { auth } = req
//         const { id } = req.params

//         const offer = await Offer.findById(id).populate('user')

//         if (!offer) {
//             return res.status(404).json({ error: 'Ordem de doação não encontrada.' })
//         }

//         if (`${ offer.user._id }` !== `${ auth.user._id }` && !auth.superuser) {
//             return res.status(403).json({ error: 'Acesso negado!' })
//         }

//         await offer.deleteOne()

//         return res.status(200).json({ offer })
//     } catch (err) {
//         console.warn(err)
//         return res.status(400).json({ error: 'Erro inesperado' })
//     }
// })

module.exports = app => app.use('/offers', router)