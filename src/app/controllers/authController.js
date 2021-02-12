const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authConfig = require('../../../config/auth.json')
const mailer = require('../../services/mailer')
const crypto = require('crypto')

const User = require('../models/User')

const router = express.Router()

function login(id) {
    return jwt.sign({ id }, authConfig.secret, {
        expiresIn: 86400 //Um dia em segundos
    })
}

//Rota para registrar um novo usuario
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

        user.senha = undefined

        const token = login(user._id)

        return res.status(201).json({ user, token })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Erro inesperado' })
    }
})

router.post('/authenticate', async (req, res) => {
    try {
        const { email, senha } = req.body

        const user = await User.findOne({ email }).select('+senha')

        if (!user) {
            return res.status(400).json({ error: 'Usuario não encontrado.' })
        }

        if (!await bcrypt.compare(senha, user.password)) {
            return res.status(400).json({ error: 'Senha incorreta!' })
        }

        user.senha = undefined

        const token = login(user._id)

        return res.status(200).json({ user, token })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Unexpected error occurred' })
    }
})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        const resetPasswordToken = crypto.randomBytes(20).toString('hex')

        const { accepted } = await mailer.sendMail({
            from: 'no-reply@post.com',
            to: email,
            subject: 'Forgot password?',
            html: `<p>Esqueceu a sua senha? Utilize este token para redefini-la: <br/>UserId: ${ user._id } <br/>Token: ${ resetPasswordToken }</p><p>Esse token expira em 1 hora!</p>`
        })

        if (!accepted) {
            return res.status(500).json({ error: 'Unable to send mail' })
        }

        const now = new Date()
        const resetPasswordExpires = now.setHours(now.getHours() + 1)

        user.set({
            resetPasswordToken,
            resetPasswordExpires
        })

        await user.save()

        return res.sendStatus(200)
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Unexpected error occurred' })
    }

})

router.post('/reset_password', async (req, res) => {
    try {

        const { userId, token: resetPasswordToken, password } = req.body

        if (resetPasswordToken === undefined) {
            return res.status(400).send({ error: 'No token provided' })
        }

        const user = await User.findById(userId).select('+resetPasswordToken resetPasswordExpires')

        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        if (resetPasswordToken !== user.resetPasswordToken) {
            return res.status(400).json({ error: 'Invalid token' })
        }

        if (new Date() > user.resetPasswordExpires) {
            return res.status(400).json({ error: 'This token has expired' })
        }

        user.set({
            password,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined
        })

        await user.save()

        user.password = undefined

        const token = login(user._id)

        return res.status(200).json({ user, token })
    } catch (err) {
        console.warn(err)
        return res.status(400).json({ error: 'Unexpected error occurred' })
    }
})

module.exports = app => app.use('/auth', router)