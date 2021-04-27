const express = require('express')
const authMiddleware = require('../middlewares/auth')
const EquipmentList = require('../models/EquipmentList')

const router = express.Router()


// ########## AUTHENTICAÇÃO NECESSÁRIA ##########

router.use(authMiddleware)

// ##############################################


//Rota para adicionar um novo tipo de equipamento na lista, autorizado apenas para super usuarios
//Endpoint: POST /equpments
router.post('/', async (req, res) => {
    try {

        if(!req.auth.superuser) return res.status(403).json({ error: 'Acesso negado' })

        const data = typeof req.body === 'string' ? {equipmentType: req.body}: req.body 

        delete data._id
        delete data.createdAt
        delete data.updatedAt

        const equipment = new EquipmentList(data)

        try {
            await equipment.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await equipment.save()

        return res.status(201).json({ equipment })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para obter a lista de equipamentos
//Endpoint: GET /equpments
router.get('/', async (req, res) => {
    try {
        const equipments = (await EquipmentList.find())

        return res.status(200).json({ equipments })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para obter os dados de um equipamento listado
//Endpoint: GET /equpments/{id}
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const equipment = await EquipmentList.findOne({ _id: id })

        if (!equipment) {
            return res.status(404).json({ error: 'Equipamento não encontrado.' })
        }

        return res.status(200).json({ equipment })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para alterar os dados de um equipamento listado, autorizado apenas para super usuarios
//Endpoint: PUT /equpments/{id}
router.put('/:id', async (req, res) => {
    
    try {

        if(!req.auth.superuser) return res.status(403).json({ error: 'Acesso negado' })

        const {id} = req.params
        const data = req.body

        const equipment = await EquipmentList.findById(id)

        if (!equipment) {
            return res.status(404).json({ error: 'Equipamento não encontrado.' })
        }

        delete data._id
        delete data.createdAt
        delete data.updatedAt

        equipment.set(data)

        try {
            await equipment.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await equipment.save()

        return res.status(200).json({ equipment })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para deletar um equipamento listado, autorizado apenas para super usuarios
//Endpoint: DELETE /equpments/{id}
router.delete('/:id', async (req, res) => {

    try {

        if(!req.auth.superuser) return res.status(403).json({ error: 'Acesso negado' })

        const {id} = req.params

        const equipment = await EquipmentList.findById(id)

        if (!equipment) {
            return res.status(404).json({ error: 'Equipamento não encontrado.' })
        }

        await equipment.deleteOne()

        return res.status(200).json({ equipment })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

module.exports = app => app.use('/equipments', router)