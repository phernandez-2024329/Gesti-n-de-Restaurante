import {Schema, model} from 'mongoose';

const detallePedidoSchema = new Schema(
    {
        pedido: {
            type: Schema,
            required: [true, "El pedido es obligatorio"],
            trim: true
        },

        producto: {
            type: String,
            required: [true, "El producto es obligatorio"],
            trim: true
        },

        candidad_producto: {
            type: Number,
            required: [true, "La cantidad del producto es obligatoria"],
            min: [1, "La cantidad del producto debe ser mayor a 0"]
        },

        precio_unitario: {
            type: Number,
            required: [true, "El precio unitario es obligatorio"],
            min: 0
        },

        total: {
            type: Number,
        }
    },
    {
        timestamps: true
    }
);

export default model("DetallePedido", detallePedidoSchema);