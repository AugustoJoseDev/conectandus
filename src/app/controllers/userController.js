const express = require('express')
const authMiddleware = require('../middlewares/auth')
// const Post = require('../models/Post')

const User = require('../models/User')

const router = express.Router()

//Rota para obter os dados de todos os usuários
//Endpoint: GET /usres
router.get('/', async (req, res) => {
    try {
        const users = await User.find()

        return res.status(200).json({ users })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para obter os dados de um usuario dado um id
//Endpoint: GET /users/{id}
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findOne({ _id: id })

        if (!user) {
            return res.status(404).json({ error: 'Usuario não encontrado.' })
        }

        return res.status(200).json({ user })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

// ########## AUTHENTICAÇÃO NECESSÁRIA ##########
router.use(authMiddleware)


//Rota para alterar os dados de um usuario dado um id
//Endpoint: PUT /users/{id}
router.put('/:id', async (req, res) => {
    try {
        const { userId } = req.auth
        const { id } = req.params
        const data = req.body

        if (id != userId) {
            return res.status(403).json({ error: 'This user does not have sufficient permission to perform this action' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        delete data._id
        delete data.createdAt
        delete data.updatedAt
        delete data.resetPasswordToken
        delete data.resetPasswordExpires
        delete data.email

        user.set(data)

        try {
            await user.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await user.save()

        user.password = undefined

        return res.status(200).json({ user })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Unexpected error occurred' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { userId } = req.auth
        const { id } = req.params

        if (id != userId) {
            return res.status(403).json({ error: 'This user does not have sufficient permission to perform this action' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        await user.deleteOne()

        return res.status(200).json({ user })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Unexpected error occurred' })
    }
})

module.exports = app => app.use('/user', router)