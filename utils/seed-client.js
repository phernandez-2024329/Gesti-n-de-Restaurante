'use strict';

import Usuario from '../src/models/user.model.js';
import { Roles } from '../src/constants/roles.js';

export const createDefaultClient = async () => {
    try {
        const existing = await Usuario.findOne({ email: 'cliente@restaurante.com' });

        if (existing) {
            console.log(' Cliente demo ya existe, omitiendo creación');
            return;
        }

        const client = new Usuario({
            nombre: 'Cliente Demo',
            username: 'cliente',
            email: 'cliente@restaurante.com',
            password: 'Cliente1234',
            telefono: '12345678',
            rol: Roles.CLIENTE,
            rol_id: Roles.CLIENTE,
            estado: true,
        });

        await client.save();

        console.log(' Cliente demo creado');
        console.log('   Email:    cliente@restaurante.com');
        console.log('   Password: Cliente1234');
    } catch (error) {
        console.error('Error creando cliente demo:', error.message);
    }
};
