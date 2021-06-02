const { Schema, SchemaTypes, model } = require('../../database')

//Definição da estrutura da tabela de ordens de doações
const MatchSchema = new Schema({
    request: {
        type: SchemaTypes.ObjectId,
        ref: 'request',
        required: true
    },
    order: {
        type: SchemaTypes.ObjectId,
        ref: 'order',
        required: true
    },
    status: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    updatedAt: {
        type: Date
    }
}, { versionKey: false })

OrderSchema.pre('save', async function (next) {
    this.updatedAt = new Date()
    next()
})

const Match = model('match', OrderSchema)

module.exports = Match