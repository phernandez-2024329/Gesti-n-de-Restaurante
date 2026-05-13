import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { dbConnection } from '../configs/db.js';
import Restaurant from '../src/models/restaurant.model.js';
import Table from '../src/models/table.model.js';

dotenv.config();

const seedTables = async () => {
  try {
    await dbConnection();

    // Encontrar todos los restaurantes
    const restaurants = await Restaurant.find({ estado: true });
    console.log(`Encontrados ${restaurants.length} restaurantes`);

    if (restaurants.length === 0) {
      console.log('No hay restaurantes para crear mesas');
      return;
    }

    // Eliminar todas las mesas existentes
    await Table.deleteMany({});
    console.log('Mesas existentes eliminadas');

    // Crear 5 mesas por restaurante
    const tablesData = [
      { table_name: 'Mesa 1', table_number: 1, table_ubication: 'Interior', table_capacity: 2 },
      { table_name: 'Mesa 2', table_number: 2, table_ubication: 'Interior', table_capacity: 4 },
      { table_name: 'Mesa 3', table_number: 3, table_ubication: 'Terraza', table_capacity: 6 },
      { table_name: 'Mesa 4', table_number: 4, table_ubication: 'Terraza', table_capacity: 8 },
      { table_name: 'Mesa 5', table_number: 5, table_ubication: 'VIP', table_capacity: 10 }
    ];

    for (const restaurant of restaurants) {
      console.log(`Creando mesas para restaurante: ${restaurant.restaurant_name}`);

      for (const tableData of tablesData) {
        const table = new Table({
          ...tableData,
          restaurant_id: restaurant._id
        });
        await table.save();
      }
    }

    console.log('Mesas creadas exitosamente');

    // Mostrar resumen
    const totalTables = await Table.countDocuments();
    console.log(`Total de mesas creadas: ${totalTables}`);

  } catch (error) {
    console.error('Error en seed:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedTables();