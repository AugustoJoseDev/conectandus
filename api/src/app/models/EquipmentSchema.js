const { Schema, SchemaTypes } = require('../../database')

//Definição da extrutura da tabela de equipamentos
const EquipmentSchema = new Schema({
    equipmentType: {
        type: SchemaTypes.ObjectId,
        ref: 'equipment-list',
        required: true
    },
    repairNeed: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    updatedAt: {
        type: Date
    }
}, { versionKey: false })

module.exports = EquipmentSchema