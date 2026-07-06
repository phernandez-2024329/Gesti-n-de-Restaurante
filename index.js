import dotenv from 'dotenv';
import { initServer } from './configs/app.js';
import { createDefaultAdmin } from './utils/seed-admin.js';
import { createDefaultClient } from './utils/seed-client.js';
import { createDemoData } from './utils/seed-demo-data.js';

dotenv.config();

const startApp = async () => {
    await initServer();
    await createDefaultAdmin();
    await createDefaultClient();
    await createDemoData();
};

startApp();
