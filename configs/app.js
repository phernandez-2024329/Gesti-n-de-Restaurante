'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { errorHandler } from '../middlewares/handle-errors.js';

import userRoutes        from '../src/routes/user.routes.js';
import restaurantRoutes  from '../src/routes/restaurant.routes.js';
import eventsRoutes      from '../src/routes/events.routes.js';
import ordersRoutes      from '../src/routes/orders.routes.js';
import mesaRoutes        from '../src/routes/mesa.routes.js';
import menuRoutes        from '../src/routes/menu.routes.js';
import reservationRoutes from '../src/routes/reservation.routes.js';
import contactRoutes     from '../src/routes/contact.routes.js';
import notificationRoutes from '../src/routes/notification.routes.js';
import tableRoutes       from '../src/routes/table.routes.js';

const BASE_PATH = '/GestorRestaurante/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-token']
    }));
    app.use(helmet());
    app.use(requestLimit);
    app.use(morgan('dev'));
};

const routes = (app) => {
    app.use(`${BASE_PATH}/auth`,          userRoutes);
    app.use(`${BASE_PATH}/restaurant`,    restaurantRoutes);
    app.use(`${BASE_PATH}/events`,        eventsRoutes);
    app.use(`${BASE_PATH}/orders`,        ordersRoutes);
    app.use(`${BASE_PATH}/mesas`,         mesaRoutes);
    app.use(`${BASE_PATH}/menu`,          menuRoutes);
    app.use(`${BASE_PATH}/reservations`,  reservationRoutes);
    app.use(`${BASE_PATH}/contact`,       contactRoutes);
    app.use(`${BASE_PATH}/notifications`, notificationRoutes);
    app.use(`${BASE_PATH}/tables`,        tableRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'Gestor de Restaurante API'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        });
    });
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.set('trust proxy', 1);

    try {
        await dbConnection();
        middlewares(app);
        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`\n🍽️  Servidor corriendo en puerto ${PORT}`);
            console.log(`📋 Health: http://localhost:${PORT}${BASE_PATH}/health`);
            console.log(`🔐 Auth:   http://localhost:${PORT}${BASE_PATH}/auth\n`);
        });

    } catch (error) {
        console.error(`Error al iniciar el servidor: ${error.message}`);
        process.exit(1);
    }
};