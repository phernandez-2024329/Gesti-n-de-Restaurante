import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { dbConnection } from '../configs/db.js';
import Table from '../src/models/table.model.js';
import Restaurant from '../src/models/restaurant.model.js';

dotenv.config();

const verificarMesas = async () => {
  try {
    await dbConnection();

    console.log('\n========== VERIFICACIÓN DE MESAS ==========\n');

    // 1. Contar total de mesas
    const totalMesas = await Table.countDocuments();
    console.log(`✅ Total de mesas en BD: ${totalMesas}`);

    // 2. Verificar mesas con restaurant_id
    const mesasConRestaurantId = await Table.countDocuments({ restaurant_id: { $exists: true, $ne: null } });
    console.log(`✅ Mesas con restaurant_id: ${mesasConRestaurantId}`);

    // 3. Mesas sin restaurant_id
    const mesasSinRestaurantId = await Table.countDocuments({ restaurant_id: { $exists: false } });
    console.log(`❌ Mesas sin restaurant_id: ${mesasSinRestaurantId}`);

    // 4. Distribucion por restaurante
    console.log('\n📊 Distribución de mesas por restaurante:');
    const restaurantes = await Restaurant.find({ estado: true });
    
    for (const rest of restaurantes) {
      const mesasDelRest = await Table.countDocuments({ restaurant_id: rest._id });
      console.log(`   - ${rest.restaurant_name} (${rest._id}): ${mesasDelRest} mesas`);
    }

    // 5. Mostrar un ejemplo de mesa
    console.log('\n📋 Ejemplo de mesa creada:');
    const ejemploMesa = await Table.findOne()
      .populate('restaurant_id', 'restaurant_name')
      .lean();
    
    if (ejemploMesa) {
      console.log(JSON.stringify(ejemploMesa, null, 2));
    }

    // 6. Verificar que el filtro funcione correctamente
    console.log('\n🔍 Probando filtro por restaurante:');
    if (restaurantes.length > 0) {
      const primerRestaurant = restaurantes[0];
      const mesasFiltradas = await Table.find({ restaurant_id: primerRestaurant._id });
      console.log(`   Restaurante: ${primerRestaurant.restaurant_name}`);
      console.log(`   Mesas encontradas: ${mesasFiltradas.length}`);
      console.log(`   IDs de mesas: ${mesasFiltradas.map(m => m._id.toString()).join(', ')}`);
    }

    console.log('\n✅ Verificación completada\n');

  } catch (error) {
    console.error('❌ Error en verificación:', error);
  } finally {
    mongoose.disconnect();
  }
};

verificarMesas();
