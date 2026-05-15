import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true
        },
        message: {
            type: String,
            required: [true, 'El mensaje es obligatorio'],
            trim: true
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: [true, 'El user_id es obligatorio']
        },
        isRead: {
            type: Boolean,
            default: false
        },
        estado: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Notification', notificationSchema);