'use strict';

import mongoose from 'mongoose';

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