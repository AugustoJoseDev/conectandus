const { Schema, model } = require('../../database')

//Definição da extrutura da tabela de equipamentos
const EquipmentListSchema = new Schema({
    equipmentType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    updatedAt: {
        type: Date
    }
}, { versionKey: false })

const EquipmentList = model('equipment-list', EquipmentListSchema)

module.exports = EquipmentList
