'use strict';

import Contact from '../src/models/contact.model.js';
import Table from '../src/models/table.model.js';
import Restaurant from '../src/models/restaurant.model.js';
import Dish from '../src/models/dish.model.js';
import Beverage from '../src/models/beverage.model.js';
import Menu from '../src/models/menu.model.js';

export const createDemoData = async () => {
    try {
        const existingMenu = await Menu.findOne({ name: 'Sushi Roll Especial' });
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

        const [dishSushi, dishRamen] = await Dish.insertMany([
            {
                name: 'Sushi Roll Especial',
                description: 'Roll de salmón, aguacate y queso crema',
                type: 'Plato_fuerte',
                price: 85,
                restaurant_id: restaurant._id,
            },
            {
                name: 'Ramen Tradicional',
                description: 'Caldo de cerdo, fideos, huevo y chashu',
                type: 'Plato_fuerte',
                price: 65,
                restaurant_id: restaurant._id,
            },
        ]);

        const [beverageWater, beverageTea] = await Beverage.insertMany([
            {
                name: 'Agua mineral',
                description: 'Agua mineral natural',
                type: 'Bebidas_sin_alcohol',
                price: 15,
                restaurant_id: restaurant._id,
            },
            {
                name: 'Té verde',
                description: 'Té verde tradicional japonés',
                type: 'Bebidas_calientes',
                price: 20,
                restaurant_id: restaurant._id,
            },
        ]);

        await Menu.insertMany([
            {
                name: 'Sushi Roll Especial',
                description: 'Roll de salmón, aguacate y queso crema',
                dishes: [dishSushi._id],
                beverages: [beverageWater._id],
                available: true,
                restaurant_id: restaurant._id,
            },
            {
                name: 'Ramen Tradicional',
                description: 'Caldo de cerdo, fideos, huevo y chashu',
                dishes: [dishRamen._id],
                beverages: [beverageTea._id],
                available: true,
                restaurant_id: restaurant._id,
            },
        ]);

        console.log(' Datos demo creados (restaurante + 2 platillos + 2 bebidas + 2 menús)');
    } catch (error) {
        console.error('Error creando datos demo:', error.message);
    }
};
