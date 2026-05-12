import { Schema, model } from "mongoose";

const detallePedidoSchema = new Schema(
  {
    orders_id: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
      required: [true, "El ID de la orden es obligatorio"]
    },
    producto: {
      type: Schema.Types.ObjectId,
      required: [true, "El ID del producto es obligatorio"]
    },
    productType: {
      type: String,
      enum: ['dish', 'beverage'],
      required: [true, "El tipo de producto es obligatorio"]
    },
    recipe_id: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      default: null
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
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "El ID del restaurante es obligatorio"]
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
