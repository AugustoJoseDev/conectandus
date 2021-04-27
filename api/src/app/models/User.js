const { Schema,SchemaTypes, model } = require('../../database')
const bcrypt = require('bcryptjs')

//Definição da extrutura da tabela de usuarios
const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        validate: /^[0-9]{11}$/   //Expressão regular para valiadar cpf com 11 digitos númericos
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: /^.+?@.+?(\..+?)+$/   //Expressão regular simples para valiadar email
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    birthdate: {
        type: SchemaTypes.Date,
        require: true
    },
    phone: {
        type: String,
        validate: /^[0-9]{9,13}$/   //Expressão regular para valiadar numeros de telefones de 9 a 13 digitos númericos
    },
    address: {
        zipcode: {
            type: String,
            require: true,
            validate: /^[0-9]{8}$/  //Expressão regular para valiadar CEP com 8 digitos númericos
        },
        street: {
            type: String,
            require: true,
        },
        number: {
            type: String,
            require: true,
        },
        neighborhood: {
            type: String,
            require: true,
        },
        complement: {
            type: String
        }
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    updatedAt: {
        type: Date
    }
}, { versionKey: false })

UserSchema.pre('save', async function (next) {
    if (this.password) {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }
    this.updatedAt = new Date()
    next()
})

const User = model('user', UserSchema)

module.exports = User