import { Schema, model } from "mongoose";

const restauranteSchema = new Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim: true
        },
        direccion: {
            type: String,
            required: [true, "La dirección es obligatoria"],
            trim: true
        },
        estado: {
            type: Boolean,
            default: true
        },
        usuario: {
            type: Schema.Types.ObjectId,
            ref: "Usuario", // Cambiar a "Usuario" si ese es el nombre del modelo de usuario es otro modelo
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model("Restaurante", restauranteSchema);
