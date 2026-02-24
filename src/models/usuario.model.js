import {Schema, model} from 'mongoose';

const usuarioSchema = new Schema({
    idusuario: {
        type: String,
        required: [true, 'El ID de usuario es obligatorio'],
        unique: true
    },

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    surname: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },

    username:{
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true
    },

    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'El correo electrónico no es válido']
    },

    user_age: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
        min: [0, 'La edad no puede ser negativa']
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    
})