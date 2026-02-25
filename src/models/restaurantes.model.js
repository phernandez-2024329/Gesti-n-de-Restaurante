import { Schema, model } from "mongoose";

<<<<<<< HEAD
const Restaurantes = new Schema(
=======
const restauranteSchema = new Schema(
>>>>>>> ft/kevin
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
<<<<<<< HEAD
            ref: "Usuario", 
=======
            ref: "Usuario", // Cambiar a "Usuario" si ese es el nombre del modelo de usuario es otro modelo
>>>>>>> ft/kevin
            required: true
        }
    },
    {
        timestamps: true
    }
);

<<<<<<< HEAD
export default model("Restaurante", Restaurantes);
=======
export default model("Restaurante", restauranteSchema);
>>>>>>> ft/kevin
