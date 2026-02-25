import {Schema, model} from 'mongoose';

const Menu = new Schema({
    Menu_id: {
        type: Number,
        required: true,
        unique: true
    },

    Menu_Plate: {
        type: String,
        required: [ true, 'el nombre del plato es obligatorio' ]
    },

    Menu_Price: {
        type: Number,
        required: [ true, 'el precio del plato es obligatorio' ]
    },

    Menu_Drink: {
        type: String,
        required: [ true, 'el nombre de la bebida es obligatoria' ]
    },

    Menu_type_plate: {
        type: String,
        required: [ true, 'el tipo de plato es obligatorio' ],
        enum: ['Entrada', 'Plato fuerte', 'Postre',]
    },

    Menu_type_drink: {
        type: String,
        required: [ true, 'el tipo de bebida es obligatorio' ],
        enum: ['Cerveza', 'Vinos', 'Licores', 'Cocteles', 
            'shots', 'Bebidas sin alcohol', 'Bebidas calientes']
    },

    Menu_Promotion: {
        type: String,
        enum: ['Promoción Familiar', 'Promoción de Quincena', 'Promoción de Cliente frecuente', 
            'Promoción de Temporada', 'Promoción de Aniversario'],
    },

    Menu_description_plate: {
        type: String,
        required: [ true, 'la descripción del plato es obligatoria' ]
    },

    Restaurant_id: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurantes',
        required: [ true, 'el ID del restaurante es obligatorio' ]
    }
})