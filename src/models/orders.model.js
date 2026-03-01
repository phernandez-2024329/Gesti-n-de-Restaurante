import { Schema, model } from 'mongoose';

const ordersSchema = new Schema({
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
        type: String,
        required: [true, 'El número de la orden es obligatorio']
    },
    Orders_cupon: {
        type: String,
        enum: ['Cupon_30_Quetzales', 'Cupon_20%_Descuento', 'Dos_Por_Uno',
            'Envio_Gratis', 'Primera_Compra', 'Descuento_10%', 'Cupon_50_Quetzales',
            'Cupon_15%_Descuento'],
    },
    Orders_facture: {
        type: String,
        required: [true, 'La factura es obligatoria']
    },
    Orders_facture_descripcion: {
        type: String,
        required: [true, 'La descripción de la factura es obligatoria']
    },
    Restaurant_id: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurante',
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
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default model('Order', ordersSchema);