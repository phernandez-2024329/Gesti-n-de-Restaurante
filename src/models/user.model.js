import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            minlength: [2, 'Mínimo 2 caracteres']
        },
        username: {
            type: String,
            required: [true, 'El username es obligatorio'],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: [3, 'Mínimo 3 caracteres']
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Email inválido']
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [8, 'Mínimo 8 caracteres']
        },
        telefono: {
            type: String,
            required: [true, 'El teléfono es obligatorio'],
            match: [/^\d{8}$/, 'El teléfono debe tener 8 dígitos']
        },
        rol: {
            type: String,
            enum: ['ADMIN', 'GERENTE', 'MESERO', 'CLIENTE'],
            default: 'CLIENTE'
        },
        restauranteAsignado: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurante',
            default: null
        },
        estado: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

// Hash automático de contraseña al guardar
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Comparar contraseña para el login
usuarioSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Ocultar password al responder JSON
usuarioSchema.methods.toJSON = function () {
    const { password, __v, ...usuario } = this.toObject();
    return usuario;
};

export default model('Usuario', usuarioSchema);