const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const authConfig = require('../../../config/auth.json')
const User = require('../models/User')


function authorizationHandler({ authorization }) {

    if (!authorization) {
        return { error: "Autenticação necessária!" }
    }

    if (/^Bearer [\w+/-]+\.[\w+/-]+\.[\w+/-]+$/i.test(authorization)) {

        const [ format, token ] = authorization.split(/ /)

        return { format, token }

    } else if (/^Basic [0-9a-z+/=]+$/i.test(authorization)) {

        const [ format, base64encoded ] = authorization.split(/ /)
        const [ login, password ] = Buffer.from(base64encoded, 'base64').toString().split(/:/)

        return { format, login, password }

    } else {
        return { error: `Autenticação necessária!` }
    }

}

module.exports = async (req, res, next) => {
    try {
        const authorization = authorizationHandler(req.headers)

        if (authorization.error) {
            const { error } = authorization
            return res.status(401).json({ error })
        }

        switch (authorization.format) {
            case 'Bearer':

                const { token } = authorization

                jwt.verify(token, authConfig.secret, async (err, encoded) => {

                    if (err) return res.status(401).json({ error: "Autenticação necessária!" })

                    const user = await User.findOne({ _id: encoded._id })

                    if (!user) {
                        return res.status(401).json({ error: "Usuario não encontrado." })
                    }

                    req.auth = { user }

                    next()

                })

                break

            case 'Basic':

                const { login, password } = authorization

                const user = await User.findOne({ $or: [ { email: login }, { cpf: login } ] }).select('+password')

                if (!user) {
                    return res.status(401).json({ error: "Usuario não encontrado." })
                }

                if (!await bcrypt.compare(password, user.password)) {
                    return res.status(401).json({ error: 'Senha incorreta.' })
                }

                user.password = undefined

                req.auth = { user }

                next()

                break
            default:
        }

    } catch (err) {
        console.warn(err)
        return res.status(401).json({ error: 'Erro inesperado, não foi possivel autenticar usuario.' })
    }

}
