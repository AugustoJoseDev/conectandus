const express = require('express')
const authMiddleware = require('../middlewares/auth')
const EquipmentList = require('../models/EquipmentList')

const Request = require('../models/Request')

const router = express.Router()


// ########## AUTHENTICAÇÃO NECESSÁRIA ##########

router.use(authMiddleware)

// ##############################################


//Rota para adicionar uma solicitação de equipamento
//Endpoint: POST /requests
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

        const request = new Request(data)

        request.user = user._id

        try {
            await request.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await request.save()

        return res.status(201).json({ request })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para obter os dados de todas as solicitações de equipamentos
//Endpoint: GET /requests
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find().populate(['user', 'equipments.equipmentType'])

        return res.status(200).json({ requests })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para obter os dados de uma solicitação de equipamento dado um id
//Endpoint: GET /requests/{id}
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const request = await Request.findOne({ _id: id }).populate(['user', 'equipments.equipmentType'])

        if (!request) {
            return res.status(404).json({ error: 'Solicitação não encontrada.' })
        }

        return res.status(200).json({ request })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para alterar os dados de uma solicitação de equipamento dado um id
//Endpoint: PUT /requests/{id}
router.put('/:id', async (req, res) => {
    
    try {
        const {auth} = req
        const {id} = req.params
        const data = req.body

        const request = await Request.findById(id).populate(['user', 'equipments.equipmentType'])

        if (!request) {
            return res.status(404).json({ error: 'Solicitação não encontrada.' })
        }

        if (`${request.user._id}` !== `${auth.user._id}` && !auth.superuser) {
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

        request.set(data)

        try {
            await request.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await request.save()

        return res.status(200).json({ request })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para deletar uma solicitação de equipamento dado um id
//Endpoint: DELETE /requests/{id}
router.delete('/:id', async (req, res) => {

    try {
        const {auth} = req
        const {id} = req.params

        const request = await Request.findById(id).populate(['user', 'equipments.equipmentType'])

        if (!request) {
            return res.status(404).json({ error: 'Solicitação não encontrada.' })
        }

        if (`${request.user._id}` !== `${auth.user._id}` && !auth.superuser) {
            return res.status(403).json({ error: 'Acesso negado!'})
        }

        await request.deleteOne()

        return res.status(200).json({ request })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

module.exports = app => app.use('/requests', router)