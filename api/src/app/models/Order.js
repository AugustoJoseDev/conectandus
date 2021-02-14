const { Schema,SchemaTypes, model } = require('../../database')

//Definição da extrutura da tabela de ordens de doações
const OrderSchema = new Schema({
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    equipment: {
        type: String,
        required: true
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

OrderSchema.pre('save', async function (next) {
    this.updatedAt = new Date()
    next()
})

const Order = model('Order', OrderSchema)

module.exports = Order