const { Schema, SchemaTypes, model } = require('../../database')
const bcrypt = require('bcrypt')

//Definição da extrutura da tabela de usuarios
const UserSchema = new Schema({
    nomeCompleto: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        validate: /^[0-9]{11}$/   //Expressão regular para valiadar cpf 11 digitos númericos
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: /^.+?@.+?(\..+?)+$/   //Expressão regular simples para valiadar email
    },
    senha: {
        type: String,
        required: true,
        select: false
    },
    dataNascimento: {
        type: Date,
        require: true
    },
    telefone: {
        type: String,
        validate: /^[0-9]{9,13}$/   //Expressão regular para valiadar numeros de telefones de 9 a 13 digitos númericos
    },
    endereco: {
        cep: {
            type: String,
            require: true,
            validate: /^[0-9]{8}$/  //Expressão regular para valiadar CEP com 8 digitos númericos
        },
        rua: {
            type: String,
            require: true,
        },
        numero: {
            type: String,
            require: true,
        },
        bairro: {
            type: String,
            require: true,
        },
        complemento: {
            type: String
        }
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpires: {
        type: Date,
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
    if (this.senha) {
        const hash = await bcrypt.hash(this.password, 10)
        this.senha = hash
    }
    this.updatedAt = new Date()
    next()
})

const User = model('User', UserSchema)

module.exports = User