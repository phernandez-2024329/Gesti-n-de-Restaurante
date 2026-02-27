'use strict';

import Usuario from '../src/models/user.model.js';
import { Roles } from '../src/constants/roles.js';

export const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await Usuario.findOne({ username: 'admin' });

        if (existingAdmin) {
            console.log(' Admin ya existe, omitiendo creación');
            return;
        }

        const admin = new Usuario({
            nombre:   'Administrador del Sistema',
            username: 'admin',
            email:    'admin@restaurante.com',
            password: 'Admin1234',
            telefono: '00000000',
            rol:      Roles.ADMIN,
            rol_id:   Roles.ADMIN,
            estado:   true
        });

        await admin.save();

        console.log(' Admin creado');
        console.log('   Email:    admin@restaurante.com');
        console.log('   Password: Admin1234');

    } catch (error) {
        console.error('Error creando admin:', error.message);
    }
};