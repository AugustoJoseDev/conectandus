const express = require('express')
const jwt = require('jsonwebtoken')
const authConfig = require('../../../config/auth.json')
const mailer = require('../../services/mailer')
const crypto = require('crypto')
const authMiddleware = require('../middlewares/auth')

const User = require('../models/User')

const router = express.Router()

function login(_id) {
    return jwt.sign({ _id }, authConfig.secret, {
        expiresIn: 86400 //Um dia em segundos
    })
}

//Rota para cadastrar um novo usuario
//Endpoint: POST /auth/register
router.post('/register', async (req, res) => {
    try {

        const data = req.body
        const { email, cpf } = data

        if (await User.exists({ email })) {
            return res.status(400).json({ error: 'Este E-Mail já está sendo usado!' })
        }

        if (await User.exists({ cpf })) {
            return res.status(400).json({ error: 'Este CPF já está sendo usado!' })
        }

        delete data._id
        delete data.createdAt
        delete data.updatedAt
        delete data.resetPasswordToken
        delete data.resetPasswordExpires

        const user = new User(data)

        try {
            await user.validate()
        } catch (err) {
            return res.status(400).json({ error: `${ err }` })
        }

        await user.save()

        user.password = undefined

        const token = login(user._id)

        return res.status(201).json({ user, token })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para fazer login ou renovar seção e obter um token de acesso
//Endpoint: POST /auth/authenticate
router.post('/authenticate',authMiddleware, async (req, res) => {
    try {
        const { user } = req.auth

        const token = login(user._id)

        if(req.auth.superuser) user.superuser = true

        return res.status(200).json({ user, token })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

//Rota para solicitar e-mail de recuperação de senha
//Endpoint: POST /auth/forgot_password
router.post('/forgot_password', async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ error: 'Usuario não encontrado.' })
        }

        const resetPasswordToken = crypto.randomBytes(16).toString('base64')

        const ticket = jwt.sign({ email, resetPasswordToken }, authConfig.secret, {
            expiresIn: 3600 //Uma hora em segundos
        })

        const { accepted } = await mailer.sendMail({
            from: 'no-reply@conectandus.org.br',
            to: email,
            subject: 'Esqueceu a senha?',
            html: `<p>Esqueceu a sua senha? Utilize este ticket para redefini-la: ${ ticket }</p><p>Esse ticket expira em uma hora e só pode ser usado uma vez!</p>`
        })

        if (!accepted) {
            return res.status(500).json({ error: 'Não foi possivel enviar E-mail de recuperação de senha.' })
        }

        user.set({
            resetPasswordToken
        })

        await user.save()

        return res.sendStatus(200)
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }

})

//Rota para criar uma nova senha após receber o e-mail de recuperação de senha
//Endpoint: POST /auth/reset_password
router.post('/reset_password', async (req, res) => {
    try {

        const { ticket, password } = req.body

        if (ticket === undefined) {
            return res.status(400).send({ error: 'Nenhum ticket foi fornecido.' })
        }

        let decoded 
        try {
            decoded = jwt.verify(ticket,authConfig.secret,)
        } catch (error) {
            return res.status(400).send({ error: 'O ticket fornecido não é válido.' })
        }

        const {email, resetPasswordToken } = decoded

        const user = await User.findOne({email}).select('+resetPasswordToken')

        if (!user) {
            return res.status(404).json({ error: 'Usuario não encontrado.' })
        }

        if (resetPasswordToken !== user.resetPasswordToken) {
            return res.status(400).json({ error: 'O ticket fornecido já foi usado.' })
        }

        user.set({
            password,
            resetPasswordToken: undefined
        })

        await user.save()

        user.password = undefined

        const token = login(user._id)

        return res.status(200).json({ user, token })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

module.exports = app => app.use('/auth', router)