'use strict';

import mongoose from 'mongoose';
import Menu from '../src/models/menu.model.js';

const cleanupLegacyMenuIndexes = async () => {
    try {
        await Menu.collection.dropIndex('Menu_id_1');
        console.log('MongoDB | índice heredado Menu_id_1 eliminado de menus');
    } catch (error) {
        if (error.code === 26 || error.code === 27 || /index not found|ns not found/i.test(error.message)) {
            return;
        }
        throw error;
    }
};

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | no se pudo conectar');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | intentando conectar...');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | conectado exitosamente');
        });
        mongoose.connection.on('open', () => {
            console.log('MongoDB | base de datos gestor_restaurante abierta');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | desconectado');
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });

        await cleanupLegacyMenuIndexes();

    } catch (error) {
        console.error(`Error al conectar la base de datos: ${error}`);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB | conexión cerrada');
    process.exit(0);
});