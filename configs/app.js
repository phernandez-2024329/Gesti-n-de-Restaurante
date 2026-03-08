'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import userRoutes from '../src/routes/user.routes.js';
import restaurantRoutes from '../src/routes/restaurant.routes.js';
import eventsRoutes from '../src/routes/events.routes.js';
import menuRoutes from '../src/routes/menu.routes.js';
import tableRoutes from '../src/routes/table.routes.js';
import contactRoutes from '../src/routes/contact.routes.js';
import orderRoutes from '../src/routes/orders.routes.js';
import reservationRoutes from '../src/routes/reservation.routes.js';

const BASE_PATH = '/GestorRestaurante/v1';
import reportRoutes from '../src/routes/report.routes.js';
import inventoryRoutes from '../src/routes/inventory.routes.js';
import couponRoutes from '../src/routes/coupon.routes.js';
import reviewRoutes from '../src/routes/review.routes.js';
import roleRoutes from '../src/routes/role.routes.js';
import informationRoutes from '../src/routes/information.routes.js';

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
    app.use(`${BASE_PATH}/auth`, userRoutes);
    app.use(`${BASE_PATH}/restaurant`, restaurantRoutes);
    app.use(`${BASE_PATH}/events`, eventsRoutes);
    app.use(`${BASE_PATH}/menu`, menuRoutes);
    app.use(`${BASE_PATH}/coupon`, couponRoutes);
    app.use(`${BASE_PATH}/review`, reviewRoutes);
    app.use(`${BASE_PATH}/table`, tableRoutes);
    app.use(`${BASE_PATH}/contact`, contactRoutes);
    app.use(`${BASE_PATH}/order`, orderRoutes);
    app.use(`${BASE_PATH}/reservation`, reservationRoutes);
    app.use(`${BASE_PATH}/reports`, reportRoutes);
    app.use(`${BASE_PATH}/inventory`, inventoryRoutes);
    app.use(`${BASE_PATH}/role`, roleRoutes);
    app.use(`${BASE_PATH}/information`, informationRoutes);

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
            console.log(`\n  Servidor corriendo en puerto ${PORT}`);
            console.log(` Health: http://localhost:${PORT}${BASE_PATH}/health`);
            console.log(` Auth:   http://localhost:${PORT}${BASE_PATH}/auth\n`);
        });

    } catch (error) {
        console.error(`Error al iniciar el servidor: ${error.message}`);
        process.exit(1);
    }
};
