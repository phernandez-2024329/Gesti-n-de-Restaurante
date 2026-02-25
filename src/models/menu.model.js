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
        enum: ['Entrada', 'Plato_fuerte', 'Postre',]
    },

    Menu_type_drink: {
        type: String,
        required: [ true, 'el tipo de bebida es obligatorio' ],
        enum: ['Cerveza', 'Vinos', 'Licores', 'Cocteles', 
            'shots', 'Bebidas_sin_alcohol', 'Bebidas_calientes']
    },

    Menu_Promotion: {
        type: String,
        enum: ['Promoción_Familiar', 'Promoción_de_Quincena', 'Promoción_de_Cliente_frecuente', 
            'Promoción_de_Temporada', 'Promoción_de_Aniversario'],
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