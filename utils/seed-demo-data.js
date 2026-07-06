'use strict';

import Contact from '../src/models/contact.model.js';
import Table from '../src/models/table.model.js';
import Restaurant from '../src/models/restaurant.model.js';
import Menu from '../src/models/menu.model.js';

export const createDemoData = async () => {
    try {
        const existingMenu = await Menu.findOne({ Menu_id: 1 });
        if (existingMenu) {
            console.log(' Datos demo ya existen, omitiendo seed');
            return;
        }

        let contact = await Contact.findOne({ contact_email: 'demo@omakase.gt' });
        if (!contact) {
            contact = await Contact.create({
                contact_type: 'Gerente',
                contact_name: 'María Demo',
                contact_position: 'Gerente',
                contact_phone_number: '55551234',
                contact_email: 'demo@omakase.gt',
                estado: true,
            });
        }

        let table = await Table.findOne({ table_number: 1 });
        if (!table) {
            table = await Table.create({
                table_name: 'Mesa Principal',
                table_number: 1,
                table_ubication: 'Salón',
                table_capacity: 4,
                table_time_available: '10:00-22:00',
                table_state: 'Disponible',
                estado: true,
            });
        }

        let restaurant = await Restaurant.findOne({ restaurant_name: 'Omakase Demo' });
        if (!restaurant) {
            restaurant = await Restaurant.create({
                restaurant_name: 'Omakase Demo',
                restaurant_type: 'Gourmet',
                restaurant_type_gastronomic: 'Japonés',
                restaurant_direction: 'Zona 10, Ciudad de Guatemala',
                restaurant_time_start: '10:00',
                restaurant_time_close: '22:00',
                restaurant_mean_price: 150,
                contact_id: contact._id,
                table_id: table._id,
                lat: 14.6349,
                lng: -90.5069,
                hasLocation: true,
                estado: true,
            });
        }

        await Menu.insertMany([
            {
                Menu_id: 1,
                Menu_Plate: 'Sushi Roll Especial',
                Menu_Price: 85,
                Menu_Drink: 'Agua mineral',
                Menu_type_plate: 'Plato_fuerte',
                Menu_type_drink: 'Bebidas_sin_alcohol',
                Menu_description_plate: 'Roll de salmón, aguacate y queso crema',
                Menu_ingredients: ['salmón', 'aguacate', 'arroz', 'alga nori'],
                Menu_available: true,
                Restaurant_id: restaurant._id,
            },
            {
                Menu_id: 2,
                Menu_Plate: 'Ramen Tradicional',
                Menu_Price: 65,
                Menu_Drink: 'Té verde',
                Menu_type_plate: 'Plato_fuerte',
                Menu_type_drink: 'Bebidas_calientes',
                Menu_description_plate: 'Caldo de cerdo, fideos, huevo y chashu',
                Menu_ingredients: ['fideos', 'cerdo', 'huevo', 'caldo'],
                Menu_available: true,
                Restaurant_id: restaurant._id,
            },
        ]);

        console.log(' Datos demo creados (restaurante + 2 menús)');
    } catch (error) {
        console.error('Error creando datos demo:', error.message);
    }
};
