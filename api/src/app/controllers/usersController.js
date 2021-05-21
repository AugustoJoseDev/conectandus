const express = require('express')
const authMiddleware = require('../middlewares/auth')

const User = require('../models/User')

const router = express.Router()


// ########## AUTHENTICAÇÃO NECESSÁRIA ##########

router.use(authMiddleware)

// ##############################################


//Rota para obter os dados de todos os usuários
//Endpoint: GET /users
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

//Rota para alterar os dados de um usuario dado um id
//Endpoint: PUT /users/{id}
router.put('/:id', async (req, res) => {
    try {
        const { auth } = req
        const { id } = req.params
        const data = req.body

        if (`${ auth.user._id }` !== `${ id }` && !auth.superuser) {
            return res.status(403).json({ error: 'Acesso negado!' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ error: 'Usuario não encontrado.' })
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
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para deletar um usuario dado um id
//Endpoint: DELETE /users/{id}
router.delete('/:id', async (req, res) => {
    try {
        const { auth } = req
        const { id } = req.params

        if (`${ auth.user._id }` !== `${ id }` && !auth.superuser) {
            return res.status(403).json({ error: 'Acesso negado!' })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ error: 'Usuario não encontrado.' })
        }

        await user.deleteOne()

        return res.status(200).json({ user })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

module.exports = app => app.use('/users', router)