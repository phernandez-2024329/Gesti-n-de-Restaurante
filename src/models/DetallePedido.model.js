import { Schema, model } from "mongoose";

const detallePedidoSchema = new Schema(
  {
    pedido: {
      type: Schema.Types.ObjectId,
      ref: "Pedido",
      required: [true, "El pedido es obligatorio"]
    },
    producto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
      required: [true, "El producto es obligatorio"]
    },
    candidadproducto: {
      type: Number,
      required: [true, "La cantidad del producto es obligatoria"],
      min: [1, "La cantidad del producto debe ser mayor a 0"]
    },
    preciounitario: {
      type: Number,
      required: [true, "El precio unitario es obligatorio"],
      min: 0
    },
    total: {
      type: Number,
      required: true
    },
    estado: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default model("DetallePedido", detallePedidoSchema);
