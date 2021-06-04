const { Schema, SchemaTypes, model } = require('../../database')
const EquipmentSchema = require('./EquipmentSchema')

//Definição da extrutura da tabela de ordens de doações
const OfferSchema = new Schema({
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
        required: true
    },
    equipments: {
        type: [ EquipmentSchema ],
        validate: v => v.length > 0
    },
    description: {
        type: String,
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

OfferSchema.pre('save', async function (next) {
    this.updatedAt = new Date()
    next()
})

const Offer = model('offer', OfferSchema)

module.exports = Offer