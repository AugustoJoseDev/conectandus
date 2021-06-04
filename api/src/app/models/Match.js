const { Schema, SchemaTypes, model } = require('../../database')
const EquipmentSchema = require('./EquipmentSchema')

//Definição da estrutura da tabela de ordens de doações
const MatchSchema = new Schema({
    request: {
        type: SchemaTypes.ObjectId,
        ref: 'request',
        required: true
    },
    offer: {
        type: SchemaTypes.ObjectId,
        ref: 'offer',
        required: true
    },
    requestEquipment: {
        type: EquipmentSchema,
        required: true
    },
    offerEquipment: {
        type: EquipmentSchema,
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

MatchSchema.pre('save', async function (next) {
    this.updatedAt = new Date()
    next()
})

const Match = model('match', MatchSchema)

module.exports = Match