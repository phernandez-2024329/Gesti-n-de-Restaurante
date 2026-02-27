import { Schema, model } from 'mongoose';

const informationSchema = new Schema(
    {
        information: {
            type: String,
            required: [true, 'El contenido de la información es obligatorio'],
            trim: true
        },
        title: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true
        },
        type: {
            type: String,
            trim: true,
            default: ''
        },
        statistics: {
            type: Schema.Types.Mixed,
            default: {}
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurante',
            required: [true, 'El id del restaurante es obligatorio']
        },
        estado: {
            type: Boolean,
            default: true
        },
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        }
    },
    { timestamps: true }
);

export default model('Information', informationSchema);
