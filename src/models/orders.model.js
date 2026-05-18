import {Schema, model} from 'mongoose';

const Orders = new Schema({
    Orders_id: {
        type: String,
        required: [true, 'El ID del pedido es obligatorio'],
        unique: true
    },

    Orders_domicile: {
        type: String,
        required: [true, 'La dirección de domicilio es obligatoria']
    },

    Orders_number: {
        type: Number,
        required: [true, 'El número de la orden es obligatorio'],
        unique: true
    },

    Orders_cupon: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
        default: null
    },

    Orders_status: {
        type: String,
        enum: ['en_preparacion', 'listo', 'entregado', 'cancelado'],
        default: 'en_preparacion'
    },

    Restaurant_id: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'El ID del restaurante es obligatorio']
    },

    Menu_id: {
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        required: [true, 'El ID del menú es obligatorio']
    },

    User_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID del usuario es obligatorio']
    },

    detallePedidos: [{
        type: Schema.Types.ObjectId,
        ref: 'DetallePedido'
    }],

    estado: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default model('Orders', Orders);