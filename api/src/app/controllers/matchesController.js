const express = require('express')
const Request = require('../models/Request')
const authMiddleware = require('../middlewares/auth')
const Offer = require('../models/Offer')
const EquipmentList = require('../models/EquipmentList')
const Match = require('../models/Match')

const router = express.Router()


// ########## AUTHENTICAÇÃO NECESSÁRIA ##########

router.use(authMiddleware)
router.use((req, res, next) => {

    if (!req.auth.superuser) return res.status(403).json({ error: 'Acesso negado' })

    next()

})

// ##############################################


//Rota para obter a lista de possíveis combinações entre doações e solicitações
//Endpoint: GET /matches/list
router.get('/list', async (req, res) => {
    try {

        //Realiza as consultas
        const matches = await Match.find().populate([
            { path: 'request', populate: { path: 'user' } },
            { path: 'offer', populate: { path: 'user' } },
            'requestEquipment.equipmentType',
            'offerEquipment.equipmentType'
        ])
        const requests = await Request.find().populate([ 'user', 'equipments.equipmentType' ])
        const offers = await Offer.find().populate([ 'user', 'equipments.equipmentType' ])
        const equipmentTypes = await EquipmentList.find()

        //Obtem a lista do equipamentos das solicitações
        const requestEquipments = requests.reduce((list, request) => {

            return [ ...list, ...request.equipments
                .filter(eq => matches.filter(m => `${ m.requestEquipment._id }` == `${ eq._id }`).length === 0)
                .map(e => ({ _id: e._id, equipmentType: e.equipmentType, createdAt: e.createdAt, request }))
            ]

        }, [])

        //Obtem a lista do equipamentos das ofertas de doações
        const offersEquipments = offers.reduce((list, offer) => {

            return [ ...list, ...offer.equipments
                .filter(eq => matches.filter(m => `${ m.offerEquipment._id }` == `${ eq._id }`).length === 0)
                .filter(e => !e.repairNeed)
                .map(e => ({ _id: e._id, equipmentType: e.equipmentType, repairNeed: e.repairNeed, createdAt: e.createdAt, offer }))
            ]

        }, [])


        //Ordena os equipamentos por ordem de data (do mais antigo para o mais novo)
        requestEquipments.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
        offersEquipments.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))


        const potentialMatches = []

        equipmentTypes.forEach(equipmentType => {

            let requestEquipmentsFiltered = requestEquipments.filter(e => `${ e.equipmentType._id }` == `${ equipmentType._id }`)
            let offersEquipmentsFiltered = offersEquipments.filter(e => `${ e.equipmentType._id }` == `${ equipmentType._id }`)

            while (requestEquipmentsFiltered.length > 0 && offersEquipmentsFiltered.length > 0) {

                let match = {

                    equipmentType,
                    requestEquipment: requestEquipmentsFiltered.shift(),
                    offerEquipment: offersEquipmentsFiltered.shift(),
                    status: 'Em análise'

                }

                match.offer = match.offerEquipment.offer
                match.request = match.requestEquipment.request

                potentialMatches.push(match)

            }

        })

        return res.status(200).json({
            matches: [ ...potentialMatches, ...matches ]
        })

    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})


//Rota para adicionar uma doação de equipamento
//Endpoint: POST /matches
router.post('/', async (req, res) => {
    try {
        const data = req.body

        delete data._id
        delete data.createdAt
        delete data.updatedAt

        const offer = await Offer.findOne({ _id: data.offer }).populate([ 'user', 'equipments.equipmentType' ])
        const request = await Request.findOne({ _id: data.request }).populate([ 'user', 'equipments.equipmentType' ])

        if (!offer) {
            return res.status(404).json({ error: 'Ordem de doação não encontrada.' })
        }

        if (!request) {
            return res.status(404).json({ error: 'Solicitação de doação não encontrada.' })
        }


        const [ offerEquipment ] = offer.equipments.filter(e => `${ e._id }` == `${ data.offerEquipment }`)
        const [ requestEquipment ] = request.equipments.filter(e => `${ e._id }` == `${ data.requestEquipment }`)

        const match = new Match()

        match.set({
            offer,
            request,
            offerEquipment,
            requestEquipment,
            status: 'Aplicada'
        })

        try {
            await match.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await match.save()

        return res.status(201).json({ match })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para alterar os dados de uma doação de equipamento dado um id
//Endpoint: PUT /matches/{id}
router.put('/:id', async (req, res) => {

    try {
        const { id } = req.params
        const data = req.body
        const match = await Match.findById(id)

        if (!match) {
            return res.status(404).json({ error: 'Doação não encontrada.' })
        }

        delete data._id
        delete data.createdAt
        delete data.updatedAt

        match.set(data)

        try {
            await match.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await match.save()

        return res.status(200).json({ match })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})


module.exports = app => app.use('/matches', router)