import {Schema, model} from "mongoose";

const Mesas = new Schema({
    Table_id: {
        type: Number,
        required: [true, 'El ID de la mesa es obligatorio'],
        unique: true
    },

    Table_name: {
        type: String,
        required: [true, 'El nombre de la mesa es obligatorio']
    },

    Table_Number: {
        type: Number,
        required: [true, 'El número de la mesa es obligatorio'],
        min: [1, 'El número de la mesa debe ser al menos 1']
    },

    Table_Ubication: {
        type: String,
        required: [true, 'La ubicación de la mesa es obligatoria']
    },

    Table_Capacity: {
        type: Number,
        required: [true, 'La capacidad de la mesa es obligatoria'],
        min: [1, 'La capacidad de la mesa debe ser al menos 1']
    },

    Table_time_available: {
        horario_inicio: {
            type: String,
            required: [true, 'El horario de inicio es obligatorio']
        },
        horario_fin: {
            type: String,
            required: [true, 'El horario de fin es obligatorio']
        }
    },

    Table_state: {
        type: String,
        required: [true, 'El estado de la mesa es obligatorio'],
        enum: ['Disponible', 'Ocupada', 'Reservada']
    },


    Restaurant_id: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurantes',
        required: [true, 'El ID del restaurante es obligatorio']
    },

    Reserva_id: {
        type: Schema.Types.ObjectId,
        ref: 'Reservas',
        required: [true, 'El ID de la reserva es obligatorio']
    }
});

export default model('Mesas', Mesas);